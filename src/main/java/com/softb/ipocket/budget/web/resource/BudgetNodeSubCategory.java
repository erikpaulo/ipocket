package com.softb.ipocket.budget.web.resource;

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
public class BudgetNodeSubCategory extends BudgetNode implements Serializable {

    private static final long serialVersionUID = 1L;

    private SubCategory subCategory;
    private List<BudgetNodeSubCategory> data;

    public BudgetNodeSubCategory(){
        super();
        this.subCategory = null;

        this.data = new ArrayList<>(  );
    }

    public BudgetNodeSubCategory (Integer id, String name, SubCategory subCategory){
        super();

        super.setId(id);
        super.setName(name);
        this.subCategory = subCategory;

        this.data = new ArrayList<>(  );
    }
}
