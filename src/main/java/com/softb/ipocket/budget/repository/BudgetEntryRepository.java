package com.softb.ipocket.budget.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.softb.ipocket.budget.model.BudgetEntry;



@Repository("iPocketEntryGroupRepository")
public interface BudgetEntryRepository extends JpaRepository<BudgetEntry, Integer> {
	
}
