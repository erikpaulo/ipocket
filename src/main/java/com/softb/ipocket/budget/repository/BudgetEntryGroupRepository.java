package com.softb.ipocket.budget.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.softb.ipocket.budget.model.BudgetEntryGroup;



@Repository("iPocketEntryBudgetGroupRepository")
public interface BudgetEntryGroupRepository extends JpaRepository<BudgetEntryGroup, Integer> {
	
}
