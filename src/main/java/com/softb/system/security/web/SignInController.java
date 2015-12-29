package com.softb.system.security.web;

import com.softb.system.security.provider.GoogleAuthenticationToken;
import com.softb.system.security.service.AppPersistentTokenBasedRememberMeServices;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.softb.system.security.model.UserAccount;
import com.softb.system.security.service.UserAccountService;
import com.softb.system.security.web.resource.AuthenticationResource;
import com.softb.system.security.web.resource.UserResource;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

    private static final String APP_SECURITY_KEY = "application.security.key";

    @Inject
    private Environment environment;

	@Autowired
	private UserAccountService userAccountService;

	@Autowired
	private AuthenticationManager authManager;

    @Autowired
    ApplicationContext context;


	/**
	 * Autentica o usuário
	 * 
	 * @return A transfer containing the authentication token.
	 */
	@RequestMapping(value = "authenticate", method = RequestMethod.POST)
	@ResponseBody
	public UserResource authenticate(@RequestBody AuthenticationResource user, HttpServletRequest request, HttpServletResponse response) {
        AbstractAuthenticationToken token;

		// Verifica se realizando login pelo google.
		if (user.getGoogleTokenId() != null && !user.getGoogleTokenId().isEmpty()){
            token = new GoogleAuthenticationToken (user.getGoogleTokenId());
		} else {
            token = new UsernamePasswordAuthenticationToken (user.getEmail (), user.getPassword ());
		}
        Authentication	authentication = this.authManager.authenticate(token);
        if (authentication.isAuthenticated () && user.getRememberMe ()){
            ((AppPersistentTokenBasedRememberMeServices)context.getBean ( "rememberMeServices" )).onLoginSuccess(request, response, authentication);
        }
		SecurityContextHolder.getContext().setAuthentication(authentication);

		return getCurrentUser();
	}

	@RequestMapping(value = "current", method = RequestMethod.GET)
	@ResponseBody
	public UserResource getCurrentUser() {
		UserAccount account = userAccountService.getCurrentUser();
		if (account != null) {
			return new UserResource(account);
		}
		return new UserResource();
	}
}
