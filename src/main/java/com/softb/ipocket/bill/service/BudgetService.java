package com.softb.ipocket.bill.service;


import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.account.service.AccountService;
import com.softb.ipocket.bill.model.Bill;
import com.softb.ipocket.bill.repository.BillRepository;
import com.softb.ipocket.bill.web.resource.*;
import com.softb.ipocket.budget.model.Budget;
import com.softb.ipocket.budget.model.BudgetEntry;
import com.softb.ipocket.budget.repository.BudgetEntryRepository;
import com.softb.ipocket.budget.repository.BudgetRepository;
import com.softb.ipocket.categorization.model.Category;
import com.softb.ipocket.categorization.model.SubCategory;
import com.softb.ipocket.categorization.web.CategoryController;
import com.softb.system.errorhandler.exception.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Service for some rules related to budget.
 */
@Service
public class BudgetService {
    public static final String CASHFLOW_GROUP_DAY = "Day";
    private static final String INVESTMENT_CATEGORY_NAME = "Investimentos";

	@Autowired
	private BudgetRepository budgetRepository;

	@Autowired
	private BudgetEntryRepository budgetEntryRepository;

    @Autowired
    private CategoryController categoryController;

    @Autowired
    protected AccountService accountService;

    @Autowired
    protected BillRepository billRepository;

    /**
     * Get user budget with its categories
     * @param year
     * @param userId
     * @return
     */
	public BudgetNodeRoot getBudget(Integer year, Integer userId){
        // Create hierarchical tree structureMap
        Map<String, Map<String, Map<String, BudgetEntry>>> groupMap = new HashMap<>();
        Map<String, Map<String, BudgetEntry>> categoryMap;
        Map<String, BudgetEntry> subCategoryMap;

        // Add other categories. To cover those cases that bills or entries spent in categories with no budget.
        List<SubCategory> subCategories =  categoryController.listAllSubcategories();
        for (SubCategory subCategory: subCategories) {

            // @TODO do better solution when i have time
            if (!subCategory.getName().equals("Pagamento")){
                String groupName = subCategory.getCategory().getType().getName();
                String categoryName = subCategory.getCategory().getName();
                String subCategoryName = subCategory.getFullName();

                if (groupMap.get(groupName) == null){
                    groupMap.put(groupName, new HashMap());
                }
                categoryMap = groupMap.get(groupName);

                if (categoryMap.get(categoryName) == null){
                    categoryMap.put(categoryName, new HashMap());
                }
                subCategoryMap = categoryMap.get(categoryName);
                subCategoryMap.put(subCategoryName, new BudgetEntry(subCategory));
            }
        }

        Budget budget = budgetRepository.findAllByUser(year, userId);
        if (budget == null){
            budget = new Budget(year, userId);
            budget = budgetRepository.save(budget);
        }

        for (BudgetEntry entry: budget.getEntries()) {
            String groupName = entry.getSubCategory().getCategory().getType().getName();
            String categoryName = entry.getSubCategory().getCategory().getName();
            String subCategoryName = entry.getSubCategory().getFullName();

            if (groupMap.get(groupName) == null){
                groupMap.put(groupName, new HashMap());
            }
            categoryMap = groupMap.get(groupName);

            if (categoryMap.get(categoryName) == null){
                categoryMap.put(categoryName, new HashMap());
            }
            subCategoryMap = categoryMap.get(categoryName);
            subCategoryMap.put(subCategoryName, entry);
        }


        // Construct the budget structure
        BudgetNodeRoot budgetRoot = new BudgetNodeRoot(budget.getId(), year);
        for (String keyG: groupMap.keySet()) {
            BudgetNodeGroup budgetGroup = new BudgetNodeGroup(keyG);

            Map<String, Map<String, BudgetEntry>> catMap = groupMap.get(keyG);
            for (String keyC: catMap.keySet()) {
                BudgetNodeCategory budgetCategory = new BudgetNodeCategory(keyC);

                subCategoryMap = catMap.get(keyC);
                for (BudgetEntry entry: subCategoryMap.values()) {
                    BudgetNodeSubCategory budgetSubCategory = new BudgetNodeSubCategory(entry.getId(), entry.getSubCategory().getName(), entry.getSubCategory());
                    budgetCategory.getData().add(budgetSubCategory);
                    budgetCategory.setIsPositive(entry.getPositive());
                    budgetGroup.setIsPositive(entry.getPositive());

                    setPerMonthPlanned(budgetSubCategory, entry);
                    setPerMonthPlanned(budgetCategory, entry);
                    setPerMonthPlanned(budgetGroup, entry);
                    if (!keyG.equals(INVESTMENT_CATEGORY_NAME)) setPerMonthPlanned(budgetRoot, entry);

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

        budgetRoot.setTotalNotAllocated( budgetRoot.getTotalIncome() + budgetRoot.getTotalExpense() + budgetRoot.getTotalInvested());

        List<Bill> bills = billRepository.findAllUndoneByUser( userId );
        budgetRoot.setBills(bills);

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
        Map<String, Map<String, Double>> mapSpent = accountService.getEntriesGroupedByCategory( startYear.getTime(), today.getTime(), groupId, AccountService.GROUP_ENTRIES_BY_MONTH, Arrays.asList(Account.Type.CKA, Account.Type.CCA) );

        // Get all bills registered until the end of the current year.
        // The future is considered through bills projected by the user.
        Map<String, Map<String, Double>> mapBill = getUndoneEntriesGroupedByCategory(today.getTime(), endYear.getTime(), groupId);

        Double totalGroupSpent, totalCategorySpent, totalSubCategorySpent, totalDeviation=0.0, totalBudgetSpent=0.0;
        Double groupDeviation;
        for (BudgetNodeGroup group: budget.getData()) {

            // categories
            totalGroupSpent = 0.0; groupDeviation = 0.0;
            for (BudgetNodeCategory category: group.getData()) {

                // subcategories
                totalCategorySpent = 0.0;
                Double multi = 1.0;
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
                            } else if (i < today.get(Calendar.MONTH)) {
                                if (subCatSpentMap != null) {
                                   valueSpent = subCatSpentMap.get( formatter.format( cal.getTime() ) );
                                }
                            } else { // current month, sum whats planned and whats ocurred
                                if (subCatBillMap != null && subCatBillMap.get( formatter.format( cal.getTime() ) ) != null){
                                    valueSpent = subCatBillMap.get( formatter.format( cal.getTime() ) );
                                }

                                if (subCatSpentMap != null && subCatSpentMap.get( formatter.format( cal.getTime() ) ) != null){
                                    if (valueSpent != null){
                                        valueSpent += subCatSpentMap.get( formatter.format( cal.getTime() ) );
                                    } else {
                                        valueSpent = subCatSpentMap.get( formatter.format( cal.getTime() ) );
                                    }
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
                    subCategory.setDeviation(subCategory.getTotalPlanned() - subCategory.getTotalSpent());
                    subCategory.setDeviationPercent( subCategory.getDeviation() / Math.abs(subCategory.getTotalPlanned()) );

                }
                category.setAverageL3M( totalCategorySpent / 3 );
                category.setTotalSpent( totalCategorySpent );
                category.setDeviation(category.getTotalPlanned() - category.getTotalSpent());
                category.setDeviationPercent( category.getDeviation() / Math.abs(category.getTotalPlanned()) );

            }
            group.setAverageL3M( totalGroupSpent / 3 );
            group.setTotalSpent( totalGroupSpent );
                groupDeviation = group.getTotalPlanned() - group.getTotalSpent();
            group.setDeviation(groupDeviation);
            group.setDeviationPercent( group.getDeviation() / Math.abs(group.getTotalPlanned()) );
            totalDeviation += (group.getName().equals(INVESTMENT_CATEGORY_NAME) ? 0 : groupDeviation);

        }
        budget.setAverageL3M( totalBudgetSpent / 3 );
        budget.setTotalSpent( totalBudgetSpent );
        budget.setDeviation(totalDeviation);
        budget.setDeviationPercent(budget.getDeviation() / Math.abs(budget.getTotalPlanned()) );

        return budget;
    }

    /**
     * This service returns all bills planned to be paid until the end date. They are all grouped into categories;
     * @param start Usually today
     * @param end End date
     * @param groupId
     * @return
     */
    public Map<String,Map<String,Double>> getUndoneEntriesGroupedByCategory(Date start, Date end, Integer groupId) {
        List<Bill> bills =  billRepository.findAllByUserPeriodUndone(start, end, groupId);
        return groupbyCategory(bills);
    }

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

            for (Map.Entry<String, Double> label: labels.entrySet()){
                found = false;

                for (Map.Entry<String, Map<String, Double>> col: series.entrySet()){
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

                for (Map.Entry<String, Map<String, Double>> col: series.entrySet()){
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
        for (Map.Entry<String, Map<String, Double>> serie: series.entrySet()){
            AccountCashFlowResource accountCF = new AccountCashFlowResource(serie.getKey(), new ArrayList<Double>(  ));

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
     * Get the current budget registered for the user.
     * @param groupId
     * @return
     */
    public BudgetNodeRoot getCurrentBudget(Integer groupId) {
        Integer year = Calendar.getInstance().get(Calendar.YEAR);

        BudgetNodeRoot budget = getBudget(year, groupId);

        budget = fillsSpentInformation(budget, groupId);

        return budget;
    }

    /**
     * remove all entries in he current  budget
     */
    @Transactional(readOnly = false)
    public void resetBudget(Integer year, Integer groupId){
        // Reset the current budget

        return;
    }

    /**
     * Save a baseline with the bills registered for the current user.
     * @param year
     * @param groupId
     */
    @Transactional(readOnly = false)
    public void saveBaseline(Integer year, Integer groupId) {
        Calendar today = Calendar.getInstance();
        Calendar startYear = Calendar.getInstance();
        Calendar endYear = Calendar.getInstance();
        startYear.set( today.get( Calendar.YEAR ), Calendar.JANUARY, 1, 0, 0, 1 );
        endYear.set( today.get( Calendar.YEAR ), Calendar.DECEMBER, 31, 23, 59, 59 );

        // Reset budget - create a new budget
        Budget budget = budgetRepository.findAllByUser(year, groupId);
        if (budget != null){
            budgetEntryRepository.deleteInBatch(budget.getEntries());
            budgetRepository.delete(budget);
        }
        budget = new Budget(year, groupId);
        budget = budgetRepository.save(budget);

        List<Bill> bills = billRepository.findAllByUser(groupId);
        Map<String, BudgetEntry> mapEntry = new HashMap<>();
        for (Bill bill: bills) {
            // Do not consider investments as expenses. Investments are excluded from budget.
            if ( (bill.getTransfer() == null) ){
                String catName = bill.getSubCategory().getFullName();
                if ( mapEntry.get(catName) == null ) {
                    mapEntry.put(catName, new BudgetEntry());
                }
                BudgetEntry entry = mapEntry.get(catName);

                entry.setSubCategory(bill.getSubCategory());
                entry.setBudgetID(budget.getId());
                entry.setPositive(bill.getSubCategory().getCategory().getType().isPositive());
                entry.setGroupId(groupId);

                setMonthBudget(entry, bill.getDate(), bill.getAmount());
            }
        }
        budgetEntryRepository.save(mapEntry.values());

        budget.setEntries(new ArrayList<BudgetEntry>(mapEntry.values()));
        budgetRepository.saveAndFlush(budget);
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

    private Map<String, Map<String, Double>> groupbyCategory(List<Bill> bills) {
        DateFormat formatter = new SimpleDateFormat( "MM/yyyy" );

        // Group all planned entries by its subcategories
        Map<String, Map<String, Double>> map = new HashMap<>(  );
        for (Bill bill: bills) {

            String groupName = bill.getSubCategory().getCategory().getType().getName();
            String catName = bill.getSubCategory().getCategory().getName();
            String subCatName = bill.getSubCategory().getFullName();
            String group = formatter.format( bill.getDate() );

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
            map.get( groupName ).put( group, bill.getAmount() + total );

            // Category
            total = map.get( catName ).get( group );
            map.get( catName ).put( group, bill.getAmount() + total );

            // Subcategory
            total = map.get( subCatName ).get( group );
            map.get( subCatName ).put( group, bill.getAmount() + total );
        }
        return map;
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

    private void  setMonthBudget(BudgetEntry entry, Date date, Double amount){
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        Integer month = cal.get(Calendar.MONTH);

        switch (month) {
            case 0:
                entry.setJan(entry.getJan() + amount);
                break;
            case 1:
                entry.setFeb(entry.getFeb() + amount);
                break;
            case 2:
                entry.setMar(entry.getMar() + amount);
                break;
            case 3:
                entry.setApr(entry.getApr() + amount);
                break;
            case 4:
                entry.setMay(entry.getMay() + amount);
                break;
            case 5:
                entry.setJun(entry.getJun() + amount);
                break;
            case 6:
                entry.setJul(entry.getJul() + amount);
                break;
            case 7:
                entry.setAug(entry.getAug() + amount);
                break;
            case 8:
                entry.setSep(entry.getSep() + amount);
                break;
            case 9:
                entry.setOct(entry.getOct() + amount);
                break;
            case 10:
                entry.setNov(entry.getNov() + amount);
                break;
            case 11:
                entry.setDec(entry.getDec() + amount);
                break;
        }
    }
}