package com.softb.ipocket.categorization.repository;

import com.softb.ipocket.categorization.model.Category;
import org.springframework.dao.DataAccessException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("AppCategoryRepository")
public interface CategoryRepository extends JpaRepository<Category, Integer> {
	
	@Query("select c from Category c where c.groupId = :groupId order by c.name")
	List<Category> listAllByUser(@Param("groupId") Integer groupId) throws DataAccessException;

    @Query("select c from Category c where c.groupId = :groupId and c.id = :id")
    Category findOneByUser(@Param("id") Integer id, @Param("groupId") Integer groupId) throws DataAccessException;
}
