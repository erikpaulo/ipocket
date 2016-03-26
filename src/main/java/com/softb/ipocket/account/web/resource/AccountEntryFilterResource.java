package com.softb.ipocket.account.web.resource;

import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.categorization.model.SubCategory;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * Resource that hold parameters for listing account entries by filter.
 * Created by eriklacerda on 2/20/16.
 */
@Data
public class AccountEntryFilterResource implements Serializable {

    private static final long serialVersionUID = 1L;

    private Date start;
    private Date end;
    private SubCategory subCategory;
    private List<Account> accounts;
    private String categoryType;
}
