package com.softb.ipocket.bill.web;

import com.softb.ipocket.budget.model.Budget;
import com.softb.ipocket.budget.model.BudgetEntry;
import com.softb.ipocket.budget.repository.BudgetEntryRepository;
import com.softb.ipocket.budget.repository.BudgetRepository;
import com.softb.ipocket.bill.service.BudgetService;
import com.softb.ipocket.budget.web.resource.BudgetNodeRoot;
import com.softb.ipocket.budget.web.resource.NonAllocatedCategory;
import com.softb.ipocket.categorization.model.Category;
import com.softb.ipocket.categorization.model.SubCategory;
import com.softb.ipocket.categorization.repository.SubCategoryRepository;
import com.softb.ipocket.categorization.web.CategoryController;
import com.softb.ipocket.categorization.web.resource.CategoryGroupResource;
import com.softb.system.errorhandler.exception.BusinessException;
import com.softb.system.rest.AbstractRestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.*;

@RestController("AppBudgetController")
@RequestMapping("/api/budget")
public class BudgetController extends AbstractRestController<Budget, Integer> {

	public static final String BUDGET_OBJECT_NAME = "Budget";
	public static final String BUDGET_ENTRY_OBJECT_NAME = "BudgetEntry";

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private BudgetEntryRepository budgetEntryRepository;

    @Autowired
    private SubCategoryRepository subCategoryRepository;

    @Inject
    private CategoryController categoryController;

    @Inject
    private BudgetService budgetService;


    @RequestMapping(method = RequestMethod.GET)
    public BudgetNodeRoot getCurrentBudget() {
        Integer year = Calendar.getInstance().get(Calendar.YEAR);

        BudgetNodeRoot budget = budgetService.getBudget(year, getGroupId());

        return budget;
    }


    @RequestMapping(value = "/followup", method = RequestMethod.GET)
    public BudgetNodeRoot getCurrentBudgetFollowUp() {
        Integer year = Calendar.getInstance().get(Calendar.YEAR);

        BudgetNodeRoot budget = budgetService.getBudget(year, getGroupId());

        budget = budgetService.fillsSpentInformation(budget, getGroupId());

        return budget;
    }


    @RequestMapping(value = "/entry", method = RequestMethod.POST)
    public BudgetNodeRoot create(@RequestBody BudgetEntry json) throws CloneNotSupportedException {

        json.setGroupId( getGroupId() );

        SubCategory subCategory = subCategoryRepository.findOneByUser(json.getSubCategoryId(), getGroupId());
        json.setSubCategory(subCategory);
        json.setPositive(subCategory.getCategory().getType().isPositive());

        validate( BUDGET_ENTRY_OBJECT_NAME, json );
        budgetEntryRepository.save(json);

        return this.getCurrentBudget();
    }

    @RequestMapping(value = "/entry/{id}", method = RequestMethod.DELETE)
    public BudgetNodeRoot delete(@PathVariable Integer id) throws CloneNotSupportedException {

        BudgetEntry budgetEntry = budgetEntryRepository.findOne(id);
        if ( !budgetEntry.getGroupId().equals(getGroupId()) ){
            throw new BusinessException("This budget entry doesn't belong to current user");
        }
        budgetEntryRepository.delete(budgetEntry);

        return this.getCurrentBudget();
    }

    @RequestMapping(value = "/entry/{id}", method = RequestMethod.PUT)
    public BudgetNodeRoot save(@RequestBody BudgetEntry json) throws CloneNotSupportedException {

        SubCategory subCategory = subCategoryRepository.findOneByUser(json.getSubCategoryId(), getGroupId());
        json.setSubCategory(subCategory);

        json.setGroupId( getGroupId() );
        validate(BUDGET_ENTRY_OBJECT_NAME, json);

        budgetEntryRepository.save(json);

        return this.getCurrentBudget();
    }

    /**
     * Return all categories not yet allocated in the current user budget.
     * @return
     */
    @RequestMapping(value = "/nonAllocatedCategories", method = RequestMethod.GET)
    public List<NonAllocatedCategory> listNonAllocatedCategories() {
        Integer year = Calendar.getInstance().get(Calendar.YEAR);

        Budget budget = budgetRepository.findAllByUser(year, getGroupId());
        List<CategoryGroupResource> groups = categoryController.listAllCategories();


        Map allocatedCategories = new HashMap<Integer, SubCategory>();
        if (budget != null && budget.getEntries() != null) {
            for (BudgetEntry entry: budget.getEntries()) {
                allocatedCategories.put(entry.getSubCategory().getId(), entry.getSubCategory());
            }
        }

        List<NonAllocatedCategory> nonAllocatedCategories = new ArrayList<>();
        for (CategoryGroupResource group: groups) {
            for (Category category: group.getCategories()) {
                for (SubCategory subCategory: category.getSubcategories()) {
                    if(allocatedCategories.get(subCategory.getId()) == null){
                        nonAllocatedCategories.add(new NonAllocatedCategory(subCategory.getId(), group.getName() +" : "+ category.getName() +" : "+ subCategory.getName()));
                    }
                }
            }
        }

        return nonAllocatedCategories;
    }
}

