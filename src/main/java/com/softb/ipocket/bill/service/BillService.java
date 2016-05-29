package com.softb.ipocket.bill.service;


import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.account.service.AccountService;
import com.softb.ipocket.bill.model.Baseline;
import com.softb.ipocket.bill.model.Bill;
import com.softb.ipocket.bill.repository.BaselineRepository;
import com.softb.ipocket.bill.repository.BillRepository;
import com.softb.ipocket.bill.web.resource.*;
import com.softb.ipocket.categorization.model.Category;
import com.softb.ipocket.categorization.model.SubCategory;
import com.softb.ipocket.categorization.web.CategoryController;
import com.softb.ipocket.categorization.web.resource.CategoryGroupResource;
import com.softb.system.errorhandler.exception.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Map.Entry;

/**
 * Service for some rules related to bills.
 */
@Service
public class BillService {

	public static final String CASHFLOW_GROUP_DAY = "Day";
    private static final String GROUP_ENTRIES_BY_MONTH = "MONTH";

    @Autowired
    protected BaselineRepository baselineRepository;

    @Autowired
    protected BillRepository billRepository;

    @Autowired
    protected AccountService accountService;

    @Autowired
    private CategoryController categoryController;

	/**
	 * This service generates the impact the bills does into the accounts. Calculating the cashflow.
	 * @param startDate The begining of the period to be considered
	 * @param endDate The end of the period to be considered
	 * @param groupBy Can be grouped by Day
	 * @param accounts Accounts to be considered
	 * @param bills Bills that generates those impacts into the accounts
     * @return Cashflow
     */
	public CashFlowProjectionResource genCachFlowProjection(Date startDate, Date endDate, String groupBy, List<Account> accounts, List<Bill> bills) {
		HashMap<String, Double> labels = new HashMap<String, Double>();
		Map<String, Map<String, Double>> series = new HashMap<String, Map<String, Double>>();

		// Gera os labels com todos os dias contidos no período.
		Calendar date = Calendar.getInstance();
		date.setTime(startDate);

		// Generate the labels, grouped by day or month, as chosen.
		while ( date.getTime().compareTo(endDate) <= 0 ){
			labels.put(getGroupId(date.getTime(), groupBy), 0.0);
			if ( groupBy.equalsIgnoreCase(CASHFLOW_GROUP_DAY) ){
				date.add(Calendar.DAY_OF_MONTH, 1);
			}
		}

		// Goes over the accounts, calculating its amountCurrent.
		for (Account account: accounts){
			// Atualiza a soma do agrupamento.
			doSum(series, labels, account.getName(), account.getCreateDate(), startDate, endDate, account.getStartBalance(), groupBy);
			for (AccountEntry entry: account.getEntries()){
				doSum(series, labels, account.getName(), entry.getDate(), startDate, endDate, entry.getAmount(), groupBy);
			}
		}

		// Goes over the bills entries, calculating the impact into the account cashflows.
		for (Bill bill: bills){
			String accountToName = (bill.getAccountTo() != null ? bill.getAccountTo().getName(): "");
			String accountFromName = (bill.getAccountFrom() != null ? bill.getAccountFrom().getName() : "");

            if (series.containsKey(accountToName)){
                doSum(series, labels, accountToName, bill.getDate(), startDate, endDate, bill.getAmount(), groupBy);
            }
            if (series.containsKey(accountFromName)){
                doSum(series, labels, accountFromName, bill.getDate(), startDate, endDate, bill.getAmount()*-1, groupBy);
            }
		}

		// Delete the no-value points
		if ( groupBy.equalsIgnoreCase(CASHFLOW_GROUP_DAY) ){
			List<String> labelsToDel = new ArrayList<>();
			Boolean found;

			for (Entry<String, Double> label: labels.entrySet()){
				found = false;

				for (Entry<String, Map<String, Double>> col: series.entrySet()){
					Double amount = col.getValue().get(label.getKey());
					if ( amount.compareTo(0.0) == 0 ){
						found = true;
					} else {
						found = false;
						break;
					}
				}

				if (found){
					labelsToDel.add(label.getKey());
				}

			}
			for (String labelName: labelsToDel){
				labels.remove(labelName);

				for (Entry<String, Map<String, Double>> col: series.entrySet()){
					col.getValue().remove(labelName);
				}
			}

		}

		// Sort
		List<String> labelNames = new ArrayList<>();
		labelNames.addAll(labels.keySet());
		Collections.sort(labelNames, new Comparator<String>() {
			@Override
			public int compare(String  date1, String  date2) {
				int compare;
				DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
				Date lDate;
				Date fDate;
				try {
					fDate = formatter.parse(date1);
					lDate = formatter.parse(date2);
					compare = fDate.compareTo(lDate);
				} catch (ParseException e) {
					throw new BusinessException( e.getMessage() );
				}
				return compare;
			}
		});

		// Generate accumulated projection
		CashFlowProjectionResource cashFlow = new CashFlowProjectionResource();
		for (Entry<String, Map<String, Double>> serie: series.entrySet()){
			AccountCashFlowResource accountCF = new AccountCashFlowResource(serie.getKey(), new ArrayList<Double>(  ));
//			accountCF.setName(serie.getKey());

			Double balance = 0.0;
			for (String labelName: labelNames){
				Double amount = serie.getValue().get(labelName);
				balance += amount;
				accountCF.getData().add(balance);
			}
			cashFlow.getSeries().add(accountCF);
		}
		cashFlow.setLabels(labelNames);

		return cashFlow;
	}

    /**
     * Save the current plan defined for this user rewriting the current baseline if there is one.
     * @param groupId
     */
	public void saveBaseline(Integer groupId){
        List<Baseline> newBaseline = new ArrayList<>(  );

        // Removes the current baseline if there is one.
        List<Baseline> curBaseline =  baselineRepository.findAllByUser( groupId );
        if (curBaseline != null){
            baselineRepository.deleteInBatch( curBaseline );
        }

        // Save the current plan
        List<Bill> bills = billRepository.findAllByUser( groupId );
        for (Bill bill: bills) {
            newBaseline.add( new Baseline( bill.getDate(), bill.getAmount(), bill.getSubCategory(), bill.getTransfer(),
                             bill.getAccountTo(), bill.getAccountFrom(), bill.getGroupId() ) );
        }
        baselineRepository.save( newBaseline );
    }

    /**
     * Generate the budget registered as a baseline from planned expenses and incomes. Put it togueter with the user entries
     * registered in all his accounts.
     * @param groupId
     * @return
     */
    public BudgetNodeRoot genBudget(Integer groupId) {
        Calendar today = Calendar.getInstance();
        Calendar startYear = Calendar.getInstance();
        Calendar endYear = Calendar.getInstance();
        startYear.set( today.get( Calendar.YEAR ), Calendar.JANUARY, 1, 0, 0, 1 );
        endYear.set( today.get( Calendar.YEAR ), Calendar.DECEMBER, 31, 23, 59, 59 );

        DateFormat formatter = new SimpleDateFormat( "MM/yyyy" );

        // Account Types to be considered.
        List<Account.Type> accountTypes = new ArrayList<>(  );
        accountTypes.add( Account.Type.CKA );
        accountTypes.add( Account.Type.CCA );

        // Gets all entries registered for this user in this year.
        Map<String, Map<String, Double>> mapSpent = accountService.getEntriesGroupedByCategory( startYear.getTime(), today.getTime(), groupId, AccountService.GROUP_ENTRIES_BY_MONTH, accountTypes );

        // Get all entries planned for this user and registered as a baseline.
        Map<String, Map<String, Double>> mapBaseline = getBaselineGroupedByCategory( startYear.getTime(), endYear.getTime(), groupId, AccountService.GROUP_ENTRIES_BY_MONTH );

        // Get all categories, grouped by its types
        List<CategoryGroupResource> groups = categoryController.listAllCategories();

        // Filter the groups of categories removing.
        for (CategoryGroupResource group: groups) {
            int index = 0;
            for (Category category: group.getCategories()) {
                if (category.getName().equalsIgnoreCase( "Cartão de Crédito" )){
                    break;
                }
                index++;
            }
            if (index < group.getCategories().size()){
                group.getCategories().remove( index );
            }
        }

        // Create budget
        BudgetNodeRoot nodeBudget = new BudgetNodeRoot(today.get( Calendar.YEAR ), true);
        nodeBudget.setName( "Budget - "+ nodeBudget.getYear() );

        // Build the budget full structure from the active user categories.
        // groups
        Double totalBudgetSpent=0.0, totalGroupSpent, totalCategorySpent, totalSubCategorySpent;
        Double totalBudgetPlanned=0.0, totalGroupPlanned, totalCategoryPlanned, totalSubCategoryPlanned;
        for (CategoryGroupResource group: groups) {
            BudgetNodeGroup nodeGroup = new BudgetNodeGroup();
            nodeGroup.setName( group.getName() );

            // categories
            totalGroupSpent = 0.0;
            totalGroupPlanned = 0.0;
            for (Category category: group.getCategories()) {
                BudgetNodeCategory nodeCategory = new BudgetNodeCategory();
                nodeCategory.setName( category.getName() );

                // subcategories
                totalCategorySpent = 0.0;
                totalCategoryPlanned = 0.0;
                Double multi = (category.getType().isPositive() ? 1.0 : -1.0);
                for (SubCategory subCategory: category.getSubcategories()) {
                    if (subCategory.getActivated()) {
                        BudgetNodeSubCategory nodeSubCategory = new BudgetNodeSubCategory(  );
                        nodeSubCategory.setName( subCategory.getFullName() );
                        nodeSubCategory.setSubCategory( subCategory );


                        totalSubCategorySpent = 0.0;
                        totalSubCategoryPlanned = 0.0;
                        Map<String, Double> subCatSpentMap = mapSpent.get( nodeSubCategory.getName() );
                        Map<String, Double> subCatBaselineMap = mapBaseline.get( nodeSubCategory.getName() );
                        if (subCatSpentMap != null || subCatBaselineMap != null){

                            Double value = 0.0, valueSpent = 0.0, valueBaseline = 0.0;
                            Calendar cal = Calendar.getInstance();
                            for (int i=0;i<12;i++){
                                cal.set( Calendar.MONTH, i );

                                // Spent
                                if (subCatSpentMap != null){
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

                                        totalSubCategorySpent += valueSpent;
                                        totalCategorySpent += valueSpent;
                                        totalGroupSpent += valueSpent;
                                        totalBudgetSpent += (valueSpent * multi); // turn the signal back, because totalBudget needs to consider the original sign.
                                    }
                                }

                                // Planned
                                if (subCatBaselineMap != null){
                                    valueBaseline = subCatBaselineMap.get( formatter.format( cal.getTime() ) );
                                    if (valueBaseline != null){
                                        valueBaseline *= multi;
                                        value  = nodeSubCategory.getPerMonthPlanned().get( i ) + valueBaseline;
                                        nodeSubCategory.getPerMonthPlanned().set( i, value );

                                        value  = nodeCategory.getPerMonthPlanned().get( i ) + valueBaseline;
                                        nodeCategory.getPerMonthPlanned().set( i, value );

                                        value  = nodeGroup.getPerMonthPlanned().get( i ) + valueBaseline;
                                        nodeGroup.getPerMonthPlanned().set( i, value );

                                        value  = nodeBudget.getPerMonthPlanned().get( i ) + (valueBaseline * multi);
                                        nodeBudget.getPerMonthPlanned().set( i, value );

                                        totalSubCategoryPlanned += valueBaseline;
                                        totalCategoryPlanned += valueBaseline;
                                        totalGroupPlanned += valueBaseline;
                                        totalBudgetPlanned += (valueBaseline * multi); // turn the signal back, because totalBudget needs to consider the original sign.
                                    }
                                }
                            }
                        }

                        nodeSubCategory.setAverageL3M( totalSubCategorySpent / 3 );
                        nodeSubCategory.setTotalSpent( totalSubCategorySpent );
                        nodeSubCategory.setTotalPlanned( totalSubCategoryPlanned );
                        nodeCategory.getData().add( nodeSubCategory );
                    }
                }

                nodeCategory.setAverageL3M( totalCategorySpent / 3 );
                nodeCategory.setTotalSpent( totalCategorySpent );
                nodeCategory.setTotalPlanned( totalCategoryPlanned );
                nodeGroup.getData().add( nodeCategory );
            }

            nodeGroup.setAverageL3M( totalGroupSpent / 3 );
            nodeGroup.setTotalSpent( totalGroupSpent );
            nodeGroup.setTotalPlanned( totalGroupPlanned );
            nodeBudget.getData().add( nodeGroup );
        }

        nodeBudget.setAverageL3M( totalBudgetSpent / 3 );
        nodeBudget.setTotalSpent( totalBudgetSpent );
        nodeBudget.setTotalPlanned( totalBudgetPlanned );

        return nodeBudget;
    }


	private Map<String, Map<String, Double>> getBaselineGroupedByCategory(Date start, Date end, Integer groupId, String groupBy){
		DateFormat formatter = (groupBy.compareToIgnoreCase( GROUP_ENTRIES_BY_MONTH ) == 0 ? new SimpleDateFormat( "MM/yyyy" ) : new SimpleDateFormat( "dd/MM/yyyy" ));

		// Gets all account entries inserted this year.
//		List<AccountEntry> entries = getAllEntriesByPeriod( start, end, groupId );
        List<Baseline> baseline = baselineRepository.findAllByPeriod( start, end, groupId );

		// Group all planned entries by its subcategories
		Map<String, Map<String, Double>> map = new HashMap<>(  );
		for (Baseline baseEntry: baseline) {

			String groupName = baseEntry.getSubCategory().getCategory().getType().getName();
			String catName = baseEntry.getSubCategory().getCategory().getName();
			String subCatName = baseEntry.getSubCategory().getFullName();
			String group = formatter.format( baseEntry.getDate() );

			// Group
			if ( map.get( groupName ) == null ){
				map.put( groupName, new HashMap<String, Double>(  ) );
			}
			if ( map.get( groupName ).get( group ) == null ){
				map.get( groupName ).put( group, 0.0 );
			}

			// Categories
			if ( map.get( catName ) == null ){
				map.put( catName, new HashMap<String, Double>(  ) );
			}
			if ( map.get( catName ).get( group ) == null ){
				map.get( catName ).put( group, 0.0 );
			}

			// Subcategories
			if ( map.get( subCatName ) == null ){
				map.put( subCatName, new HashMap<String, Double>(  ) );
			}
			if ( map.get( subCatName ).get( group ) == null ){
				map.get( subCatName ).put( group, 0.0 );
			}

			// Group
			Double total = map.get( groupName ).get( group );
			map.get( groupName ).put( group, baseEntry.getAmount() + total );

			// Category
			total = map.get( catName ).get( group );
			map.get( catName ).put( group, baseEntry.getAmount() + total );

			// Subcategory
			total = map.get( subCatName ).get( group );
			map.get( subCatName ).put( group, baseEntry.getAmount() + total );
		}

		return map;
	}

	private String getGroupId(Date source, String groupBy){
		DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		String groupName = "";

		// Agrupamento por dia.
		if (CASHFLOW_GROUP_DAY.equalsIgnoreCase(groupBy)){
			groupName = formatter.format(source);
		}

		return groupName;
	}

	// Realiza a soma do valor no mês correspondente.
	private void doSum(	Map<String, Map<String, Double>> series, HashMap<String, Double> labels, String serieName,
						Date date, 	Date start, Date end, Double amount, String groupBy) {

		if (!series.containsKey(serieName)){
			series.put(serieName, new HashMap<>(labels));
		}

		if ( date.compareTo(start) >= 0 && date.compareTo(end) <= 0 ){
			Double balance = series.get(serieName).get(getGroupId(date, groupBy));
			balance += amount;
			series.get(serieName).put(getGroupId(date, groupBy), balance);
		} else {
			if ( date.before(start) ){
				Double balance = series.get(serieName).get(getGroupId(start, groupBy));
				balance += amount;
				series.get(serieName).put(getGroupId(start, groupBy), balance);
			}
		}
	}
}