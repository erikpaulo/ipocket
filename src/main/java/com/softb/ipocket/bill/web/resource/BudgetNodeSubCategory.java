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
public class BudgetNodeSubCategory extends BudgetNode implements Serializable {

    private static final long serialVersionUID = 1L;

    private String fullName;

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

        fullName = subCategory.getFullName();
        this.subCategory = subCategory;

        this.data = new ArrayList<>(  );
    }
}
