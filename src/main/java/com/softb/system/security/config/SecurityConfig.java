package com.softb.system.security.config;

import javax.inject.Inject;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.RememberMeAuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;
import org.springframework.security.web.authentication.rememberme.PersistentTokenBasedRememberMeServices;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.social.UserIdSource;
import org.springframework.social.connect.UsersConnectionRepository;
import org.springframework.social.security.SocialAuthenticationFilter;
import org.springframework.social.security.SocialAuthenticationProvider;
import org.springframework.social.security.SocialAuthenticationServiceLocator;

import com.softb.system.security.repository.RememberMeTokenRepository;
import com.softb.system.security.service.UserAccountService;
import com.softb.system.security.social.PersistentTokenRepositoryImpl;

/**
 * Configuration for Spring Security and Spring Social Security.
 * 
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled=true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
	private static final String APP_SECURITY_KEY = "application.security.key";

	@Inject
    private Environment environment;

    @Inject 
    private UserAccountService userAccountService;
    
    @Inject
    private RememberMeTokenRepository rememberMeTokenRepository;
    
    @Inject
    private UsersConnectionRepository usersConnectionRepository;
    
    @Inject
    private SocialAuthenticationServiceLocator socialAuthenticationServiceLocator;
    
    @Inject
    private UserIdSource userIdSource;
    
    @Override
    public void configure(WebSecurity builder) throws Exception {
        builder
        .ignoring()
            .antMatchers("/resources/**").antMatchers("/i18n/**");
    }
    
	@Override
	protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // disable CSRF now. TODO figure out how to config CSRF header in AngularJS
            .headers().frameOptions().disable()  // necessários para iframe - evitar 'X-Frame-Options' to 'DENY'
            .authorizeRequests(	)
                .antMatchers("/system/**").permitAll()
                .antMatchers("/modules/admin/**").hasRole("ADMIN")
                .antMatchers("/api/**").authenticated()
                .antMatchers("/modules/**/*.html").authenticated()
                .and()
	        .addFilterBefore(socialAuthenticationFilter(), AbstractPreAuthenticatedProcessingFilter.class)
	        .logout()
	            .deleteCookies("JSESSIONID")
	            .logoutUrl("/signout")
	            .logoutSuccessUrl("/")
	            .and()
	        .rememberMe()
	        	.rememberMeServices(rememberMeServices());
	}
	
	
    @Override
    protected void configure(AuthenticationManagerBuilder builder) throws Exception{
        builder
        	.authenticationProvider(daoAuthenricationProvider())
        	.authenticationProvider(socialAuthenticationProvider())
        	.authenticationProvider(rememberMeAuthenticationProvider())
        	.userDetailsService(userAccountService);
    } 
    
    public AuthenticationProvider daoAuthenricationProvider() {
    	DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    	provider.setUserDetailsService(userAccountService);
    	return provider;
    }
    
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean()
            throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public SocialAuthenticationFilter socialAuthenticationFilter() throws Exception{
        SocialAuthenticationFilter filter = new SocialAuthenticationFilter(
        		authenticationManager(), userIdSource,
                usersConnectionRepository, socialAuthenticationServiceLocator);
        filter.setFilterProcessesUrl("/signin");  //TODO: [marcus] fix the deprecated call.
        filter.setSignupUrl(null); 
        filter.setConnectionAddedRedirectUrl("/#/account");
        filter.setPostLoginUrl("/#/dashboard"); //always open account profile page after login
        filter.setAlwaysUsePostLoginUrl(true);
        filter.setRememberMeServices(rememberMeServices());
        return filter;
    }

    @Bean
    public SocialAuthenticationProvider socialAuthenticationProvider(){
        return new SocialAuthenticationProvider(usersConnectionRepository, userAccountService);
    }

    @Bean
    public RememberMeServices rememberMeServices(){
        PersistentTokenBasedRememberMeServices rememberMeServices = new PersistentTokenBasedRememberMeServices(
                        environment.getProperty(APP_SECURITY_KEY), userAccountService, persistentTokenRepository());
        rememberMeServices.setAlwaysRemember(true);
        return rememberMeServices;
    }
    
    @Bean 
    public PersistentTokenRepository persistentTokenRepository() {
        return new PersistentTokenRepositoryImpl(rememberMeTokenRepository);
    }

    @Bean 
    public RememberMeAuthenticationProvider rememberMeAuthenticationProvider(){
        RememberMeAuthenticationProvider rememberMeAuthenticationProvider = 
                        new RememberMeAuthenticationProvider(environment.getProperty(APP_SECURITY_KEY));
        return rememberMeAuthenticationProvider; 
    }

}
