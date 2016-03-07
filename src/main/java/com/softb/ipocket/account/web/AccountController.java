package com.softb.ipocket.account.web;

import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.account.repository.AccountRepository;
import com.softb.ipocket.account.service.AccountService;
import com.softb.ipocket.account.web.resource.AccountGroupResource;
import com.softb.ipocket.account.web.resource.AccountSummaryResource;
import com.softb.system.errorhandler.exception.EntityNotFoundException;
import com.softb.system.errorhandler.exception.FormValidationError;
import com.softb.system.rest.AbstractRestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController("AppAccountController")
@RequestMapping("/api/account")
public class AccountController extends AbstractRestController<Account, Integer> {

	public static final String ACCOUNT_OBJECT_NAME = "Account";

	@Autowired
	private AccountRepository accountRepository;

    @Inject
    private AccountService accountService;




    /**
     * Lists all account registered for this user, but its entries aren't loaded.
     *
     * @return List Accounts without its entries
     */
    @RequestMapping(method = RequestMethod.GET)
    public List<Account> listAll() {
        List<Account> accounts = accountRepository.listAllByUser( getGroupId() );
        for (Account account: accounts.subList( 0, accounts.size()-1 )) {
            account.setEntries( null );
        }

        return accounts;
    }


    /**
     * This point lists all accounts of the current user, grouping them by its types.
     *
     * @return List
     */
    @RequestMapping(value = "/summary", method = RequestMethod.GET)
    public AccountSummaryResource summary() {
        List<AccountGroupResource> groups = new ArrayList<AccountGroupResource> ();
        AccountSummaryResource summary = new AccountSummaryResource( );

        // Creates structure that groups accounts by its types.
        Iterator<Account.Type> k = new ArrayList<> ( Arrays.asList ( Account.Type.values () ) ).iterator ();
        while (k.hasNext ()) {
            Account.Type key = k.next();
            AccountGroupResource groupR = new AccountGroupResource ( key, key.getName () );
            groups.add( groupR );
        }

        // Gets all accounts of the logged user, grouping by account types
        List<Account> accounts = accountRepository.listAllByUser ( getGroupId() );
        Iterator<Account> accs = accounts.iterator ();
        while (accs.hasNext ()){
            Account account = accs.next ();

            // find out the correct group to use.
            AccountGroupResource groupR = null;
            Iterator<AccountGroupResource> gi = groups.iterator();
            while (gi.hasNext()) {
                groupR = gi.next();
                if (groupR.getId() == account.getType()) {
                    break;
                }
            }

            //calculate account balance.
            calculateAccountBalance( account );
            groupR.setBalance( groupR.getBalance() + account.getBalance() );
            summary.setBalance( summary.getBalance() + account.getBalance() );

            groupR.getAccounts().add( account );
        }

        summary.setGroups( groups );
        return summary;
    }

    /**
     * Lists the account statement for the selected period
     * @return Lista de lançamentos do período.
     * @throws ParseException
     */
    @RequestMapping(value="/{id}/statement", method=RequestMethod.GET)
    public Account getAccountStatement(@PathVariable Integer id, @RequestParam String start, @RequestParam String end) throws ParseException {
        DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        Date s = formatter.parse(start);
        Date e = formatter.parse(end);
        return accountService.getAccountStatement(id, s, e);
    }

    /**
     * Returns the informed account with all its entries.
     * @param id Id of the account
     * @return The Account selected
     * @throws FormValidationError
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Account get(@PathVariable Integer id) throws FormValidationError {
        return accountRepository.findOne( id, getGroupId() );
    }

    /**
     * This point creates a new Account into the system.
     * @param account Account to create
     * @return Account created
     * @throws FormValidationError
     */
    @RequestMapping(method = RequestMethod.POST)
	public Account create(@RequestBody Account account) throws FormValidationError {

        account.setGroupId( getGroupId() );
        account.setActivated( true );
        account.setLastUpdate( new Date(  ) );
        validate( ACCOUNT_OBJECT_NAME, account );

        account = accountRepository.save( account );
        account.setBalance( account.getStartBalance() );

        return account;
	}

    /**
     * This access deletes one user's banking account. If it has entries, then inactivate it.
     * @param id Id of the account
     * @throws FormValidationError
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable Integer id) throws FormValidationError {

        Account account = accountRepository.findOne( id, getGroupId() );
        if (account == null){
            throw new EntityNotFoundException( "This account doesn't belong to the current user." );
        }

        // Gets all entries of this account to decide whether it will be removed or inactivated.
        if (account.getEntries() != null && account.getEntries().size()>0){
            account.setActivated( false );
            accountRepository.save( account );
        } else {
            accountRepository.delete( account );
        }
    }

    private Account calculateAccountBalance (Account account){
        Double balance = account.getStartBalance();

        Iterator<AccountEntry> entries = account.getEntries().iterator();
        while (entries.hasNext()){
            AccountEntry entry = entries.next();
            balance += entry.getAmount();
        }
        account.setBalance( balance );

        return account;
    }

    protected void updateLastUpdate(Integer accountId){

        Account account = accountRepository.findOne( accountId );
        account.setLastUpdate( new Date() );
        accountRepository.save( account );
    }
}

