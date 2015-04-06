package com.softb.ipocket.configuration.repository;

import java.util.List;

import org.springframework.dao.DataAccessException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.softb.ipocket.configuration.model.Category;

@Repository("iPocketCategoryRepository")
public interface CategoryRepository extends JpaRepository<Category, Integer> {
	
	@Query("select c from Category c where c.userId = :userId")
	List<Category> listAllByUser(@Param("userId") Integer userId) throws DataAccessException;
//	
	@Query("select c from Category c where c.id = :id and c.userId = :userId")
	Category findOneByUser(@Param("id") Integer id, @Param("userId") Integer userId) throws DataAccessException;
	
	@Query("select c from Category c where c.group.id = :groupId and c.userId = :userId")
	List<Category> findByGroupUser(@Param("groupId") Integer groupId, @Param("userId") Integer userId) throws DataAccessException;
}
