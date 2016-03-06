package com.softb.ipocket.account.web;

import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.account.repository.AccountEntryRepository;
import com.softb.ipocket.account.service.AccountEntryUploadService;
import com.softb.ipocket.account.web.resource.AccountEntryImport;
import com.softb.ipocket.categorization.model.SubCategory;
import com.softb.ipocket.categorization.repository.SubCategoryRepository;
import com.softb.system.errorhandler.exception.FormValidationError;
import com.softb.system.errorhandler.exception.SystemException;
import com.softb.system.rest.AbstractRestController;
import org.apache.tomcat.util.http.fileupload.FileItemIterator;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.apache.tomcat.util.http.fileupload.servlet.ServletFileUpload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@RestController("AppAccountEntryController")
@RequestMapping("/api/account/{accountId}/entries")
public class AccountEntryController extends AbstractRestController<AccountEntry, Integer> {

	public static final String ACCOUNT_ENTRY_OBJECT_NAME = "AccountEntry";

	@Autowired
	private AccountEntryRepository accountEntryRepository;

    @Autowired
    private SubCategoryRepository subcategoryRepository;

    @Autowired
    private AccountController accountController;

    @Inject
    private AccountEntryUploadService uploadService;


    /**
     * Create one entry in this account.
     * @param entry Entry to be created
     * @return
     */
    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public AccountEntry create(@RequestBody AccountEntry entry) throws FormValidationError, CloneNotSupportedException {
        AccountEntry twinEntry = null;

        SubCategory subCategory = subcategoryRepository.findOneByUser( entry.getSubCategory().getId(), getUserId() );

        entry.setSubCategory( subCategory );
        entry.setTransfer( entry.getTransfer() != null ? entry.getTransfer() : false );
        entry = save(entry);

        // Check if it's a transfer.
        if (entry.getTransfer()){
            twinEntry =  createTwinEntry( entry );
            entry.setTwinEntryId( twinEntry.getId() );
        }

        entry = save( entry );

        return entry;
    }

    /**
     * Update one entry in this account.
     * @param entry Entry to be created
     * @return
     */
    @RequestMapping(value="/{id}", method = RequestMethod.PUT)
    @Transactional
    public AccountEntry update(@RequestBody AccountEntry entry) throws FormValidationError, CloneNotSupportedException {

        AccountEntry currentEntry = accountEntryRepository.findOne( entry.getId(), getUserId() );

        // Check if it's a transfer
        if (currentEntry.getTransfer()){
            if (!entry.getTransfer()) { // Needs to delete its twin entry.
                removeTwinEntry( entry, currentEntry );
            } else {
                updateTwinEntry( entry );
            }

        } else {
            if (entry.getTransfer()) { // Needs to create its twin entry.
                AccountEntry twinEntry = createTwinEntry( entry );
                entry.setTwinEntryId( twinEntry.getId() );
            }
        }

        return save(entry);
    }

    /**
     * Update one entry in this account.
     * @param id Entry to be deleted
     * @return
     */
    @RequestMapping(value="/{id}", method = RequestMethod.DELETE)
    @Transactional
    public @ResponseBody void delete(@PathVariable Integer id) {

        AccountEntry entry = accountEntryRepository.findOne( id, getUserId() );

        if (entry.getTransfer()){
            accountEntryRepository.delete( entry.getTwinEntryId() );
        }
        accountEntryRepository.delete( entry.getId() );
    }

    /**
     * Way of import account entries from a CSV file. This point prepares the file's data to be complemented by the user.
     * @param accountId Id of the Account
     * @param request Request
     * @param response Response
     * @return
     * @throws SystemException
     * @throws DataAccessException
     * @throws FileUploadException
     * @throws IOException
     * @throws ParseException
     */
    @RequestMapping(value="/upload", method = RequestMethod.POST)
    @ResponseBody public List<AccountEntryImport> uploadEntries(@PathVariable Integer accountId,
                                                                final HttpServletRequest request,
                                                                final HttpServletResponse response)
            throws SystemException, DataAccessException, FileUploadException, IOException, ParseException {

        List<AccountEntryImport> entriesToImport = null;

        request.setCharacterEncoding("utf-8");
        if (request.getHeader("Content-Type") != null){
            if  (request.getHeader("Content-Type").startsWith("multipart/form-data")) {

                // open file stream and prepare the file to be manipulated.
                ServletFileUpload upload = new ServletFileUpload();
                FileItemIterator fileIterator = upload.getItemIterator(request);
                entriesToImport = uploadService.csvImport(accountId, fileIterator);
            } else {
                throw new SystemException("Invalid Content-Type: "+ request.getHeader("Content-Type"));
            }
        }

        return entriesToImport;
    }

    /**
     * Imports a set of entries, complemented by the user and ready to be included in the System as entries in the
     * informed account.
     * @param accountId Id of the Account
     * @param json List of entries to be imported
     * @return List of AccountEntry just created
     * @throws IOException
     */
    @RequestMapping(value="/import", method = RequestMethod.POST)
    @ResponseBody public List<AccountEntry> importEntries(@PathVariable Integer accountId,
                                                          @RequestBody List<AccountEntryImport> json) throws IOException{
        List<AccountEntry> entries = new ArrayList<AccountEntry>();
        List<AccountEntry> entriesCreated = null;

        Iterator<AccountEntryImport> i = json.iterator();
        while (i.hasNext()){
            AccountEntryImport entryToImport = i.next();

            SubCategory subCategory = null;
            if (entryToImport.getCategoryId() != null){
                subCategory = subcategoryRepository.findOneByUser(entryToImport.getCategoryId(), getUserId());
            }

            AccountEntry entry = new AccountEntry( entryToImport.getDate(), subCategory, entryToImport.getAmount(),	false, accountId, null, null, getUserId(), null);

            validate(ACCOUNT_ENTRY_OBJECT_NAME, entry);
            entries.add(entry);
        }

        entriesCreated = accountEntryRepository.save(entries);
        return entriesCreated;
    }

    private AccountEntry save(AccountEntry entry) throws FormValidationError{
        entry.setUserId( getUserId() );
        validate( ACCOUNT_ENTRY_OBJECT_NAME, entry );

        AccountEntry accountEntry = accountEntryRepository.save( entry );

        accountController.updateLastUpdate( accountEntry.getAccountId() );

        return accountEntry;
    }

    private AccountEntry createTwinEntry(AccountEntry entry) throws CloneNotSupportedException {
        AccountEntry twinEntry;
        twinEntry = entry.clone();
        twinEntry.setAmount( twinEntry.getAmount() * -1 );
        twinEntry.setTwinEntryId( entry.getId() );
        twinEntry.setAccountId( entry.getAccountDestinyId() );
        twinEntry.setAccountDestinyId( entry.getAccountId() );
        return save(twinEntry);
    }

    private void updateTwinEntry(AccountEntry entry) {
        AccountEntry twinEntry = accountEntryRepository.findOne( entry.getTwinEntryId() );
        twinEntry.setAmount( entry.getAmount() * -1 );
        twinEntry.setDate( entry.getDate() );
        twinEntry.setSubCategory( entry.getSubCategory() );
        accountEntryRepository.save( twinEntry );
    }

    private void removeTwinEntry(@RequestBody AccountEntry entry, AccountEntry currentEntry) {
        accountEntryRepository.delete( currentEntry.getTwinEntryId() );
        entry.setTwinEntryId( null );
        entry.setAccountDestinyId( null );
    }
}

