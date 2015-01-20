package com.softb.ipocket.account.repository;

import java.util.List;

import org.springframework.dao.DataAccessException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.account.model.AccountEntry;

@Repository("iPocketAccountEntryRepository")
public interface AccountEntryRepository extends JpaRepository<AccountEntry, Integer> {
	
	@Query("select ae from AccountEntry ae where ae.userId = :userId")
	List<Account> listAllByUser(@Param("userId") Integer userId) throws DataAccessException;
}
