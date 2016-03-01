package com.softb.ipocket.account.web;

import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.account.repository.AccountRepository;
import com.softb.ipocket.account.web.resource.AccountGroupResource;
import com.softb.ipocket.account.web.resource.AccountSummaryResource;
import com.softb.ipocket.categorization.model.Category;
import com.softb.ipocket.categorization.model.SubCategory;
import com.softb.system.errorhandler.exception.EntityNotFoundException;
import com.softb.system.errorhandler.exception.FormValidationError;
import com.softb.system.rest.AbstractRestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

@RestController("AppAccountController")
@RequestMapping("/api/account")
public class AccountController extends AbstractRestController<Category, Integer> {

	public static final String ACCOUNT_OBJECT_NAME = "Account";
	public static final String ACCOUNT_ENTRY_OBJECT_NAME = "AccountEntry";

	@Autowired
	private AccountRepository accountRepository;


    /**
     * This point lists all accounts of the current user, grouping them by its types.
     *
     * @return List
     */
    @RequestMapping(value = "/summary", method = RequestMethod.GET)
    public AccountSummaryResource listAll() {
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
        List<Account> accounts = accountRepository.listAllByUser ( getUserId () );
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
     * Returns the informed account with all its entries.
     * @param id Id of the account
     * @return The Account selected
     * @throws FormValidationError
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Account get(@PathVariable Integer id) throws FormValidationError {
        Account account = accountRepository.findOne( id, getUserId() );
        return account;
    }

//    public List<>

    /**
     * This point creates a new Account into the system.
     * @param account Account to create
     * @return Account created
     * @throws FormValidationError
     */
    @RequestMapping(method = RequestMethod.POST)
	public Account create(@RequestBody Account account) throws FormValidationError {

        account.setUserId( getUserId() );
        account.setActivated( true );
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

        Account account = accountRepository.findOne( id, getUserId() );
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

    /**
     * This point creates a new Sub Category into the system.
     * @param subCategory SubCategory to create
     * @return SubCategory created
     * @throws FormValidationError
     */
    @RequestMapping(value = "/category/{categoryId}/subcategory", method = RequestMethod.POST)
	public SubCategory create(@PathVariable Integer categoryId, @RequestBody SubCategory subCategory) throws FormValidationError {

		return subCategory;
	}

	
	@Transactional
    @RequestMapping(value = "/category/{id}", method = RequestMethod.PUT)
	public Category update(@PathVariable Integer id, @RequestBody Category category) {
		
		return category;
	}

	@Transactional
    @RequestMapping(value = "/category/{categoryId}/subcategory/{id}", method = RequestMethod.PUT)
	public SubCategory update(@PathVariable Integer id, @RequestBody SubCategory subCategory) {

		return subCategory;
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
}

