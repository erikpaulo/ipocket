package com.softb.ipocket.investment.web.resource;

import lombok.Data;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * Resource that groups all info about accounts.
 * Created by eriklacerda on 2/20/16.
 */
@Data
public class InvestmentSummaryResource implements Serializable {

    private static final long serialVersionUID = 1L;
    Double balance;
    Map<String, InvestmentTypeResource> types;

    public InvestmentSummaryResource() {
        this.types = new HashMap<>(  );
        this.balance = 0.0;
    }
}
