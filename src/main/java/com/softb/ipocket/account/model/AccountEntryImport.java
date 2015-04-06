package com.softb.ipocket.account.model;

import java.util.Date;
import java.util.List;

import com.softb.ipocket.configuration.model.CategoryGroup;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountEntryImport {
	private Date date;
	private String description;
	private Double amount;
	private CategoryGroup category;
	private List<AccountEntry> conflicts;
	private Boolean ok;
}
