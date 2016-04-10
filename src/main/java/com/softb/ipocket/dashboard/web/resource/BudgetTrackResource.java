package com.softb.ipocket.dashboard.web.resource;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * This entity represents the user budget planned and the current situation.
 * Created by eriklacerda on 4/7/16.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BudgetTrackResource implements Serializable {

    private static final long serialVersionUID = 1L;

    private Double expectedSaving;
    private Double currentSaving;
}
