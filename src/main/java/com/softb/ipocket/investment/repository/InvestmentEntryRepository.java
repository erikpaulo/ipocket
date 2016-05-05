package com.softb.ipocket.investment.repository;

import com.softb.ipocket.investment.model.InvestmentEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository("AppInvestmentEntryRepository")
public interface InvestmentEntryRepository extends JpaRepository<InvestmentEntry, Integer> {
}
