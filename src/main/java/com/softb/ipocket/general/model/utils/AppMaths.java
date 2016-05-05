package com.softb.ipocket.general.model.utils;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Created by eriklacerda on 3/31/16.
 */
public final class AppMaths {
    public static double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();

        BigDecimal bd = new BigDecimal(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}
