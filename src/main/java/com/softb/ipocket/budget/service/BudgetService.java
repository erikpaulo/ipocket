package com.softb.ipocket.budget.service;

import com.softb.ipocket.account.service.AccountService;
import com.softb.ipocket.budget.model.Budget;
import com.softb.ipocket.budget.model.BudgetEntry;
import com.softb.ipocket.budget.repository.BudgetRepository;
import com.softb.ipocket.budget.web.resource.*;
import com.softb.ipocket.categorization.model.Category;
import com.softb.ipocket.categorization.model.SubCategory;
import com.softb.ipocket.categorization.web.CategoryController;
import com.softb.ipocket.categorization.web.resource.CategoryGroupResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Service for some rules related to budgets.
 */
@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Inject
    private AccountService accountService;

    @Autowired
    private CategoryController categoryController;

    public BudgetNodeRoot loadCurrentActiveBudget(Integer groupId){
        Calendar today = Calendar.getInstance();

        Budget budget = budgetRepository.findActiveByYearUser( today.get( Calendar.YEAR ), groupId );
        return loadBudget( budget, groupId );
    }

    public BudgetNodeRoot loadBudget(Integer id, Integer groupId){
        // Get user Budget and load its data.
        Budget budget = budgetRepository.findOneByUser( id, groupId );
        return loadBudget( budget, groupId );
    }

    private BudgetNodeRoot loadBudget(Budget budget, Integer groupId){
        BudgetNodeRoot nodeBudget = initBudgetNode( groupId );

        Map<String, Double> mapBudget = parseBudgetToMap(budget);

        setAmountPlanned(nodeBudget,  mapBudget.get( nodeBudget.getName() ));
        nodeBudget.setDeviation( setDeviation( nodeBudget.getTotalSpent(), nodeBudget.getTotalPlanned() ) );
        nodeBudget.setId( budget.getId() );

        for (BudgetNodeGroup nodeG: nodeBudget.getData()) {
            setAmountPlanned(nodeG,  mapBudget.get( nodeG.getName() ));
            nodeG.setDeviation( setDeviation( nodeG.getTotalSpent(), nodeG.getTotalPlanned() ) );

            for (BudgetNodeCategory nodeCat: nodeG.getData()) {
                setAmountPlanned(nodeCat,  mapBudget.get( nodeCat.getName() ));
                nodeCat.setDeviation( setDeviation( nodeCat.getTotalSpent(), nodeCat.getTotalPlanned() ) );

                for (BudgetNodeSubCategory nodeSC: nodeCat.getData()) {
                    setAmountPlanned(nodeSC,  mapBudget.get( nodeSC.getName() ));
                    nodeSC.setDeviation( setDeviation( nodeSC.getTotalSpent(), nodeSC.getTotalPlanned() ) );

                    if (budget != null){
                        for (BudgetEntry entry: budget.getEntries()) {
                            if (entry.getSubCategory().getFullName().equalsIgnoreCase( nodeSC.getName() )){
                                nodeSC.setId( entry.getId() );
                                break;
                            }
                        }
                    }
                }
            }
        }

        return nodeBudget;
    }

    private void setAmountPlanned(BudgetNode node, Double planned) {
        Calendar today = Calendar.getInstance();
        planned = (planned == null ? 0 : planned);

        if (planned > 0){
            Double total = 0.0;
            for(int i=0;i<12;i++){
                node.getPerMonthPlanned().set( i, planned );
                if (i <= today.get( Calendar.MONTH )) {
                    total += planned;
                }
            }
            node.setTotalPlanned( total );
        }
        node.setMonthPlan( planned );
    }


    /**
     * Create an blank budget instance with all active categories registered in the System
     * @param groupId User group.
     * @return
     */
    public BudgetNodeRoot initBudgetNode(Integer groupId) {
        Calendar today = Calendar.getInstance();
        Calendar startYear = Calendar.getInstance();
        startYear.set( today.get( Calendar.YEAR ), Calendar.JANUARY, 1, 0, 0, 0 );

        DateFormat formatter = new SimpleDateFormat( "MM/yyyy" );

        // Gets all entries registered for this user in this year.
        Map<String, Map<String, Double>> mapSpent = accountService.getEntriesGroupedByCategory( startYear.getTime(), today.getTime(), groupId, AccountService.GROUP_ENTRIES_BY_MONTH );

        // Get all categories, grouped by its types
        List<CategoryGroupResource> groups = categoryController.listAllCategories();

        // Create budget
        BudgetNodeRoot nodeBudget = new BudgetNodeRoot(today.get( Calendar.YEAR ), true);
        nodeBudget.setName( "Budget - "+ nodeBudget.getYear() );

        // Build the budget full structure from the active user categories.
        // groups
        Double totalBudget=0.0, totalGroup, totalCategory, totalSubCategory;
        for (CategoryGroupResource group: groups) {
            BudgetNodeGroup nodeGroup = new BudgetNodeGroup();
            nodeGroup.setName( group.getName() );

            // categories
            totalGroup = 0.0;
            for (Category category: group.getCategories()) {
                BudgetNodeCategory nodeCategory = new BudgetNodeCategory();
                nodeCategory.setName( category.getName() );

                // subcategories
                totalCategory = 0.0;
                Double multi = (category.getType().isPositive() ? 1.0 : -1.0);
                for (SubCategory subCategory: category.getSubcategories()) {
                    if (subCategory.getActivated()) {
                        BudgetNodeSubCategory nodeSubCategory = new BudgetNodeSubCategory(  );
                        nodeSubCategory.setName( subCategory.getFullName() );
                        nodeSubCategory.setSubCategory( subCategory );


                        totalSubCategory = 0.0;
                        Map<String, Double> subCatSpentMap = mapSpent.get( nodeSubCategory.getName() );
                        if (subCatSpentMap != null){

                            Double value = 0.0, valueSpent = 0.0;
                            Calendar cal = Calendar.getInstance();
                            for (int i=0;i<12;i++){
                                cal.set( Calendar.MONTH, i );
                                valueSpent = subCatSpentMap.get( formatter.format( cal.getTime() ) );
                                if (valueSpent != null){
                                    valueSpent *= multi;
                                    value  = nodeSubCategory.getPerMonthSpent().get( i ) + valueSpent;
                                    nodeSubCategory.getPerMonthSpent().set( i, value );

                                    value  = nodeCategory.getPerMonthSpent().get( i ) + valueSpent;
                                    nodeCategory.getPerMonthSpent().set( i, value );

                                    value  = nodeGroup.getPerMonthSpent().get( i ) + valueSpent;
                                    nodeGroup.getPerMonthSpent().set( i, value );

                                    value  = nodeBudget.getPerMonthSpent().get( i ) + (valueSpent * multi);
                                    nodeBudget.getPerMonthSpent().set( i, value );

                                    totalSubCategory += valueSpent;
                                    totalCategory += valueSpent;
                                    totalGroup += valueSpent;
                                    totalBudget += (valueSpent * multi); // turn the signal back, becouse totalBudget needs to consider the original sign.
                                }
                            }
                        }

                        nodeSubCategory.setAverageL3M( totalSubCategory / 3 );
                        nodeSubCategory.setTotalSpent( totalSubCategory );
                        nodeCategory.getData().add( nodeSubCategory );
                    }
                }

                nodeCategory.setAverageL3M( totalCategory / 3 );
                nodeCategory.setTotalSpent( totalCategory );
                nodeGroup.getData().add( nodeCategory );
            }

            nodeGroup.setAverageL3M( totalGroup / 3 );
            nodeGroup.setTotalSpent( totalGroup );
            nodeBudget.getData().add( nodeGroup );
        }

        nodeBudget.setAverageL3M( totalBudget / 3 );
        nodeBudget.setTotalSpent( totalBudget );

        return nodeBudget;
    }

    private Double setDeviation(Double totalExecuted, Double totalPlanned) {
        Double deviation = 100.0;

        if (totalPlanned != null && totalPlanned != 0.0){
            deviation = Math.round( ((totalExecuted - totalPlanned) / totalPlanned) * 100 ) + 0.0;
        }

        return deviation;
    }

    private Map<String, Double> parseBudgetToMap(Budget budget){
        Map<String, Double> map = new HashMap<>(  );


        Double totalBudget = 0.0;
        for (BudgetEntry entry: budget.getEntries()) {
            String groupName = entry.getSubCategory().getCategory().getType().getName();
            String catName = entry.getSubCategory().getCategory().getName();
            String subCatName = entry.getSubCategory().getFullName();

            // Group
            if ( map.get( groupName ) == null ){
                map.put( groupName, 0.0 );
            }

            // Categories
            if ( map.get( catName ) == null ){
                map.put( catName, 0.0 );
            }

            // Subcategories
            if ( map.get( subCatName ) == null ){
                map.put( subCatName, 0.0 );
            }

            // Group
            Double total = map.get( groupName ) + entry.getMonthPlan();
            map.put( groupName,  total );

            // Category
            total = map.get( catName ) + entry.getMonthPlan();
            map.put( catName,  total );

            // Subcategory
            total = map.get( subCatName ) + entry.getMonthPlan();
            map.put( subCatName,  total );

            totalBudget += (entry.getMonthPlan() * (entry.getSubCategory().getCategory().getType().isPositive() ? 1 : -1) );
        }

        map.put( "Budget - "+ budget.getYear(), totalBudget);

        return map;
    }

    public BudgetDashboard getBudgetDashboard(Integer budgetId, Integer groupId){
        List<BudgetDeviation> budgetDeviation = new ArrayList<>(  );
        budgetDeviation.add( new BudgetDeviation(  ) );
        budgetDeviation.add( new BudgetDeviation(  ) );
        budgetDeviation.add( new BudgetDeviation(  ) );

        BudgetNodeRoot budgetNode = this.loadBudget( budgetId, groupId );

        // Main deviations
        for (BudgetNodeGroup group: budgetNode.getData()) {
            for (BudgetNodeCategory category: group.getData()) {

                if (category.getTotalPlanned() != 0 || category.getTotalSpent() != 0) {
                    for (BudgetDeviation deviation: budgetDeviation.subList( 0,  budgetDeviation.size())) {
                        if (deviation.getDeviation() < category.getDeviation()) {
                            deviation.setDeviation( category.getDeviation() );
                            deviation.setTotalPlanned( category.getTotalPlanned() );
                            deviation.setTotalSpent( category.getTotalSpent() );
                            deviation.setName( category.getName() );
                            break;
                        }
                    }
                }

            }
        }

        for (int i=budgetDeviation.size()-1;i>=0;i--) {
            if (budgetDeviation.get( i ).getName() == null){
                budgetDeviation.remove( i );
            }
        }

        BudgetDashboard dashboard = new BudgetDashboard(  );
        dashboard.setData( budgetNode );
        dashboard.setMainDeviations( budgetDeviation );
        return dashboard;
    }


}