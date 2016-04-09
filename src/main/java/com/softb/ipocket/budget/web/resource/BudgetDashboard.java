package com.softb.ipocket.budget.web.resource;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * Resource that represents a budget track.
 * Created by eriklacerda on 3/29/16.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BudgetDashboard implements Serializable {

    private static final long serialVersionUID = 1L;

    private BudgetNode data;
    private List<BudgetDeviation> mainDeviations;

}
