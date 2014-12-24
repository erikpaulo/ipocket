package com.softb.system.security.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.softb.system.security.model.UserSocialConnection;

/**
 * JPA Repository para UserSocialConnection entity.
 * TODO [marcus]: Avaliar possibilidade de utilizar MongoDB para esse tipo de repositório 
 */
@Repository
public interface UserSocialConnectionRepository extends JpaRepository<UserSocialConnection, Integer>{
    
    List<UserSocialConnection> findByUserId(String userId);
    
    List<UserSocialConnection> findByUserIdAndProviderId(String userId, String providerId);
    
    List<UserSocialConnection> findByProviderIdAndProviderUserId(String providerId, String providerUserId);
    
    UserSocialConnection findByUserIdAndProviderIdAndProviderUserId(String userId, String providerId, String providerUserId);
    
    List<UserSocialConnection> findByProviderIdAndProviderUserIdIn(String providerId, Collection<String> providerUserIds);
}
