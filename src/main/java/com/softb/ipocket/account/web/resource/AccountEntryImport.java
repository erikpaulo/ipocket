package com.softb.ipocket.account.web.resource;

import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.categorization.model.SubCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountEntryImport {
    private Date date;
//    private String description;
    private Double amount;
    private SubCategory subCategory;
    private List<AccountEntry> conflicts;
    private Boolean exists;
}