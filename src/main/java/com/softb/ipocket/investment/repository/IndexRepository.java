package com.softb.ipocket.investment.repository;

import com.softb.ipocket.investment.model.Index;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("AppIndexRepository")
public interface IndexRepository extends JpaRepository<Index, Integer> {
}
