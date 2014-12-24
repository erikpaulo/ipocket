package com.softb.ipocket.account.repository;

import java.util.List;

import org.springframework.dao.DataAccessException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.softb.ipocket.account.model.Account;

@Repository("iPocketAccountRepository")
public interface AccountRepository extends JpaRepository<Account, Integer> {
	
	@Query("select a from Account a where a.userId = :userId")
	List<Account> listAllByUser(@Param("userId") Integer userId) throws DataAccessException;
}
