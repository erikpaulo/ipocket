package com.softb.system.security.config;

import com.softb.system.security.provider.GoogleTokenAuthenticationProvider;
import com.softb.system.security.repository.PersistentTokenRepositoryImpl;
import com.softb.system.security.repository.RememberMeTokenRepository;
import com.softb.system.security.service.AppPersistentTokenBasedRememberMeServices;
import com.softb.system.security.service.UserAccountService;
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
import org.springframework.security.web.authentication.rememberme.PersistentTokenBasedRememberMeServices;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;

import javax.inject.Inject;

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
                .authenticationProvider(googleTokenAuthenticationProvider())
                .authenticationProvider(rememberMeAuthenticationProvider())
                .userDetailsService(userAccountService);
    }

    private AuthenticationProvider googleTokenAuthenticationProvider() {
        GoogleTokenAuthenticationProvider provider = new GoogleTokenAuthenticationProvider();
        provider.setUserDetailsService(userAccountService);
        return provider;
    }

    public AuthenticationProvider daoAuthenricationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userAccountService);
        return provider;
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public RememberMeServices rememberMeServices(){
        PersistentTokenBasedRememberMeServices rememberMeServices =
                new AppPersistentTokenBasedRememberMeServices (environment.getProperty(APP_SECURITY_KEY), userAccountService, persistentTokenRepository());
        rememberMeServices.setAlwaysRemember(true);
        rememberMeServices.setCookieName ( "authToken" );
        return rememberMeServices;
    }

    @Bean
    public PersistentTokenRepository persistentTokenRepository() {
        return new PersistentTokenRepositoryImpl (rememberMeTokenRepository);
    }

    @Bean
    public RememberMeAuthenticationProvider rememberMeAuthenticationProvider(){
        RememberMeAuthenticationProvider rememberMeAuthenticationProvider =
                new RememberMeAuthenticationProvider(environment.getProperty(APP_SECURITY_KEY));
        return rememberMeAuthenticationProvider;
    }
}
