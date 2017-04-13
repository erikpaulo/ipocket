package com.softb.ipocket.bill.web.resource;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * This entity represents the user cashflow projection
 * Created by eriklacerda on 3/7/16.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountCashFlowResource implements Serializable {

    private static final long serialVersionUID = 1L;

    private String name;
    private List<Double> data;
}
