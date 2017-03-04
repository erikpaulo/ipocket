package com.softb.ipocket.bill.web.resource;

import com.softb.ipocket.general.model.utils.InitArray;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Resource that represents a user budget.
 * Created by eriklacerda on 3/27/16.
 */
@Data
@AllArgsConstructor
public class BudgetNode implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;
    private String name;

    private Double totalPlanned;
    private List<Double> perMonthPlanned;
    private Double totalSpent;
    private List<Double> perMonthSpent;
//    private Double averageL3M;
    private Double deviation;
//    private Boolean isPositive;
//    private Double annualPlan;
//    private Double monthPlan;

    public BudgetNode(){
        this.id = null;
        this.name = "";

        this.totalPlanned = 0.0;
        this.perMonthPlanned = new ArrayList<Double>(  );
        this.perMonthPlanned = InitArray.initMonthValues();
        this.totalSpent = 0.0;
        this.perMonthSpent = InitArray.initMonthValues();
//        this.averageL3M = 0.0;
        this.deviation = 0.0;
//        this.isPositive = false;
//        this.annualPlan = 0.0;
//        this.monthPlan = 0.0;
    }

}
