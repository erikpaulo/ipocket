package com.softb.ipocket.account.repository;

import java.util.Date;
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
	
	@Query("select ae from AccountEntry ae where ae.userId = :userId and ae.accountId = :accountId and ae.date = :date and ae.amount = :amount")
	List<AccountEntry> listAllByUserDateAmount(@Param("userId") Integer userId, @Param("accountId") Integer accountId, @Param("date") Date date, @Param("amount") Double amount) throws DataAccessException;
	
	@Query("select ae from AccountEntry ae, Account a where ae.accountId = a.id and a.type = 'CH' and ae.userId = :userId and ae.category.id = :catId order by ae.date  DESC")
	List<AccountEntry> listByUserCategory(@Param("userId") Integer userId, @Param("catId") Integer catId) throws DataAccessException;
	
	@Query("select ae from AccountEntry ae, Account a where ae.accountId = a.id and a.type = 'CH' and ae.userId = :userId and ae.date between :dateStart and :dateEnd")
	List<AccountEntry> listAllByUserPeriod(@Param("userId") Integer userId, @Param("dateStart") Date dateStart, @Param("dateEnd") Date dateEnd) throws DataAccessException;
	
	@Query("select ae from AccountEntry ae, Account a where ae.accountId = a.id and ae.userId = :userId and ae.date >= :dateStart and a.id = :accountId order by ae.date ASC")
	List<AccountEntry> listAllByUserDateAccount(@Param("accountId") Integer accountId, @Param("dateStart") Date dateStart, @Param("userId") Integer userId) throws DataAccessException;
	
	@Query("select sum(ae.amount) from AccountEntry ae where ae.userId = :userId and ae.date < :date and ae.accountId = :accountId")
	Double getBalanceByDateAccount(@Param("accountId") Integer accountId, @Param("date") Date date, @Param("userId") Integer userId) throws DataAccessException;
}
