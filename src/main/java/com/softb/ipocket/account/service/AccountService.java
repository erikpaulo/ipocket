package com.softb.ipocket.account.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.inject.Inject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.account.model.AccountSummary;
import com.softb.ipocket.account.model.AccountType;
import com.softb.ipocket.account.repository.AccountEntryRepository;
import com.softb.ipocket.account.repository.AccountRepository;
import com.softb.system.security.service.UserAccountService;

@Service
public class AccountService {
	
	@Autowired
	private AccountRepository accountRepository;
	
	@Autowired
	private AccountEntryRepository accountEntryRepository;
	
	@Inject
	private UserAccountService userAccountService;

	/**
	 * Constroe o resumo das contas do usuário, apresentando valor total por tipo e
	 * valor total
	 * @return Resumo das contas do usuário.
	 */
	public AccountSummary genSummary() {
		AccountSummary summary = new AccountSummary();
		
		// Recupera todas as contas do usuário logado.
		List<Account> accounts =  this.listAll();
	    
	    // Itera pelas contas agregando por tipo.
		Map<String, List<Account>> hashTypes = new HashMap<String, List<Account>>();
	    for ( Account account: accounts ) {
	    	if ( !hashTypes.containsKey(account.getType()) ){
	    		hashTypes.put(account.getType(), new ArrayList<Account>());
	    	}
	    	hashTypes.get(account.getType()).add(account);
	    }
	    
	    // Itera pelos tipos construindo o resumo das contas do usuário.
	    Double total = 0.0;
	    for (Entry<String, List<Account>> entry: hashTypes.entrySet()){
	    	AccountType accountType = new AccountType();
	    	accountType.setName(Account.Type.valueOf(entry.getKey()).getName());
	    	
	    	Double typeTotal = 0.0;
	    	for (Account account: entry.getValue()){
	    		typeTotal += account.getStartBalance();
	    		total += account.getStartBalance();
	    		for (AccountEntry accountEntry: account.getEntries()){
	    			typeTotal += accountEntry.getAmount();
	    			total += accountEntry.getAmount();
	    		}
	    		accountType.getAccounts().add(account);
	    	}
	    	accountType.setTotal( typeTotal );
	    	summary.getAccountTypes().add(accountType);
	    }
	    summary.setTotal(total);
	    
		return summary;
	}
	
	/**
	 * Lista todas as contas do usuário, calculando o saldo atual.
	 * @return Lista de contas com o usuário.
	 */
	public List<Account> listAll(){
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
	
	/**
	 * Recupera os lançamentos da conta informada do mês corrente e mês anterior, calculando o saldo acumulativo de 
	 * cada lançamento.
	 * @param accountId Identificador da conta.
	 * @return Conta com lançamentos carregados.
	 */
	public Account getAccountStatement(Integer accountId, Date start, Date end){
//		Calendar current = Calendar.getInstance();
//		current.set(Calendar.DAY_OF_MONTH, Calendar.getInstance().getActualMaximum(Calendar.DAY_OF_MONTH));
//		
//		Calendar last = Calendar.getInstance();
//		last.set(Calendar.DAY_OF_MONTH, 1);
//		last.add(Calendar.MONTH, -2);
		
		// Recupera a conta
		Account account = accountRepository.getOne(accountId);

		// Recupera o saldo até o início do período.
		Double balance = accountEntryRepository.getBalanceByDateAccount(accountId, start, userAccountService.getCurrentUser().getId());
		if (balance == null) balance = 0.0;
		
		// Recupera lançamentos do usuário para o mês corrente e anterior.
		List<AccountEntry> entries = accountEntryRepository.listAllByUserDateAccount(accountId, start, userAccountService.getCurrentUser().getId());
		
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
	
	/*
	 * Calcula o saldo total da conta informada a partir de seus lançamentos e/ou saldo inicial.
	 * @param account Conta que terá seu saldo calculado.
	 * @return saldo total.
	 */
	public Double calcBalance(Account account) {
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
