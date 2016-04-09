package com.softb.ipocket.budget.repository;

import com.softb.ipocket.budget.model.Budget;
import org.springframework.dao.DataAccessException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("AppBudgetRepository")
public interface BudgetRepository extends JpaRepository<Budget, Integer> {

    @Query("select b from Budget b where b.groupId = :groupId")
    List<Budget> findAllByUser(@Param("groupId") Integer groupId) throws DataAccessException;

    @Query("select b from Budget b where b.id = :id and b.groupId = :groupId")
    Budget findOneByUser(@Param("id") Integer id, @Param("groupId") Integer groupId) throws DataAccessException;
}
