package com.softb.ipocket.bill.repository;

import java.util.List;

import org.springframework.dao.DataAccessException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.softb.ipocket.bill.model.Bill;



@Repository("iPocketBillRepository")
public interface BillRepository extends JpaRepository<Bill, Integer> {
	
	@Query("select b from Bill b where b.userId = :userId")
	List<Bill> listAllByUser(@Param("userId") Integer userId) throws DataAccessException;
	
	@Query("select b from Bill b where b.accountId = :accountId and b.userId = :userId")
	List<Bill> listAllByAccountUser(@Param("accountId") Integer accountId, @Param("userId") Integer userId) throws DataAccessException;
	
}
