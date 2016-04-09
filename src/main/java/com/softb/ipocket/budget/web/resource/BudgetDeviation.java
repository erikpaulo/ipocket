package com.softb.ipocket.budget.web.resource;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

/**
 * Resource that represents a deviation in one category of the budget.
 * Created by eriklacerda on 3/29/16.
 */
@Data
@AllArgsConstructor
public class BudgetDeviation implements Serializable {

    private static final long serialVersionUID = 1L;

    private String name;
    private Double totalPlanned;
    private Double totalSpent;
    private Double deviation;

    public BudgetDeviation (){
        this.name = null;
        this.totalPlanned = 0.0;
        this.totalSpent = 0.0;
        this.deviation = 0.0;
    }

}
