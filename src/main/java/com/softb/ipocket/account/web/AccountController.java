package com.softb.ipocket.account.web;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.http.fileupload.FileItemIterator;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.apache.tomcat.util.http.fileupload.servlet.ServletFileUpload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.account.model.AccountEntryImport;
import com.softb.ipocket.account.model.Category;
import com.softb.ipocket.account.repository.AccountEntryRepository;
import com.softb.ipocket.account.repository.AccountRepository;
import com.softb.ipocket.account.repository.CategoryRepository;
import com.softb.ipocket.account.service.AccountEntryUploadService;
import com.softb.system.errorhandler.exception.FormValidationError;
import com.softb.system.errorhandler.exception.SystemException;
import com.softb.system.rest.AbstractRestController;
import com.softb.system.security.service.UserAccountService;

@RestController("AccController")
@RequestMapping("/api/account")
public class AccountController extends AbstractRestController<Account, Integer> {

	public static final String OBJECT_NAME = "Account";
	
	@Autowired
	private AccountRepository accountRepository;
	
	@Autowired
	private AccountEntryRepository accountEntryRepository;
	
	@Autowired
	private CategoryRepository categoryRepository;
	
	@Inject
	private UserAccountService userAccountService;
	
	@Inject
	private AccountEntryUploadService uploadService;
	
	@Override
	public AccountRepository getRepository() {
		return accountRepository;
	}
	
	public AccountEntryRepository getAccountEntryRepository(){
		return accountEntryRepository;
	}

	@Override
	public List<Account> listAll() {
		Account account = null;
		
		// Recupera todas as contas do usuário logado.
		List<Account> accounts =  accountRepository.listAllByUser(userAccountService.getCurrentUser().getId());
		
		// Atualiza o saldo das contas 'desnormalizado';
		Iterator<Account> i = accounts.iterator();
		while (i.hasNext()) {
			account = i.next();
			account.setBalance(calcBalance(account));
		}
		
		return accounts;
	}
	
	@RequestMapping(value="/listSome", method=RequestMethod.GET)
	public List<Account> listSome(@RequestBody List<Integer> accountIds) {
		List<Account> accounts = new ArrayList<Account>();
		
		Iterator<Integer> i = accountIds.iterator();
		while (i.hasNext()){
			Integer accountId = i.next();
			Account account = accountRepository.getOne(accountId);
			if (account != null){
				accounts.add(account);
			}
		}
		
		return accounts;
	}

	@Override
	@RequestMapping(value="/{id}", method=RequestMethod.GET)
	public Account get(@PathVariable Integer id) {
		
		// Recupera a conta na base de dados.
		Account account = super.get(id);
		
		// Atualiza o saldo na referência que será retornada.
		account.setBalance(calcBalance(account));
		
		return account; 
	}

	@Override
	public String getEntityName() {
		return OBJECT_NAME;
	}

	@Override
	public Account create(@RequestBody Account json) throws FormValidationError {

		// Recupera o id do usuário logado para filtro dos dados.
		json.setUserId(userAccountService.getCurrentUser().getId());
		json.setCreateDate(new Date());
		
		// Cria a nova conta.
		Account account = super.create(json);
		
		// Atualiza o saldo.
		account.setBalance(calcBalance(account));
		
		return account;
	}
	
	@RequestMapping(value="/{accountId}/entries/upload", method = RequestMethod.POST)
	@ResponseBody public List<AccountEntryImport> uploadEntries(@PathVariable Integer accountId, final HttpServletRequest request,final HttpServletResponse response) throws SystemException, DataAccessException, FileUploadException, IOException, ParseException{
		List<AccountEntryImport> entriesToImport = null;
		
		request.setCharacterEncoding("utf-8");
		if (request.getHeader("Content-Type") != null){
			if  (request.getHeader("Content-Type").startsWith("multipart/form-data")) {
				
				// Importa o arquivo e prepara os dados para serem trabalhados pelo usuário.
				ServletFileUpload upload = new ServletFileUpload();
				FileItemIterator fileIterator = upload.getItemIterator(request);
				entriesToImport = uploadService.csvImport(accountId, fileIterator);
			} else {
				throw new SystemException("Invalid Content-Type: "+ request.getHeader("Content-Type"));
			}
		}
		
		return entriesToImport;
	}
	
	@RequestMapping(value="/{accountId}/entries/import", method = RequestMethod.POST)
	@ResponseBody public List<AccountEntry> importEntries(@PathVariable Integer accountId, @RequestBody List<AccountEntryImport> json) throws IOException{
		List<AccountEntry> entries = new ArrayList<AccountEntry>();
		List<AccountEntry> entriesCreated = null;

		// Itera pelos dados, criando novos lançamentos no sistema.
		Iterator<AccountEntryImport> i = json.iterator();
		while (i.hasNext()){
			AccountEntryImport entryToImport = i.next();
			
			// Recupera a categoria selecionada.
			Category category = null;
			if (entryToImport.getCategory() != null){
				category = categoryRepository.findOneByUser(entryToImport.getCategory().getId(), userAccountService.getCurrentUser().getId());
			}
			
			// Se import ocorrendo em conta tipo crédito, inverte o sinal.
			Account account = accountRepository.findOne(accountId);
			
			// Cria o lançamento que será incluído no sistema.
			AccountEntry entry = new AccountEntry(	accountId, entryToImport.getDescription(), category, entryToImport.getDate(), 
													"E", entryToImport.getAmount(), userAccountService.getCurrentUser().getId(), null, null, null);
			
			validate("AccountEntry", entry);
			entries.add(entry);
		}
		
		entriesCreated = getAccountEntryRepository().save(entries);
		return entriesCreated;
	}

	
	@Transactional
	@RequestMapping(value="/{accountId}/entries", method=RequestMethod.POST)
	public AccountEntry createEntry(@PathVariable Integer accountId, @RequestBody AccountEntry json) throws FormValidationError {
    	
		// Recupera o id do usuário logado para filtro dos dados.
		json.setUserId(userAccountService.getCurrentUser().getId());
		
		// Define a conta que contém este lançamento.
		json.setAccountId(accountId);
		json.setReconciled("N");
		
		validate("AccountEntry", json);
		
		// Realiza tratamento de acordo com o tipo de entrada: crédito, débito ou transferência
		if (json.getType().equals(AccountConstants.TYPE_TRANSFER)){
			createDestinyEntry(json);
		}
		
		AccountEntry created = getAccountEntryRepository().save(json);
		return created;
	}

	
	@RequestMapping(value="/{accountId}/entries/{accountEntryId}", method=RequestMethod.POST)
	public AccountEntry  updateEntry(@PathVariable Integer accountId, @PathVariable Integer accountEntryId, @RequestBody AccountEntry json) throws FormValidationError {
    	
		validate("AccountEntry", json);
		
		AccountEntry updated = getAccountEntryRepository().save(json);
		return updated;
	}
	
	@RequestMapping(value="/{accountId}/entries/{accountEntryId}", method=RequestMethod.DELETE)
	public void removeEntry(@PathVariable Integer accountId, @PathVariable Integer accountEntryId) throws FormValidationError {
		getAccountEntryRepository().delete(accountEntryId);
	}
	
	/**
	 * Quando o lançamento for uma trasferência cria o lançamento na conta destino com o sinal inverso.
	 * @param json
	 */
	private void createDestinyEntry(AccountEntry json) {
		AccountEntry destinyJson = new AccountEntry(json.getDestinyAccountId(), json.getDescription(), 	json.getCategory(), 
				json.getDate(), 	 		json.getReconciled(),  	json.getAmount()*-1, 
				json.getUserId(), 	 		null, 					null, 
				null);
		getAccountEntryRepository().save(destinyJson);
	}
	
	/**
	 * Calcula o saldo total da conta informada a partir de seus lançamentos e/ou saldo inicial.
	 * @param account Conta que terá seu saldo calculado.
	 * @return saldo total.
	 */
	private Double calcBalance(Account account) {
		Double balance = 0.0;
		
		if (account.getEntries() != null){
			Iterator<AccountEntry> entries = account.getEntries().iterator();
			while (entries.hasNext()){
				AccountEntry entry = entries.next();
				balance += entry.getAmount();
			}
		}
		balance += account.getStartBalance();
		
		return balance;
	}
}

