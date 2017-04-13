package com.softb.ipocket.bill.web.resource;

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
public class BudgetNodeCategory extends BudgetNode implements Serializable {
    private static final long serialVersionUID = 1L;

    private List<BudgetNodeSubCategory> data;

    public BudgetNodeCategory(){
        super();

        this.data = new ArrayList<>(  );
    }


    public BudgetNodeCategory(String name){
        super();

        super.setName(name);
        this.data = new ArrayList<>(  );
    }
}
