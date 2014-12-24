package com.softb.system.security.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.transaction.Transactional;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.softb.system.config.ServiceConfig;
import com.softb.system.security.model.UserSocialConnection;
import com.softb.system.security.repository.UserSocialConnectionRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = ServiceConfig.class)

public class UserSocialConnectionTest {

    @Autowired
    UserSocialConnectionRepository userSocialConnectionRepository;


    private void setupUserSocialConnectionList(){
        UserSocialConnection userSocialConnection = new UserSocialConnection
                ("jiwhiz", "google", "google-jiwhiz", 1, "Yuan", "http://", "http://", "token", "secret", "token", 1000000l);
        userSocialConnectionRepository.save(userSocialConnection);
        userSocialConnection = new UserSocialConnection
                ("jiwhiz2", "google", "google-jiwhiz2", 2, "Yuan", "http://", "http://", "token", "secret", "token", 1000000l);
        userSocialConnectionRepository.save(userSocialConnection);
        
        userSocialConnection = new UserSocialConnection
                ("jiwhiz", "facebook", "facebook-jiwhiz", 1, "Yuan", "http://", "http://", "token", "secret", "token", 1000000l);
        userSocialConnectionRepository.save(userSocialConnection);
        userSocialConnection = new UserSocialConnection
                ("jiwhiz2", "facebook", "facebook-jiwhiz2", 1, "Yuan", "http://", "http://", "token", "secret", "token", 1000000l);
        userSocialConnectionRepository.save(userSocialConnection);

        userSocialConnection = new UserSocialConnection
                ("jiwhiz", "twitter", "twitter-jiwhiz", 1, "Yuan", "http://", "http://", "token", "secret", "token", 1000000l);
        userSocialConnectionRepository.save(userSocialConnection);
        userSocialConnection = new UserSocialConnection
                ("jiwhiz2", "twitter", "twitter-jiwhiz2", 1, "Yuan", "http://", "http://", "token", "secret", "token", 1000000l);
        userSocialConnectionRepository.save(userSocialConnection);

        userSocialConnection = new UserSocialConnection
                ("other", "facebook", "facebook-other", 1, "Yuan", "http://", "http://", "token", "secret", "token", 1000000l);
        userSocialConnectionRepository.save(userSocialConnection);
        userSocialConnection = new UserSocialConnection
                ("other", "twitter", "twitter-other", 1, "Yuan", "http://", "http://", "token", "secret", "token", 1000000l);
        userSocialConnectionRepository.save(userSocialConnection);

    }
    
    // -------------------------------------------------------------------------

    @Test
    @Transactional
    public void testUserSocialConnectionCRUD() {
        // create user connection
        UserSocialConnection userSocialConnection = new UserSocialConnection
                ("jiwhiz", "google", "google-jiwhz", 1, "Yuan", "http://", "http://", "token", "secret", "token", 1000000l);

        userSocialConnectionRepository.save(userSocialConnection);
        Integer key = userSocialConnection.getId();
        assertTrue(userSocialConnectionRepository.exists(key));

        // read
        UserSocialConnection userSocialConnectionInDb = userSocialConnectionRepository.findOne(key);
        assertEquals("jiwhiz", userSocialConnectionInDb.getUserId());

        // update
        String newProfileUrl = "www.hello.com";
        userSocialConnection.setProfileUrl(newProfileUrl);
        userSocialConnectionRepository.save(userSocialConnection);
        userSocialConnectionInDb = userSocialConnectionRepository.findOne(key);
        assertEquals(newProfileUrl, userSocialConnectionInDb.getProfileUrl());

        // delete
        userSocialConnectionRepository.delete(userSocialConnection);
        userSocialConnectionInDb = userSocialConnectionRepository.findOne(key);
        assertNull(userSocialConnectionInDb);
        assertFalse(userSocialConnectionRepository.exists(key));
    }

    @Test
    @Transactional
    public void testFindByUsername(){
        setupUserSocialConnectionList();
    	        
        List<UserSocialConnection> result = userSocialConnectionRepository.findByUserId("jiwhiz");
        assertEquals(3, result.size());

        result = userSocialConnectionRepository.findByUserId("other");
        assertEquals(2, result.size());
    }

    @Test
    @Transactional
    public void testFindByUsernameAndProviderId(){
        setupUserSocialConnectionList();
        
        List<UserSocialConnection> result = userSocialConnectionRepository.findByUserIdAndProviderId("jiwhiz", "google");
        assertEquals(1, result.size());

        result = userSocialConnectionRepository.findByUserIdAndProviderId("other", "google");
        assertEquals(0, result.size());
    }

    @Test
    @Transactional
    public void testFindByUsernameAndProviderIdAndProviderUserId(){
        setupUserSocialConnectionList();
        
        UserSocialConnection result = userSocialConnectionRepository.findByUserIdAndProviderIdAndProviderUserId("jiwhiz", "google", "google-jiwhiz");
        assertNotNull(result);

        result = userSocialConnectionRepository.findByUserIdAndProviderIdAndProviderUserId("jiwhiz", "google", "google-jiwhiz2");
        assertNull(result);
    }

    @Test
    @Transactional
    public void testFindByProviderIdAndProviderUserIds(){
        setupUserSocialConnectionList();
        
        Set<String> providerUserIds = new HashSet<String>();
        providerUserIds.add("google-jiwhiz");
        providerUserIds.add("google-jiwhiz2");
        
        List<UserSocialConnection> result = userSocialConnectionRepository.findByProviderIdAndProviderUserIdIn("google", providerUserIds);
        assertEquals(2, result.size());

    }

}
