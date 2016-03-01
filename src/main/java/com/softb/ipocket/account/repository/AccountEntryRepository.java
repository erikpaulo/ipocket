package com.softb.ipocket.account.repository;

import com.softb.ipocket.account.model.AccountEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("AppAccountEntryRepository")
public interface AccountEntryRepository extends JpaRepository<AccountEntry, Integer> {
	
}
