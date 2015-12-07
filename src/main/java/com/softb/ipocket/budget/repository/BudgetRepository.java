package com.softb.ipocket.budget.repository;

import org.springframework.dao.DataAccessException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.softb.ipocket.budget.model.Budget;



@Repository("iPocketBudgetRepository")
public interface BudgetRepository extends JpaRepository<Budget, Integer> {
	@Query("select b from Budget b where b.id = :budgetId and b.userId = :userId")
	Budget getOneByUser(@Param("budgetId") Integer budgetId, @Param("userId") Integer userId) throws DataAccessException;
}
