package com.softb.ipocket.categorization.web.resource;

import com.softb.ipocket.categorization.model.Category;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Resource that groups Category entinties by its types.
 * Created by eriklacerda on 2/20/16.
 */
@Data
public class CategoryGroupResource implements Serializable {

    private static final long serialVersionUID = 1L;
    Category.Type id;
    String name;
    List<Category> categories;

    public CategoryGroupResource(Category.Type id, String name) {
        this.id = id;
        this.name = name;
        this.categories = new ArrayList<Category>(  );
    }
}
