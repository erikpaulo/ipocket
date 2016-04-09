package com.softb.ipocket.budget.web;

import com.softb.ipocket.account.repository.AccountEntryRepository;
import com.softb.ipocket.bill.repository.BillRepository;
import com.softb.ipocket.budget.model.Budget;
import com.softb.ipocket.budget.model.BudgetEntry;
import com.softb.ipocket.budget.repository.BudgetEntryRepository;
import com.softb.ipocket.budget.repository.BudgetRepository;
import com.softb.ipocket.budget.service.BudgetService;
import com.softb.ipocket.budget.web.resource.*;
import com.softb.ipocket.categorization.model.SubCategory;
import com.softb.ipocket.categorization.repository.SubCategoryRepository;
import com.softb.ipocket.categorization.web.CategoryController;
import com.softb.system.rest.AbstractRestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@RestController("AppBudgetController")
@RequestMapping("/api/budget")
public class BudgetController extends AbstractRestController<Budget, Integer> {

	public static final String BILL_OBJECT_NAME = "Budget";

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private BudgetEntryRepository budgetEntryRepository;

    @Autowired
    private CategoryController categoryController;

    @Autowired
    private SubCategoryRepository subCategoryRepository;

    @Autowired
    private AccountEntryRepository accountEntryRepository;

    @Inject
    private BudgetService budgetService;

    /**
     * Return all budgets of the current user.
     * @return
     */
    @RequestMapping(method = RequestMethod.GET)
    public List<Budget> listAll() {
        List<Budget> budgets = budgetRepository.findAllByUser( getGroupId() );
        return budgets;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.POST)
    public Budget edit(@RequestBody BudgetNodeRoot json) {

        Budget budget = budgetRepository.findOneByUser( json.getId(), getGroupId() );
        budget = budgetRepository.save( budget );

        for (BudgetNodeGroup group: json.getData()) {
            for (BudgetNodeCategory category: group.getData()) {
                for (BudgetNodeSubCategory subCategory: category.getData()) {
                    BudgetEntry entry = null;

                    if (subCategory.getId() != null)
                        entry = budgetEntryRepository.findOne( subCategory.getId() );

                    if (subCategory.getMonthPlan() == 0.0){
                        if (entry != null){ // There isn't planned, so remove...
                            budgetEntryRepository.delete( entry );
                        }
                    } else {
                        if (entry == null){
                            SubCategory sc = subCategoryRepository.findOneByUser( subCategory.getSubCategory().getId(), getGroupId() );
                            entry = new BudgetEntry( subCategory.getMonthPlan(), budget.getId(), sc, getGroupId() );
                        } else {
                            entry.setMonthPlan( subCategory.getMonthPlan() );
                        }

                        entry = budgetEntryRepository.save( entry );
                        budget.getEntries().add( entry );
                    }

                }
            }
        }

        return budget;
    }

    @RequestMapping(method = RequestMethod.POST)
    public Budget save(@RequestBody BudgetNodeRoot json) {
        Budget budget = new Budget(json.getYear(), true, getGroupId(), new ArrayList<com.softb.ipocket.budget.model.BudgetEntry>(  ));
        budget = budgetRepository.save( budget );

        for (BudgetNodeGroup group: json.getData()) {
            for (BudgetNodeCategory category: group.getData()) {
                for (BudgetNodeSubCategory subCategory: category.getData()) {
                    if (subCategory.getMonthPlan() != 0.0){
                        SubCategory sc = subCategoryRepository.findOneByUser( subCategory.getSubCategory().getId(), getGroupId() );
                        BudgetEntry entry = new BudgetEntry( subCategory.getMonthPlan(), budget.getId(), sc, getGroupId() );

                        entry = budgetEntryRepository.save( entry );
                        budget.getEntries().add( entry );
                    }
                }
            }
        }

        return budget;
    }

    @RequestMapping(value="/{id}/dashboard", method = RequestMethod.GET)
    public BudgetDashboard dashboard(@PathVariable Integer id) {
        return budgetService.getBudgetDashboard( id, getGroupId() );
    }

    /**
     * Create a new instance of Budget to be defined by the user.
     * @return
     */
    @RequestMapping(value ="/new" ,method = RequestMethod.GET)
    public BudgetNodeRoot init() {
        return budgetService.initBudgetNode( getGroupId() );
    }

    @RequestMapping(value ="/{id}" ,method = RequestMethod.GET)
    public BudgetNodeRoot getBudget(@PathVariable Integer id) {
        return budgetService.loadBudget( id, getGroupId() );
    }

    private String getGroupDateId(Date date){
        Calendar group = Calendar.getInstance();
        group.setTime( date );

        return (group.get( Calendar.MONTH ) +"/"+ group.get( Calendar.YEAR ));
    }
}

