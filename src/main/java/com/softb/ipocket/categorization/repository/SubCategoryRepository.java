package com.softb.ipocket.categorization.repository;

import com.softb.ipocket.categorization.model.SubCategory;
import org.springframework.dao.DataAccessException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository("AppSubCategoryRepository")
public interface SubCategoryRepository extends JpaRepository<SubCategory, Integer> {

    @Query("select s from SubCategory s where s.id = :id and s.userId = :userId")
    SubCategory findOneByUser(@Param("id") Integer id, @Param("userId") Integer userId) throws DataAccessException;

}
