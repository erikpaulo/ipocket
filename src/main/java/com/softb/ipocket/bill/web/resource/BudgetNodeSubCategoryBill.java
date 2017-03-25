package com.softb.ipocket.bill.web.resource;

import com.softb.ipocket.categorization.model.SubCategory;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Resource that represents a node inside the Budget tree.
 * Created by eriklacerda on 3/27/16.
 */
@Data
@AllArgsConstructor
public class BudgetNodeSubCategoryBill extends BudgetNodeBill implements Serializable {

    private static final long serialVersionUID = 1L;

    private SubCategory subCategory;
    private List<BudgetNodeSubCategoryBill> data;

    public BudgetNodeSubCategoryBill(){
        super();
        this.subCategory = null;

        this.data = new ArrayList<>(  );
    }
}
