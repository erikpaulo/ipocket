package com.softb.system.security.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softb.system.security.model.RememberMeToken;

/**
 * JPA Repository for RememberMeToken entity.
 * 
 * TODO [marcus]: Avaliar possibilidade de utilizar MongoDB para esse tipo de repositório
 */
public interface RememberMeTokenRepository extends JpaRepository<RememberMeToken, String>{
    
    RememberMeToken findBySeries(String series);
    
    List<RememberMeToken> findByUsername(String username);
}
