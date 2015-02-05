package com.softb.ipocket.bill.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.softb.ipocket.bill.model.BillEntry;

@Repository("iPocketBillEntryRepository")
public interface BillEntryRepository extends JpaRepository<BillEntry, Integer> {
	
}
