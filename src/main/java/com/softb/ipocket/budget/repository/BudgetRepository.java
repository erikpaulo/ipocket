package com.softb.ipocket.budget.repository;

import com.softb.ipocket.budget.model.Budget;
import org.springframework.dao.DataAccessException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository("AppBudgetRepository")
public interface BudgetRepository extends JpaRepository<Budget, Integer> {

    @Query("select b from Budget b where b.year = :year and b.groupId = :groupId")
    Budget findAllByUser(@Param("year") Integer year, @Param("groupId") Integer groupId) throws DataAccessException;
}
