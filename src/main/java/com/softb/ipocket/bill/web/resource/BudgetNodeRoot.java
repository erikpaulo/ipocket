package com.softb.ipocket.bill.web.resource;

import com.softb.ipocket.bill.model.Bill;
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
public class BudgetNodeRoot extends BudgetNode implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer year;

    private Double totalIncome;
    private Double totalExpense;
    private Double totalInvested;
    private Double totalNotAllocated;

    private List<BudgetNodeGroup> data;
    private List<Bill> bills;

    public BudgetNodeRoot(Integer id, Integer year){
        super();

        this.setId(id);
        this.year = year;
        this.data = new ArrayList<>(  );
        this.bills = new ArrayList<>(  );

        this.totalIncome = 0.0;
        this.totalExpense = 0.0;
        this.totalInvested = 0.0;
        this.totalNotAllocated = 0.0;
    }
}
