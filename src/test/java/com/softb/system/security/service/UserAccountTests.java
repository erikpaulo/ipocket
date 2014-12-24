package com.softb.system.security.service;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.HashSet;
import java.util.Set;

import javax.transaction.Transactional;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.social.connect.ConnectionData;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.softb.system.config.ServiceConfig;
import com.softb.system.security.model.UserAccount;
import com.softb.system.security.repository.UserAccountRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = {ServiceConfig.class})
public class UserAccountTests {

    @Autowired
    protected UserAccountRepository accountRepository;
    
    @Autowired
    protected UserAccountService accountService;

    @Test
    public void testIsAdmin() {
        UserAccount normalUser = new UserAccount();
        assertFalse(normalUser.isAdmin());
        
        Set<String> roles = new HashSet<String>();
        roles.add("ROLE_USER");
        roles.add("ROLE_ADMIN");
        
        UserAccount user = new UserAccount();
        user.setRoles(roles);
        
        assertTrue(user.isAdmin());
    }    

    @Test
    @Transactional
    public void whenSaveUserAccount_thenReturnUserWithRolePadrao() {
    	ConnectionData data = new ConnectionData("google", "mlacerda", "Marcus Lacerda", "100", "http://test.org/img.png", "token", "secret", "refreshToken", 100000L);
		UserAccount account = accountService.createUserAccount(builderUserAccount(data));
		Assert.assertNotNull(account);
		Assert.assertFalse(account.isAdmin());
		Assert.assertFalse(account.isTrustedAccount());
    }
    
    @Test
    @Transactional
    public void whenGranAdmin_thenReturnUserAdmin() {
    	ConnectionData data = new ConnectionData("google", "mlacerda", "Marcus Lacerda", "100", "http://test.org/img.png", "token", "secret", "refreshToken", 100000L);
		UserAccount account = accountService.createUserAccount(builderUserAccount(data));
		Assert.assertNotNull(account);
		Assert.assertFalse(account.isAdmin());
		Assert.assertFalse(account.isTrustedAccount());
		
		UserAccount grant = accountService.grant(account.getUserId(), "ROLE_ADMIN");
		Assert.assertTrue(grant.isAdmin());
    }    
    
    @Test
    @Transactional
    public void whenFindAdminUser_thenReturnSucess() {
		UserAccount adminUser = accountService.loadUserByUsername("admin@system.com");
		Assert.assertNotNull(adminUser);
		Assert.assertTrue(adminUser.isAdmin());
    }

    @Test
    @Transactional
    public void givenExistsOneUser_whenFindByUserId_thenReturnOne() {
        // create account
        UserAccount account = new UserAccount();
        
        Set<String> roles = new HashSet<String>();
        roles.add("ROLE_USER");
        roles.add("ROLE_ADMIN");

        account.setRoles(roles);
        account.setDisplayName("John");
        accountRepository.save(account);
        
        assertTrue(accountRepository.exists(account.getId()));    	
    }
    
    @Test
    @Transactional
    public void createUserViaService() {
    	ConnectionData data = new ConnectionData("providerId", "providerUserId", "displayName", "profileUrl", "imageUrl", "accessToken", "secret", "refreshToken", 10L);
    	
		UserAccount account = accountService.createUserAccount(builderUserAccount(data));
		
		UserAccount loadUserByUserId = accountService.loadUserByUserId(account.getUserId());
		Assert.assertNotNull(loadUserByUserId);
    }
    
    
    private UserAccount builderUserAccount(ConnectionData data) {
    	UserAccount account = new UserAccount();
    	
    	account.setDisplayName(data.getDisplayName());
    	account.setImageUrl(data.getImageUrl());
    	
    	return account;
    }
}
