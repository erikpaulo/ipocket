package com.softb.ipocket.general.model.utils;

import java.util.ArrayList;

/**
 * Created by eriklacerda on 3/31/16.
 */
public final class InitArray {
    public static final ArrayList<Double> initMonthValues(){
        ArrayList<Double> ret = new ArrayList<>(  );
        for (int i=0;i<12;i++){
            ret.add( 0.0 );
        }

        return ret;
    }
}
