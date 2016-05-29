package com.softb.ipocket.account.service;

import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.account.repository.AccountEntryRepository;
import com.softb.ipocket.account.repository.AccountRepository;
import com.softb.ipocket.categorization.model.SubCategory;
import com.softb.ipocket.investment.model.Investment;
import com.softb.ipocket.investment.model.InvestmentEntry;
import com.softb.ipocket.investment.service.InvestmentService;
import com.softb.system.security.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @Inject
    private InvestmentService investmentService;

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
    public Map<String, Map<String, Double>> getEntriesGroupedByCategory(Date start, Date end, Integer groupId, String groupBy, List<Account.Type> accountTypes){
        DateFormat formatter = (groupBy.compareToIgnoreCase( GROUP_ENTRIES_BY_MONTH ) == 0 ? new SimpleDateFormat( "MM/yyyy" ) : new SimpleDateFormat( "dd/MM/yyyy" ));

        // Gets all account entries inserted this year.
        List<AccountEntry> entries = getAllEntriesByPeriod( start, end, groupId, accountTypes );

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

    /**
     * Gets all entries inserted by user, including his investments.
     * @param start
     * @param end
     * @param groupId
     * @return
     */
    public List<AccountEntry> getAllEntriesByPeriod(Date start, Date end, Integer groupId, List<Account.Type> accountTypes){
        Map<Integer, Account> mapAccounts = new HashMap<>(  );

        List<AccountEntry> accEntries;
        if (accountTypes == null){
            accEntries = accountEntryRepository.listAllByUserPeriod( start, end, groupId );

        } else {
            accEntries = accountEntryRepository.listAllByUserPeriodAccountType( start, end, groupId, accountTypes );
        }

        if (accountTypes != null && accountTypes.contains( Account.Type.INV )){
            List<InvestmentEntry> invEntries = investmentService.getAllOriginalEntriesByPeriod( start, end, groupId );
            for (InvestmentEntry entry: invEntries) {
                if (mapAccounts.get( entry.getInvestmentId()) == null ) {
                    Investment investment = investmentService.getInvestment( entry.getInvestmentId(), groupId );
                    Account account = new Account(investment.getName(), Account.Type.INV, null, investment.getCreateDate(),
                            true, groupId, 0.0, null, 0.0);

                    mapAccounts.put( entry.getInvestmentId(), account );
                }
                SubCategory sc = investmentService.getDefaultSubCategory( groupId );

                accEntries.add( new AccountEntry( entry.getDate(), sc, entry.getAmount(), false, entry.getInvestmentId(),
                                                  null, null, groupId, entry.getAmount(), mapAccounts.get( entry.getInvestmentId() )) );
            }
        }

        return accEntries;
    }

    /**
     * Return the user balance, considering all his accounts, including his investments.
     * @param date
     * @param groupId
     * @return
     */
    public Double getBalanceUntilDate(Date date, Integer groupId) {
        Double accBalance = accountEntryRepository.getBalanceByDate( date, groupId );
        Double balance = (accBalance != null ? accBalance : 0);
        balance += investmentService.getBalanceUntilDate( date, groupId );
        return balance;
    }


    /**
     * Return the amount of money saved by the current user between the two informed dates.
     * @param start
     * @param end
     * @param groupId
     * @return
     */
    public Double getSavingsByPeriod(Date start, Date end, Integer groupId) {
        Double balance = accountEntryRepository.getBalanceByPeriod( start, end, groupId );
        return balance;
    }
}
