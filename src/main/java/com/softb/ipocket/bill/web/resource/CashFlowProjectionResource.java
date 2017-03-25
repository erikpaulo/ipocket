package com.softb.ipocket.bill.web.resource;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * This entity represents the user cashflow projection
 * Created by eriklacerda on 3/7/16.
 */
@Data
@AllArgsConstructor
public class CashFlowProjectionResource implements Serializable {

    private static final long serialVersionUID = 1L;

    public CashFlowProjectionResource (){
        this.labels = new ArrayList<>(  );
        this.series = new ArrayList<>(  );
    }

    private List<String> labels;
    private List<AccountCashFlowResourceBill> series;
}
