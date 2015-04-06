package com.softb.ipocket.configuration.repository;

import java.util.List;

import org.springframework.dao.DataAccessException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.softb.ipocket.configuration.model.CategoryGroup;

@Repository("iPocketCategoryGroupRepository")
public interface CategoryGroupRepository extends JpaRepository<CategoryGroup, Integer> {
	
	@Query("select cg from CategoryGroup cg where cg.userId = :userId")
	List<CategoryGroup> listAllByUser(@Param("userId") Integer userId) throws DataAccessException;
	
	@Query("select cg from CategoryGroup cg where cg.id = :groupId and cg.userId = :userId")
	CategoryGroup getOneByIdUser(@Param("groupId") Integer groupId, @Param("userId") Integer userId) throws DataAccessException;
	
	@Query("select cg from CategoryGroup cg where cg.name = :name and cg.userId = :userId")
	List<CategoryGroup> getByNameUser(@Param("name") String name, @Param("userId") Integer userId) throws DataAccessException;
}
