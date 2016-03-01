package com.softb.ipocket.account.web.resource;

import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Resource that groups all info about accounts.
 * Created by eriklacerda on 2/20/16.
 */
@Data
public class AccountSummaryResource implements Serializable {

    private static final long serialVersionUID = 1L;
    Double balance;
    List<AccountGroupResource> groups;

    public AccountSummaryResource() {
        this.groups = new ArrayList<AccountGroupResource>(  );
        this.balance = 0.0;
    }
}
