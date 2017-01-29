package com.softb.ipocket.budget.web.resource;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created by eriklacerda on 21/12/16./**
 * This entity represents the user cashflow projection
 * Created by eriklacerda on 3/7/16.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NonAllocatedCategory {
    private static final long serialVersionUID = 1L;

    private Integer subCategoryId;
    private String name;
}
