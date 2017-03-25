package com.softb.ipocket.bill.web.resource;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Resource that represents a user budget.
 * Created by eriklacerda on 3/27/16.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BudgetNodeRootBill extends BudgetNodeBill implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer year;
    private Boolean active;

    private Double totalIncome;
    private Double totalExpense;

    private List<BudgetNodeGroupBill> data;

    public BudgetNodeRootBill(Integer year, Boolean active){
        super();

        this.year = year;
        this.active = active;
        this.data = new ArrayList<>(  );
    }
}
