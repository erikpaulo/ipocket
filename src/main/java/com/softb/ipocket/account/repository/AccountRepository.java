package com.softb.ipocket.account.repository;

import com.softb.ipocket.account.model.Account;
import org.springframework.dao.DataAccessException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("AppAccountRepository")
public interface AccountRepository extends JpaRepository<Account, Integer> {
	
	@Query("select a from Account a where a.groupId = :groupId order by a.name")
	List<Account> listAllByUser(@Param("groupId") Integer groupId) throws DataAccessException;

	@Query("select a from Account a where a.id = :id and a.groupId = :groupId")
	Account findOne(@Param("id") Integer id, @Param("groupId") Integer groupId) throws DataAccessException;
}
