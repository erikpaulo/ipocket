package com.softb.ipocket.dashboard.web.resource;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

/**
 * Resource that groups Account entinties by its types.
 * Created by eriklacerda on 2/20/16.
 */
@Data
@AllArgsConstructor
public class DashboardResource implements Serializable {

    private static final long serialVersionUID = 1L;

    private SavingResource savings;
    private SumarizedInfosResource sumarized;
}
