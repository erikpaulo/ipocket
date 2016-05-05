package com.softb.ipocket.investment.repository;

import com.softb.ipocket.investment.model.Investment;
import org.springframework.dao.DataAccessException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository("AppInvestmentRepository")
public interface InvestmentRepository extends JpaRepository<Investment, Integer> {

    @Query("select i from Investment i where i.groupId = :groupId order by i.name")
    List<Investment> findAllByUser(@Param("groupId") Integer groupId) throws DataAccessException;

    @Query("select i from Investment i where i.id = :id and i.groupId = :groupId")
    Investment findOne(@Param("id") Integer id, @Param("groupId") Integer groupId) throws DataAccessException;
}
