package com.softb.system.security.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.codahale.metrics.annotation.Timed;
import com.softb.system.security.model.UserAccount;
import com.softb.system.security.service.UserAccountService;
import com.softb.system.security.web.resource.AuthenticationResource;
import com.softb.system.security.web.resource.UserResource;
import com.softb.system.security.web.resource.RegisterResource;

/**
 * RESTful Service para o usuário logado no Spring Security.
 * 
 * <p>
 * API: '<b>rest/accounts/:action</b>'
 * </p>
 * <p>
 * <b>:action</b> pode ser
 * <ul>
 * <li>'/public/user/current' - retorna apenas os dados principais (publicos) do usuário logado </li>
 * <li>'/public/user/authenticate' - autentica o usuario a partir dos parametros username e password </li>
 * <li>'/public/user/register' - permite a criação de um novo usuário </li> 
 * </ul>
 * </p>
 * 
 */
@Controller
@RequestMapping(value = "/public/user")
public class SignInController {
	private static final Logger logger = LoggerFactory.getLogger(SignInController.class);

	@Autowired
	private UserAccountService userAccountService;

	@Autowired
	private AuthenticationManager authManager;

	/**
	 * Autentica o usuário
	 * 
	 * @param username
	 *            The name of the user.
	 * @param password
	 *            The password of the user.
	 * @return A transfer containing the authentication token.
	 */
	@RequestMapping(value = "authenticate", method = RequestMethod.POST)
	@ResponseBody
	@Timed
	public UserResource authenticate(@RequestBody AuthenticationResource user) {
		logger.debug("==>REST: /rest/user/authenticate");
		
		Authentication authentication = this.authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
		SecurityContextHolder.getContext().setAuthentication(authentication);

		return getCurrentUser();
	}
	
	@RequestMapping(value = "register", method = RequestMethod.POST)
	@ResponseBody
	@Timed
	public UserResource register(@RequestBody RegisterResource user) {
		logger.debug("==>REST: /public/user/register");
		
		UserAccount account = new UserAccount();
		
		account.setEmail(user.getEmail());
		account.setDisplayName(user.getDisplayName());
		account.setPassword(user.getPassword());
		account.setImageUrl("resources/images/avatar.jpg"); //defult image profile
		
		account = userAccountService.createUserAccount(account);
		
		// autentica o usuário imediatamente após o registro
		return authenticate(new AuthenticationResource(account.getEmail(), account.getPassword()));
	}
	
	@RequestMapping(value = "current", method = RequestMethod.GET)
	@ResponseBody
	@Timed
	public UserResource getCurrentUser() {
		logger.debug("==>REST: /public/user/current");
		
		UserAccount account = userAccountService.getCurrentUser();
		if (account != null) {
			logger.info("      user authenticated, name is " + account.getDisplayName());
			return new UserResource(account);
		}
		logger.info("      user not logged in!");
		return new UserResource();
	} 
}
