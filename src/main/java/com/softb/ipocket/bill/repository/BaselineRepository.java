package com.softb.ipocket.bill.repository;

import com.softb.ipocket.bill.model.Baseline;
import org.springframework.dao.DataAccessException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository("AppBaselineRepository")
public interface BaselineRepository extends JpaRepository<Baseline, Integer> {

    @Query("select b from Baseline b where b.groupId = :groupId order by b.date")
    List<Baseline> findAllByUser(@Param("groupId") Integer groupId) throws DataAccessException;

    @Query("select b from Baseline b where b.id = :id and b.groupId = :groupId")
    Baseline findOneByUser(@Param("id") Integer id, @Param("groupId") Integer groupId) throws DataAccessException;

    @Query("select b from Baseline b where b.groupId = :groupId and b.date between :start and :end")
    List<Baseline> findAllByPeriod(@Param("start") Date start, @Param("end") Date end, @Param("groupId") Integer groupId) throws DataAccessException;
}
