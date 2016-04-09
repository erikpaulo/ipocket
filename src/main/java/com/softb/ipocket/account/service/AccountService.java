package com.softb.ipocket.account.service;

import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.account.repository.AccountEntryRepository;
import com.softb.ipocket.account.repository.AccountRepository;
import com.softb.system.security.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by eriklacerda on 3/1/16.
 */
@Service
public class AccountService {

    public static final String GROUP_ENTRIES_BY_MONTH = "MONTH";

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountEntryRepository accountEntryRepository;

    @Inject
    private UserAccountService userAccountService;

    public Account getAccountStatement(Integer accountId, Date start, Date end){

        Account account = accountRepository.getOne(accountId);

        // Recupera o saldo até o início do período.
        Double balance = accountEntryRepository.getBalanceByDateAccount(accountId, start, userAccountService.getCurrentUser().getGroupId());
        if (balance == null) balance = 0.0;

        // Recupera lançamentos do usuário para o mês corrente e anterior.
        List<AccountEntry> entries = accountEntryRepository.listAllByUserDateAccount(accountId, start, userAccountService.getCurrentUser().getGroupId());

        // Calcula o saldo acumulativo.
        balance += account.getStartBalance();
        for (AccountEntry entry: entries){
            balance += entry.getAmount();
            entry.setBalance(balance);
        }
        account.setEntries(entries);
        account.setBalance(balance);

        return account;
    }

    /**
     * Gets all account entries of all accounts, grouped by its categories/subcategories and by month.
     * @param start
     * @param end
     * @param groupId
     * @return
     */
    public Map<String, Map<String, Double>> getEntriesGroupedByCategory(Date start, Date end, Integer groupId, String groupBy){
        DateFormat formatter = (groupBy.compareToIgnoreCase( GROUP_ENTRIES_BY_MONTH ) == 0 ? new SimpleDateFormat( "MM/yyyy" ) : new SimpleDateFormat( "dd/MM/yyyy" ));

        // Gets all account entries inserted this year.
        List<AccountEntry> entries = accountEntryRepository.listAllByUserPeriod( start, end, groupId );

        // Group all account entries by its subcategories
        Map<String, Map<String, Double>> map = new HashMap<>(  );
        for (AccountEntry entry: entries) {

            String groupName = entry.getSubCategory().getCategory().getType().getName();
            String catName = entry.getSubCategory().getCategory().getName();
            String subCatName = entry.getSubCategory().getFullName();
            String group = formatter.format( entry.getDate() );

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
            map.get( groupName ).put( group, entry.getAmount() + total );

            // Category
            total = map.get( catName ).get( group );
            map.get( catName ).put( group, entry.getAmount() + total );

            // Subcategory
            total = map.get( subCatName ).get( group );
            map.get( subCatName ).put( group, entry.getAmount() + total );
        }

        return map;
    }

    public Map<String, Double> getAverageSpent(Date start, Date end, Integer groupId, String groupBy){
        Map<String, Map<String, Double>> mapExecuted = this.getEntriesGroupedByCategory( start, end, groupId, AccountService.GROUP_ENTRIES_BY_MONTH );
        Calendar startCal = Calendar.getInstance();
        Calendar endCal = Calendar.getInstance();
        startCal.setTime( start );
        endCal.setTime( end );


        int diffYear = endCal.get(Calendar.YEAR) - startCal.get(Calendar.YEAR);
        int divisor = diffYear * 12 + endCal.get(Calendar.MONTH) - startCal.get(Calendar.MONTH);


        // Calculate the average based on the entries registered in the System.
        Map<String, Double> mapAverage = new HashMap<>(  );
        for (Map.Entry<String, Map<String, Double>> entryL1: mapExecuted.entrySet()) {
            Map<String, Double> monthEntry = entryL1.getValue();
            Double average = 0.0;

            for (Map.Entry<String, Double> entryL2: monthEntry.entrySet()) {
                average += entryL2.getValue();
            }
            average = average / divisor;
            mapAverage.put( entryL1.getKey(), average );
        }

        return mapAverage;
    }
}
