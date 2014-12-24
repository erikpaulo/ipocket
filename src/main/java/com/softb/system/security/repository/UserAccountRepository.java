package com.softb.system.security.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.softb.system.security.model.UserAccount;


/**
 * JPA Repository para UserAccount.
 * 
 * TODO [marcus]: Avaliar possibilidade de utilizar MongoDB para esse tipo de repositório
 */
@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, Integer>{
    
    UserAccount findByEmail(String email);
    
    List<UserAccount> findAll(Sort sort);
}
