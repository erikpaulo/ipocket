package com.softb.ipocket.bill.repository;

import com.softb.ipocket.bill.model.Bill;
import org.springframework.dao.DataAccessException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository("AppBillRepository")
public interface BillRepository extends JpaRepository<Bill, Integer> {

    @Query("select b from Bill b where b.groupId = :groupId order by b.date")
    List<Bill> findAllByUser(@Param("groupId") Integer groupId) throws DataAccessException;

    @Query("select b from Bill b where b.date between :start and :end and b.groupId = :groupId order by b.date")
    List<Bill> findAllByUserPeriod(@Param("start") Date start, @Param("end") Date end, @Param("groupId") Integer groupId) throws DataAccessException;

    @Query("select b from Bill b where b.done = false and b.groupId = :groupId order by b.date")
    List<Bill> findAllUndoneByUser(@Param("groupId") Integer groupId) throws DataAccessException;

    @Query("select b from Bill b where b.id = :id and b.groupId = :groupId")
    Bill findOneByUser(@Param("id") Integer id, @Param("groupId") Integer groupId) throws DataAccessException;
}
