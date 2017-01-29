package com.softb.ipocket.budget.service;


import com.softb.ipocket.budget.model.Budget;
import com.softb.ipocket.budget.model.BudgetEntry;
import com.softb.ipocket.budget.repository.BudgetRepository;
import com.softb.ipocket.budget.web.resource.*;
import com.softb.ipocket.categorization.model.Category;
import com.softb.ipocket.categorization.web.CategoryController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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