package com.softb.ipocket.budget.service;


import com.softb.ipocket.account.service.AccountService;
import com.softb.ipocket.bill.service.BillService;
import com.softb.ipocket.budget.model.Budget;
import com.softb.ipocket.budget.model.BudgetEntry;
import com.softb.ipocket.budget.repository.BudgetRepository;
import com.softb.ipocket.budget.web.resource.*;
import com.softb.ipocket.categorization.model.Category;
import com.softb.ipocket.categorization.web.CategoryController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for some rules related to budget.
 */
@Service
public class BudgetService {

	@Autowired
	private BudgetRepository budgetRepository;

    @Autowired
    private CategoryController categoryController;

    @Autowired
    protected AccountService accountService;

    @Autowired
    protected BillService billService;

    /**
     * Get user budget with its categories
     * @param year
     * @param userId
     * @return
     */
	public BudgetNodeRoot getBudget(Integer year, Integer userId){

	    Budget budget = budgetRepository.findAllByUser(year, userId);
        if (budget == null){
            budget = new Budget(year, userId);
            budget = budgetRepository.save(budget);
        }

        // Create hierarchical tree structureMap
        Map<String, Map<String, ArrayList<BudgetEntry>>> groupMap = new HashMap<>();
        Map<String, ArrayList<BudgetEntry>> categoryMap;
        ArrayList<BudgetEntry> subCategories;
        for (BudgetEntry entry: budget.getEntries()) {
            String groupName = entry.getSubCategory().getCategory().getType().getName();
            String categoryName = entry.getSubCategory().getCategory().getName();

            if (groupMap.get(groupName) == null){
                groupMap.put(groupName, new HashMap());
            }
            categoryMap = groupMap.get(groupName);

            if (categoryMap.get(categoryName) == null){
                categoryMap.put(categoryName, new ArrayList<BudgetEntry>());
            }
            subCategories = categoryMap.get(categoryName);
            subCategories.add(entry);
        }

        // Construct the budget structure
        BudgetNodeRoot budgetRoot = new BudgetNodeRoot(budget.getId(), year);
        for (String keyG: groupMap.keySet()) {
            BudgetNodeGroup budgetGroup = new BudgetNodeGroup(keyG);

            Map<String, ArrayList<BudgetEntry>> catMap = groupMap.get(keyG);
            for (String keyC: catMap.keySet()) {
                BudgetNodeCategory budgetCategory = new BudgetNodeCategory(keyC);

                subCategories = catMap.get(keyC);
                for (BudgetEntry entry: subCategories.subList(0, subCategories.size())) {
                    BudgetNodeSubCategory budgetSubCategory = new BudgetNodeSubCategory(entry.getId(), entry.getSubCategory().getName(), entry.getSubCategory());
                    budgetCategory.getData().add(budgetSubCategory);
                    budgetCategory.setIsPositive(entry.getPositive());
                    budgetGroup.setIsPositive(entry.getPositive());

                    setPerMonthPlanned(budgetSubCategory, entry);
                    setPerMonthPlanned(budgetCategory, entry);
                    setPerMonthPlanned(budgetGroup, entry);
                    setPerMonthPlanned(budgetRoot, entry);

                    if (entry.getSubCategory().getCategory().getType().equals(Category.Type.EXP)){
                        budgetRoot.setTotalExpense( budgetRoot.getTotalExpense() + budgetSubCategory.getTotalPlanned() );
                    } else if (entry.getSubCategory().getCategory().getType().equals(Category.Type.INC)){
                        budgetRoot.setTotalIncome( budgetRoot.getTotalIncome() + budgetSubCategory.getTotalPlanned() );
                    } else {
                        budgetRoot.setTotalInvested( budgetRoot.getTotalInvested() + budgetSubCategory.getTotalPlanned() );
                    }
                }
                budgetGroup.getData().add(budgetCategory);
            }
            budgetRoot.getData().add(budgetGroup);
        }

        budgetRoot.setTotalNotAllocated( budgetRoot.getTotalIncome() - budgetRoot.getTotalExpense() - budgetRoot.getTotalInvested());

        return budgetRoot;
	}

    /**
     * Fills in budget the user spent information.
     * @param budget Budget to be filled
     * @return
     */
	public BudgetNodeRoot fillsSpentInformation (BudgetNodeRoot budget, Integer groupId){
        Calendar today = Calendar.getInstance();
        Calendar startYear = Calendar.getInstance();
        Calendar endYear = Calendar.getInstance();
        startYear.set( today.get( Calendar.YEAR ), Calendar.JANUARY, 1, 0, 0, 1 );
        endYear.set( today.get( Calendar.YEAR ), Calendar.DECEMBER, 31, 23, 59, 59 );

        DateFormat formatter = new SimpleDateFormat( "MM/yyyy" );

        // Gets all entries registered for this user in this year.
        Map<String, Map<String, Double>> mapSpent = accountService.getEntriesGroupedByCategory( startYear.getTime(), today.getTime(), groupId, AccountService.GROUP_ENTRIES_BY_MONTH, null );

        // Get all bills registered until the end of the current year.
        // The future is considered through bills projected by the user.
        Map<String, Map<String, Double>> mapBill = billService.getEntriesGroupedByCategory(today.getTime(), endYear.getTime(), groupId);

        Double totalGroupSpent, totalCategorySpent, totalSubCategorySpent, totalDeviation=0.0, totalBudgetSpent=0.0;
        Double groupDeviation;
        for (BudgetNodeGroup group: budget.getData()) {

            // categories
            totalGroupSpent = 0.0; groupDeviation = 0.0;
            for (BudgetNodeCategory category: group.getData()) {

                // subcategories
                totalCategorySpent = 0.0;
                Double multi = (category.getIsPositive() ? 1.0 : -1.0);
                for (BudgetNodeSubCategory subCategory: category.getData()) {

                    totalSubCategorySpent = 0.0;
                    Map<String, Double> subCatSpentMap = mapSpent.get( subCategory.getFullName() );
                    Map<String, Double> subCatBillMap = mapBill.get( subCategory.getFullName() );
                    if (subCatSpentMap != null || subCatBillMap != null ){

                        Double value, valueSpent;
                        Calendar cal = Calendar.getInstance();
                        cal.setTime(today.getTime());
                        for (int i=0;i<12;i++){
                            cal.set( Calendar.MONTH, i );

                            valueSpent = null;
                            if (i > today.get(Calendar.MONTH)) {
                                if (subCatBillMap != null){
                                    valueSpent = subCatBillMap.get( formatter.format( cal.getTime() ) );
                                }
                            } else {
                                if (subCatSpentMap != null) {
                                   valueSpent = subCatSpentMap.get( formatter.format( cal.getTime() ) );
                                }
                            }

                            // Spent
                            if (valueSpent != null){
                                valueSpent *= multi;
                                value  = subCategory.getPerMonthSpent().get( i ) + valueSpent;
                                subCategory.getPerMonthSpent().set( i, value );

                                value  = category.getPerMonthSpent().get( i ) + valueSpent;
                                category.getPerMonthSpent().set( i, value );

                                value  = group.getPerMonthSpent().get( i ) + valueSpent;
                                group.getPerMonthSpent().set( i, value );

                                value  = budget.getPerMonthSpent().get( i ) + (valueSpent * multi);
                                budget.getPerMonthSpent().set( i, value );

                                totalSubCategorySpent += valueSpent;
                                totalCategorySpent += valueSpent;
                                totalGroupSpent += valueSpent;
                                totalBudgetSpent += (valueSpent * multi); // turn the signal back, because totalBudget needs to consider the original sign.
                            }

                        }
                    }
                    subCategory.setTotalSpent( totalSubCategorySpent );
                    if (subCategory.getIsPositive()){
                        subCategory.setDeviation(subCategory.getTotalSpent() - subCategory.getTotalPlanned());
                    } else {
                        subCategory.setDeviation(subCategory.getTotalPlanned() - subCategory.getTotalSpent());
                    }

                }
                category.setAverageL3M( totalCategorySpent / 3 );
                category.setTotalSpent( totalCategorySpent );
                if (category.getIsPositive()){
                    category.setDeviation(category.getTotalSpent() - category.getTotalPlanned());
                } else {
                    category.setDeviation(category.getTotalPlanned() - category.getTotalSpent());
                }

            }
            group.setAverageL3M( totalGroupSpent / 3 );
            group.setTotalSpent( totalGroupSpent );
            if (group.getIsPositive()){
                groupDeviation = group.getTotalSpent() - group.getTotalPlanned();
            } else {
                groupDeviation = group.getTotalPlanned() - group.getTotalSpent();
            }
            group.setDeviation(groupDeviation);
            totalDeviation += groupDeviation;

        }
        budget.setAverageL3M( totalBudgetSpent / 3 );
        budget.setTotalSpent( totalBudgetSpent );
        budget.setDeviation(totalDeviation);

        return budget;
    }

    /**
     * Fills the current user bills and projections.
     * @param budget
     * @param groupId
     * @return
     */
    public BudgetNodeRoot fillsBillInformation (BudgetNodeRoot budget, Integer groupId){
        Calendar today = Calendar.getInstance();
        Calendar startYear = Calendar.getInstance();
        Calendar endYear = Calendar.getInstance();
        startYear.set( today.get( Calendar.YEAR ), Calendar.JANUARY, 1, 0, 0, 1 );
        endYear.set( today.get( Calendar.YEAR ), Calendar.DECEMBER, 31, 23, 59, 59 );

        // Get all bills registered until the end of the current year
        Map<String, Map<String, Double>> mapSpent = billService.getEntriesGroupedByCategory(today.getTime(), endYear.getTime(), groupId);

	    return budget;
    }

    private void setPerMonthPlanned(BudgetNode node, BudgetEntry entry) {
        node.getPerMonthPlanned().set(0,  node.getPerMonthPlanned().get(0)  + entry.getJan());
        node.getPerMonthPlanned().set(1,  node.getPerMonthPlanned().get(1)  + entry.getFeb());
        node.getPerMonthPlanned().set(2,  node.getPerMonthPlanned().get(2)  + entry.getMar());
        node.getPerMonthPlanned().set(3,  node.getPerMonthPlanned().get(3)  + entry.getApr());
        node.getPerMonthPlanned().set(4,  node.getPerMonthPlanned().get(4)  + entry.getMay());
        node.getPerMonthPlanned().set(5,  node.getPerMonthPlanned().get(5)  + entry.getJun());
        node.getPerMonthPlanned().set(6,  node.getPerMonthPlanned().get(6)  + entry.getJul());
        node.getPerMonthPlanned().set(7,  node.getPerMonthPlanned().get(7)  + entry.getAug());
        node.getPerMonthPlanned().set(8,  node.getPerMonthPlanned().get(8)  + entry.getSep());
        node.getPerMonthPlanned().set(9,  node.getPerMonthPlanned().get(9)  + entry.getOct());
        node.getPerMonthPlanned().set(10, node.getPerMonthPlanned().get(10) + entry.getNov());
        node.getPerMonthPlanned().set(11, node.getPerMonthPlanned().get(11) + entry.getDec());

        Double  totalPlanned = entry.getJan() + entry.getFeb() + entry.getMar() + entry.getApr() +
                               entry.getMay() + entry.getJun() + entry.getJul() + entry.getAug() +
                               entry.getSep() + entry.getOct() + entry.getNov() + entry.getDec();

        node.setTotalPlanned( node.getTotalPlanned() + totalPlanned );
    }
}