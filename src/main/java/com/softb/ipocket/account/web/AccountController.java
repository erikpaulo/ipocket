package com.softb.ipocket.account.web;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.softb.ipocket.account.model.Account;
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
	
	@Inject
	private UserAccountService userAccountService;
	

	@Override
	public AccountRepository getRepository() {
		return accountRepository;
	}

	@Override
	public List<Account> listAll() {
		
		// Recupera o id do usuário logado para filtro dos dados.
		UserAccount user = userAccountService.getCurrentUser();
		Integer userId = user.getId();
		
		// Recupera todas as contas do usuário logado.
		List<Account> accounts =  accountRepository.listAllByUser(userId);
		return accounts;
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
		
		return super.create(json);
	}
	
	
}
