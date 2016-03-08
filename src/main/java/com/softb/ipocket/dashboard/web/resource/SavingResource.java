package com.softb.ipocket.dashboard.web.resource;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * This entity represents the user saves by month and accumulated.
 * Created by eriklacerda on 3/7/16.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SavingResource implements Serializable {

    private static final long serialVersionUID = 1L;

    private List<Double> monthly;
    private List<Double> accumulated;
}
