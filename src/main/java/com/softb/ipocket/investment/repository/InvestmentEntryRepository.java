package com.softb.ipocket.investment.repository;

import com.softb.ipocket.investment.model.InvestmentEntry;
import org.springframework.dao.DataAccessException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;


@Repository("AppInvestmentEntryRepository")
public interface InvestmentEntryRepository extends JpaRepository<InvestmentEntry, Integer> {

    @Query("select ie from InvestmentEntry ie where ie.groupId = :groupId and ie.date between :dateStart and :dateEnd order by ie.date ASC")
    List<InvestmentEntry> findAllByUserPeriod(@Param("dateStart") Date dateStart, @Param("dateEnd") Date dateEnd, @Param("groupId") Integer groupId) throws DataAccessException;
}
