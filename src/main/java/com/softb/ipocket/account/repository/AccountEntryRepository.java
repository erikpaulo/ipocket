package com.softb.ipocket.account.repository;

import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.categorization.model.SubCategory;
import org.springframework.dao.DataAccessException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository("AppAccountEntryRepository")
public interface AccountEntryRepository extends JpaRepository<AccountEntry, Integer> {

    @Query("select ae from AccountEntry ae where ae.id = :id and ae.groupId = :groupId")
    AccountEntry findOne(@Param("id") Integer id, @Param("groupId") Integer groupId) throws DataAccessException;

    @Query("select ae from AccountEntry ae where ae.groupId = :groupId and ae.accountId = :accountId and ae.date = :date and ae.amount = :amount")
    List<AccountEntry> listAllByUserDateAmount(@Param("groupId") Integer groupId, @Param("accountId") Integer accountId, @Param("date") Date date, @Param("amount") Double amount) throws DataAccessException;

    @Query("select sum(ae.amount) from AccountEntry ae where ae.groupId = :groupId and ae.date < :date and ae.accountId = :accountId")
    Double getBalanceByDateAccount(@Param("accountId") Integer accountId, @Param("date") Date date, @Param("groupId") Integer groupId) throws DataAccessException;

    @Query("select sum(ae.amount) from AccountEntry ae where ae.groupId = :groupId and ae.date < :date")
    Double getBalanceByDate(@Param("date") Date date, @Param("groupId") Integer groupId) throws DataAccessException;

    @Query("select sum(ae.amount) from AccountEntry ae where ae.groupId = :groupId and ae.date between :start and :end")
    Double getBalanceByPeriod(@Param("start") Date start, @Param("end") Date end, @Param("groupId") Integer groupId) throws DataAccessException;

    @Query("select ae from AccountEntry ae, Account a where ae.accountId = a.id and ae.groupId = :groupId and ae.date >= :dateStart and a.id = :accountId order by ae.date ASC")
    List<AccountEntry> listAllByUserDateAccount(@Param("accountId") Integer accountId, @Param("dateStart") Date dateStart, @Param("groupId") Integer groupId) throws DataAccessException;

    @Query("select ae from AccountEntry ae where ae.groupId = :groupId and ae.date between :dateStart and :dateEnd order by ae.date ASC")
    List<AccountEntry> listAllByUserPeriod(@Param("dateStart") Date dateStart, @Param("dateEnd") Date dateEnd, @Param("groupId") Integer groupId) throws DataAccessException;

    @Query("select ae from AccountEntry ae, Account a where ae.accountId = a.id and ae.groupId = :groupId and ae.date between :dateStart and :dateEnd and a.type in (:types) order by ae.date ASC")
    List<AccountEntry> listAllByUserPeriodAccountType(@Param("dateStart") Date dateStart, @Param("dateEnd") Date dateEnd, @Param("groupId") Integer groupId, @Param("types") List<Account.Type> types) throws DataAccessException;

    @Query("select ae from AccountEntry ae, SubCategory sc where ae.groupId = :groupId and ae.date between :dateStart and :dateEnd and ae.subCategory.id = sc.id and sc.type = :type order by ae.date ASC")
    List<AccountEntry> listAllByUserSubcategoryTypePeriod(@Param("type") SubCategory.Type type, @Param("dateStart") Date dateStart, @Param("dateEnd") Date dateEnd, @Param("groupId") Integer groupId) throws DataAccessException;
}
