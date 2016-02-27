package com.softb.system.security.repository;

import com.softb.system.security.model.UserAccount;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * JPA Repository para UserAccount.
 * 
 * TODO [marcus]: Avaliar possibilidade de utilizar MongoDB para esse tipo de repositório
 */
//@Repository
@Repository("AppUserAccountRepository")
public interface UserAccountRepository extends JpaRepository<UserAccount, Integer>{
    
    UserAccount findByEmail(String email);

    @Query("select ua from UserAccount ua where ua.googleId = :googleId")
    UserAccount findByGoogleId(@Param("googleId") String googleId);
    
    List<UserAccount> findAll(Sort sort);
}
