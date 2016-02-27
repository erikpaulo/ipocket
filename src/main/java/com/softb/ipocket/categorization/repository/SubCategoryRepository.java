package com.softb.ipocket.categorization.repository;

import com.softb.ipocket.categorization.model.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("AppSubCategoryRepository")
public interface SubCategoryRepository extends JpaRepository<SubCategory, Integer> {
	
}
