package com.softb.ipocket.budget.repository;

import com.softb.ipocket.budget.model.BudgetEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("AppBudgetEntryRepository")
public interface BudgetEntryRepository extends JpaRepository<BudgetEntry, Integer> {

}
