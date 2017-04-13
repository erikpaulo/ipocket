package com.softb.ipocket.bill.service;


import com.softb.ipocket.account.service.AccountService;
import com.softb.ipocket.bill.repository.BillRepository;
import com.softb.ipocket.categorization.web.CategoryController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service for some rules related to bills.
 */
@Service
public class BillService {


    private static final String GROUP_ENTRIES_BY_MONTH = "MONTH";

    @Autowired
    protected BillRepository billRepository;

    @Autowired
    protected AccountService accountService;

    @Autowired
    private CategoryController categoryController;




//		budget

//        List<Baseline> newBaseline = new ArrayList<>(  );
//
//        // Removes the current baseline if there is one.
//        List<Baseline> curBaseline =  baselineRepository.findAllByUser( groupId );
//        if (curBaseline != null){
//            baselineRepository.deleteInBatch( curBaseline );
//        }

//        for (Bill bill: bills) {
//            newBaseline.add( new Baseline( bill.getDate(), bill.getAmount(), bill.getSubCategory(), bill.getTransfer(),
//                             bill.getAccountTo(), bill.getAccountFrom(), bill.getGroupId() ) );
//        }
//        baselineRepository.save( newBaseline );
//    }

//    /**
//     * Generate the budget registered as a baseline from planned expenses and incomes. Put it togueter with the user entries
//     * registered in all his accounts.
//     * @param groupId
//     * @return
//     */
//    public BudgetNodeRootBill genBudget(Integer groupId) {
//        Calendar today = Calendar.getInstance();
//        today.set(2016, Calendar.DECEMBER, 31, 23, 59);
//        Calendar startYear = Calendar.getInstance();
//        Calendar endYear = Calendar.getInstance();
//        startYear.set( today.get( Calendar.YEAR ), Calendar.JANUARY, 1, 0, 0, 1 );
//        endYear.set( today.get( Calendar.YEAR ), Calendar.DECEMBER, 31, 23, 59, 59 );
//
//        DateFormat formatter = new SimpleDateFormat( "MM/yyyy" );
//
//        // Account Types to be considered.
//        List<Account.Type> accountTypes = new ArrayList<>(  );
//        accountTypes.add( Account.Type.CKA );
//        accountTypes.add( Account.Type.CCA );
//
//        // Gets all entries registered for this user in this year.
//        Map<String, Map<String, Double>> mapSpent = accountService.getEntriesGroupedByCategory( startYear.getTime(), today.getTime(), groupId, AccountService.GROUP_ENTRIES_BY_MONTH, accountTypes );
//
//        // Get all entries planned for this user and registered as a baseline.
//        Map<String, Map<String, Double>> mapBaseline = getBaselineGroupedByCategory( startYear.getTime(), endYear.getTime(), groupId, AccountService.GROUP_ENTRIES_BY_MONTH );
//
//        // Get all categories, grouped by its types
//        List<CategoryGroupResource> groups = categoryController.listAllCategories();
//
//        // Filter the groups of categories removing.
//        for (CategoryGroupResource group: groups) {
//            int index = 0;
//            for (Category category: group.getCategories()) {
//                if (category.getName().equalsIgnoreCase( "Cartão de Crédito" )){
//                    break;
//                }
//                index++;
//            }
//            if (index < group.getCategories().size()){
//                group.getCategories().remove( index );
//            }
//        }
//
//        // Create budget
//        BudgetNodeRootBill nodeBudget = new BudgetNodeRootBill(today.get( Calendar.YEAR ), true);
//        nodeBudget.setName( "Budget - "+ nodeBudget.getYear() );
//
//        // Build the budget full structure from the active user categories.
//        // groups
//        Double totalBudgetSpent=0.0, totalGroupSpent, totalCategorySpent, totalSubCategorySpent;
//        Double totalBudgetPlanned=0.0, totalGroupPlanned, totalCategoryPlanned, totalSubCategoryPlanned;
//        for (CategoryGroupResource group: groups) {
//            BudgetNodeGroupBill nodeGroup = new BudgetNodeGroupBill();
//            nodeGroup.setName( group.getName() );
//
//            // categories
//            totalGroupSpent = 0.0;
//            totalGroupPlanned = 0.0;
//            for (Category category: group.getCategories()) {
//                BudgetNodeCategoryBill nodeCategory = new BudgetNodeCategoryBill();
//                nodeCategory.setName( category.getName() );
//
//                // subcategories
//                totalCategorySpent = 0.0;
//                totalCategoryPlanned = 0.0;
//                Double multi = (category.getType().isPositive() ? 1.0 : -1.0);
//                for (SubCategory subCategory: category.getSubcategories()) {
//                    if (subCategory.getActivated()) {
//                        BudgetNodeSubCategoryBill nodeSubCategory = new BudgetNodeSubCategoryBill(  );
//                        nodeSubCategory.setName( subCategory.getFullName() );
//                        nodeSubCategory.setSubCategory( subCategory );
//
//
//                        totalSubCategorySpent = 0.0;
//                        totalSubCategoryPlanned = 0.0;
//                        Map<String, Double> subCatSpentMap = mapSpent.get( nodeSubCategory.getName() );
//                        Map<String, Double> subCatBaselineMap = mapBaseline.get( nodeSubCategory.getName() );
//                        if (subCatSpentMap != null || subCatBaselineMap != null){
//
//                            Double value = 0.0, valueSpent = 0.0, valueBaseline = 0.0;
////                            Calendar cal = Calendar.getInstance();
//                            Calendar cal = today;
//                            for (int i=0;i<12;i++){
//                                cal.set( Calendar.MONTH, i );
//
//                                // Spent
//                                if (subCatSpentMap != null){
//                                    valueSpent = subCatSpentMap.get( formatter.format( cal.getTime() ) );
//                                    if (valueSpent != null){
//                                        valueSpent *= multi;
//                                        value  = nodeSubCategory.getPerMonthSpent().get( i ) + valueSpent;
//                                        nodeSubCategory.getPerMonthSpent().set( i, value );
//
//                                        value  = nodeCategory.getPerMonthSpent().get( i ) + valueSpent;
//                                        nodeCategory.getPerMonthSpent().set( i, value );
//
//                                        value  = nodeGroup.getPerMonthSpent().get( i ) + valueSpent;
//                                        nodeGroup.getPerMonthSpent().set( i, value );
//
//                                        value  = nodeBudget.getPerMonthSpent().get( i ) + (valueSpent * multi);
//                                        nodeBudget.getPerMonthSpent().set( i, value );
//
//                                        totalSubCategorySpent += valueSpent;
//                                        totalCategorySpent += valueSpent;
//                                        totalGroupSpent += valueSpent;
//                                        totalBudgetSpent += (valueSpent * multi); // turn the signal back, because totalBudget needs to consider the original sign.
//                                    }
//                                }
//
//                                // Planned
//                                if (subCatBaselineMap != null){
//                                    valueBaseline = subCatBaselineMap.get( formatter.format( cal.getTime() ) );
//                                    if (valueBaseline != null){
//                                        valueBaseline *= multi;
//                                        value  = nodeSubCategory.getPerMonthPlanned().get( i ) + valueBaseline;
//                                        nodeSubCategory.getPerMonthPlanned().set( i, value );
//
//                                        value  = nodeCategory.getPerMonthPlanned().get( i ) + valueBaseline;
//                                        nodeCategory.getPerMonthPlanned().set( i, value );
//
//                                        value  = nodeGroup.getPerMonthPlanned().get( i ) + valueBaseline;
//                                        nodeGroup.getPerMonthPlanned().set( i, value );
//
//                                        value  = nodeBudget.getPerMonthPlanned().get( i ) + (valueBaseline * multi);
//                                        nodeBudget.getPerMonthPlanned().set( i, value );
//
//                                        totalSubCategoryPlanned += valueBaseline;
//                                        totalCategoryPlanned += valueBaseline;
//                                        totalGroupPlanned += valueBaseline;
//                                        totalBudgetPlanned += (valueBaseline * multi); // turn the signal back, because totalBudget needs to consider the original sign.
//                                    }
//                                }
//                            }
//                        }
//
////                        nodeSubCategory.setAverageL3M( totalSubCategorySpent / 3 );
//                        nodeSubCategory.setTotalSpent( totalSubCategorySpent );
//                        nodeSubCategory.setTotalPlanned( totalSubCategoryPlanned );
//                        nodeCategory.getData().add( nodeSubCategory );
//                    }
//                }
//
////                nodeCategory.setAverageL3M( totalCategorySpent / 3 );
//                nodeCategory.setTotalSpent( totalCategorySpent );
//                nodeCategory.setTotalPlanned( totalCategoryPlanned );
//                nodeGroup.getData().add( nodeCategory );
//            }
//
////            nodeGroup.setAverageL3M( totalGroupSpent / 3 );
//            nodeGroup.setTotalSpent( totalGroupSpent );
//            nodeGroup.setTotalPlanned( totalGroupPlanned );
//            nodeBudget.getData().add( nodeGroup );
//        }
//
////        nodeBudget.setAverageL3M( totalBudgetSpent / 3 );
//        nodeBudget.setTotalSpent( totalBudgetSpent );
//        nodeBudget.setTotalPlanned( totalBudgetPlanned );
//
//        return nodeBudget;
//    }


//	private Map<String, Map<String, Double>> getBaselineGroupedByCategory(Date start, Date end, Integer groupId, String groupBy){
//		DateFormat formatter = (groupBy.compareToIgnoreCase( GROUP_ENTRIES_BY_MONTH ) == 0 ? new SimpleDateFormat( "MM/yyyy" ) : new SimpleDateFormat( "dd/MM/yyyy" ));
//
//		// Gets all account entries inserted this year.
////		List<AccountEntry> entries = getAllEntriesByPeriod( start, end, groupId );
//        List<Baseline> baseline = baselineRepository.findAllByPeriod( start, end, groupId );
//
//		// Group all planned entries by its subcategories
//		Map<String, Map<String, Double>> map = new HashMap<>(  );
//		for (Baseline baseEntry: baseline) {
//
//			String groupName = baseEntry.getSubCategory().getCategory().getType().getName();
//			String catName = baseEntry.getSubCategory().getCategory().getName();
//			String subCatName = baseEntry.getSubCategory().getFullName();
//			String group = formatter.format( baseEntry.getDate() );
//
//			// Group
//			if ( map.get( groupName ) == null ){
//				map.put( groupName, new HashMap<String, Double>(  ) );
//			}
//			if ( map.get( groupName ).get( group ) == null ){
//				map.get( groupName ).put( group, 0.0 );
//			}
//
//			// Categories
//			if ( map.get( catName ) == null ){
//				map.put( catName, new HashMap<String, Double>(  ) );
//			}
//			if ( map.get( catName ).get( group ) == null ){
//				map.get( catName ).put( group, 0.0 );
//			}
//
//			// Subcategories
//			if ( map.get( subCatName ) == null ){
//				map.put( subCatName, new HashMap<String, Double>(  ) );
//			}
//			if ( map.get( subCatName ).get( group ) == null ){
//				map.get( subCatName ).put( group, 0.0 );
//			}
//
//			// Group
//			Double total = map.get( groupName ).get( group );
//			map.get( groupName ).put( group, baseEntry.getAmount() + total );
//
//			// Category
//			total = map.get( catName ).get( group );
//			map.get( catName ).put( group, baseEntry.getAmount() + total );
//
//			// Subcategory
//			total = map.get( subCatName ).get( group );
//			map.get( subCatName ).put( group, baseEntry.getAmount() + total );
//		}
//
//		return map;
//	}





//	/**
//	 * Returns all bills registered. They are all grouped into categories;
//	 * @param start
//	 * @param end
//	 * @param groupId
//	 * @return
//	 */
//	public Map<String,Map<String,Double>> getEntriesGroupedByCategory(Date start, Date end, Integer groupId){
//		List<Bill> bills =  billRepository.findAllByUserPeriod(start, end, groupId);
//		return groupbyCategory(bills);
//	}



}