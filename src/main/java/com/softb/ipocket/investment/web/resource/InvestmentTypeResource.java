package com.softb.ipocket.investment.web.resource;

import com.softb.ipocket.investment.model.Investment;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Resource that groups Account entinties by its types.
 * Created by eriklacerda on 2/20/16.
 */
@Data
public class InvestmentTypeResource implements Serializable {

    private static final long serialVersionUID = 1L;
    Investment.Type id;
    String name;
    Double amountCurrent;
    Double amountInvested;
    Double perGrossIncome;
    List<Investment> investments;

    public InvestmentTypeResource(Investment.Type type) {
        this.id = type;
        this.name = type.getName();
        this.amountCurrent = 0.0;
        this.amountInvested = 0.0;
        this.perGrossIncome = 0.0;

        this.investments = new ArrayList<>(  );
    }
}
