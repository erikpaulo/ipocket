package com.softb.ipocket.account.web.resource;

import com.softb.ipocket.account.model.Account;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Resource that groups Account entinties by its types.
 * Created by eriklacerda on 2/20/16.
 */
@Data
public class AccountGroupResource implements Serializable {

    private static final long serialVersionUID = 1L;
    Account.Type id;
    String name;
    Double balance;
    List<Account> accounts;

    public AccountGroupResource(Account.Type id, String name) {
        this.id = id;
        this.name = name;
        this.accounts = new ArrayList<Account>(  );
        this.balance = 0.0;
    }
}
