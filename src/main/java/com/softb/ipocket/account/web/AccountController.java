package com.softb.ipocket.account.web;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.account.repository.AccountEntryRepository;
import com.softb.ipocket.account.repository.AccountRepository;
import com.softb.system.errorhandler.exception.FormValidationError;
import com.softb.system.rest.AbstractRestController;
import com.softb.system.security.model.UserAccount;
import com.softb.system.security.service.UserAccountService;

@RestController("AccController")
@RequestMapping("/api/account")
public class AccountController extends AbstractRestController<Account, Integer> {

	public static final String OBJECT_NAME = "Account";
	
	@Autowired
	private AccountRepository accountRepository;
	
	@Autowired
	private AccountEntryRepository accountEntryRepository;
	
	@Inject
	private UserAccountService userAccountService;
	

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
		
		// Recupera o id do usuário logado para filtro dos dados.
		UserAccount user = userAccountService.getCurrentUser();
		Integer userId = user.getId();
		
		// Recupera todas as contas do usuário logado.
		List<Account> accounts =  accountRepository.listAllByUser(userId);
		
		// Atualiza o saldo das contas 'desnormalizado';
		Iterator<Account> i = accounts.iterator();
		while (i.hasNext()) {
			account = i.next();
			account.setBalance(calcBalance(account));
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
	public Map<String, Object> create(@RequestBody Account json) throws FormValidationError {

		// Recupera o id do usuário logado para filtro dos dados.
		UserAccount user = userAccountService.getCurrentUser();
		Integer userId = user.getId();		
		json.setUserId(userId);
		
		// Cria a nova conta.
		Map<String, Object> m = super.create(json);
		Account account = (Account) m.get("object");
		
		// Atualiza o saldo na referência que será retornada.
		account.setBalance(calcBalance(account));
		m.put("object", account);
		
		return m;
	}
	
	@Transactional
	@RequestMapping(value="/{accountId}/entries", method=RequestMethod.POST)
	public Map<String, Object> createEntry(@PathVariable Integer accountId, @RequestBody AccountEntry json) throws FormValidationError, CloneNotSupportedException {
    	
		// Recupera o id do usuário logado para filtro dos dados.
		json.setUserId(userAccountService.getCurrentUser().getId());
		
		// Define a conta que contém este lançamento.
		json.setAccountId(accountId);
		json.setReconciled("N");
		
		validate("AccountEntry", json);
		
		// Realiza tratamento de acordo com o tipo de entrada: crédito, débito ou transferência
		if (json.getType().equals(AccountConstants.TYPE_TRANSFER)){
			AccountEntry destinyJson = new AccountEntry(json.getDestinyAccountId(), json.getDescription(), 	json.getCategory(), 
														json.getDate(), 	 		json.getReconciled(),  	json.getAmount(), 
														json.getUserId(), 	 		null, 					null, 
														null);
			json.setAmount(json.getAmount() * -1);
			getAccountEntryRepository().save(destinyJson);
		}
		
		AccountEntry created = getAccountEntryRepository().save(json);
		Map<String, Object> m = new HashMap<String, Object>();
		m.put("success", true);
		m.put("object", created);
		return m;
	}
	
	@RequestMapping(value="/{accountId}/entries/{accountEntryId}", method=RequestMethod.POST)
	public Map<String, Object> updateEntry(@PathVariable Integer accountId, @PathVariable Integer accountEntryId, @RequestBody AccountEntry json) throws FormValidationError {
    	
		validate("AccountEntry", json);
		
		AccountEntry updated = getAccountEntryRepository().save(json);
		Map<String, Object> m = new HashMap<String, Object>();
		m.put("success", true);
		m.put("object", updated);
		return m;
	}
	
	@RequestMapping(value="/{accountId}/entries/{accountEntryId}", method=RequestMethod.DELETE)
	public Map<String, Object> removeEntry(@PathVariable Integer accountId, @PathVariable Integer accountEntryId) throws FormValidationError {
    	
		getAccountEntryRepository().delete(accountEntryId);
		Map<String, Object> m = new HashMap<String, Object>();
		m.put("success", true);
		return m;
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
		
		// Verifica o tipo da conta. Se conta crédito o saldo na verdade é negativo.
		if (account.getType().equals(AccountConstants.TYPE_CREDIT)) {
			balance = balance * -1;
		}
		
		return balance;
	}
}

