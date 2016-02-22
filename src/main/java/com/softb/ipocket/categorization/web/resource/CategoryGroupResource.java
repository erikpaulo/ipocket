package com.softb.ipocket.categorization.web.resource;

import com.softb.ipocket.categorization.model.Category;
import lombok.Data;

import java.io.Serializable;

/**
 * Created by eriklacerda on 2/20/16.
 */
@Data
public class CategoryGroupResource implements Serializable {

    private static final long serialVersionUID = 1L;
    Category.Type id;
    String name;

    public CategoryGroupResource(Category.Type id, String name) {
        this.id = id;
        this.name = name;
    }
}
