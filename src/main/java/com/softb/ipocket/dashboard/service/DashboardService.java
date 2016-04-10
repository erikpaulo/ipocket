package com.softb.ipocket.dashboard.service;

import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.account.repository.AccountEntryRepository;
import com.softb.ipocket.account.repository.AccountRepository;
import com.softb.ipocket.bill.model.Bill;
import com.softb.ipocket.bill.repository.BillRepository;
import com.softb.ipocket.budget.service.BudgetService;
import com.softb.ipocket.budget.web.resource.BudgetNodeRoot;
import com.softb.ipocket.categorization.model.SubCategory;
import com.softb.ipocket.dashboard.web.resource.BudgetTrackResource;
import com.softb.ipocket.dashboard.web.resource.SavingResource;
import com.softb.ipocket.dashboard.web.resource.SumarizedInfosResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class DashboardService {

    @Autowired
    private AccountEntryRepository accountEntryRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private BudgetService budgetService;

    public SavingResource getSavingInfo(Integer groupId) {
        List<Double> monthly = new ArrayList<Double>(  );
        for (int i=0;i<12;i++) monthly.add( 0.0 );
        List<Double> accumulated = new ArrayList<>( 12 );
        for (int i=0;i<12;i++) accumulated.add( 0.0 );

        Calendar start = Calendar.getInstance();
        Calendar end = Calendar.getInstance();
        start.set( start.get( Calendar.YEAR), Calendar.JANUARY, 1,0,0,0 ); // first day of this year
        end.set( end.get( Calendar.YEAR ), Calendar.DECEMBER, 31,0,0,0 ); // last day of the year

        List<AccountEntry> entries = accountEntryRepository.listAllByUserPeriod( start.getTime(), end.getTime(), groupId );

        for (AccountEntry entry: entries) {
            monthly.set( getIndex( entry.getDate() ) , monthly.get( getIndex( entry.getDate() )) + entry.getAmount() );
        }

        Double accBalance = 0.0;
        for (int i=0;i<12;i++) {
            accBalance += monthly.get( i );
            accumulated.set( i, accBalance );
        }

        return new SavingResource(monthly, accumulated);
    }

    public List<Bill> getNextBills(Integer groupId){
        List<Bill> bills = billRepository.findAllByUser( groupId );
        List<Bill> nextBills;
        if (bills.size() > 3){
            nextBills = bills.subList( 0, 3 );
        } else {
            nextBills = bills;
        }

        return nextBills;
    }

    private Integer getIndex(Date date){
        Calendar dateCal = Calendar.getInstance();
        dateCal.setTime( date );
        return dateCal.get( Calendar.MONTH );
    }

    private String getKey(Date date){
        Calendar cal = Calendar.getInstance();
        cal.setTime( date );

        return cal.get( Calendar.MONTH ) +"/"+ cal.get( Calendar.YEAR );
    }

    public SumarizedInfosResource genSumarizedInfo(Integer groupId) {
        Double patrimony = 0.0;
        Double accumulatedLastMonth = 0.0;
        Double fixedCostAverage = 0.0;


        // Gets all accounts
        List<Account> accounts = accountRepository.findAllByUser( groupId );
        for (Account account: accounts) {
            // Gets the balance of each account.
            Double balance = accountEntryRepository.getBalanceByDateAccount( account.getId(), new Date(), groupId );
            patrimony += ((balance != null ? balance : 0.0) + account.getStartBalance());
        }

        // Accumulated Last month
        Calendar lastMonthStart = Calendar.getInstance();
        Calendar lastMonthEnd = Calendar.getInstance();
        lastMonthStart.add( Calendar.MONTH, -1 );
        lastMonthEnd.add( Calendar.MONTH, -1 );
        lastMonthStart.set( Calendar.DAY_OF_MONTH, 1 );
        lastMonthStart.set( Calendar.HOUR_OF_DAY, 0 );
        lastMonthStart.set( Calendar.MINUTE, 0 );
        lastMonthStart.set( Calendar.SECOND, 1 );
        lastMonthStart.set( Calendar.MILLISECOND, 0 );
        lastMonthEnd.set( Calendar.DAY_OF_MONTH, lastMonthEnd.getActualMaximum( Calendar.DAY_OF_MONTH ) );
        lastMonthEnd.set( Calendar.HOUR_OF_DAY, 23 );
        lastMonthEnd.set( Calendar.MINUTE, 59 );
        lastMonthEnd.set( Calendar.SECOND, 59 );
        lastMonthEnd.set( Calendar.MILLISECOND, 0 );

        List<AccountEntry> entriesLastMonth = accountEntryRepository.listAllByUserPeriod( lastMonthStart.getTime(), lastMonthEnd.getTime(), groupId );
        for (AccountEntry entry: entriesLastMonth) {
            accumulatedLastMonth += entry.getAmount();
        }

        // Average Fixed Cost
        Calendar averageStart = Calendar.getInstance();
        Calendar averageEnd = Calendar.getInstance();
        averageStart.add( Calendar.MONTH, -6 );
        averageStart.set( Calendar.DAY_OF_MONTH, 1 );
        averageEnd.set( Calendar.DAY_OF_MONTH, averageEnd.getMaximum( Calendar.DAY_OF_MONTH ) );


        Map<String, String> averageCount = new HashMap<String, String>(  );
        List<AccountEntry> entriesFixedCost = accountEntryRepository.listAllByUserSubcategoryTypePeriod( SubCategory.Type.FC, averageStart.getTime(), averageEnd.getTime(), groupId );
        for (AccountEntry entry: entriesFixedCost) {
            fixedCostAverage += entry.getAmount();
            averageCount.put( getKey( entry.getDate() ), "" );
        }
        Integer count = averageCount.size();
        if (count > 0) fixedCostAverage = fixedCostAverage / count;

        return new SumarizedInfosResource( patrimony, accumulatedLastMonth, fixedCostAverage );
    }

    public BudgetTrackResource getBudgetTrackInfo(Integer groupId){
        BudgetNodeRoot budget = budgetService.loadCurrentActiveBudget( groupId );

        return new BudgetTrackResource( budget.getTotalPlanned(), budget.getTotalSpent() );
    }
}