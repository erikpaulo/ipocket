package com.softb.ipocket.investment.web.resource;

import com.softb.ipocket.investment.model.Index;
import com.softb.ipocket.investment.model.InvestmentEntry;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Resource that represents an investment referenced by some index like DI.
 * Created by eriklacerda on 4/18/16.
 */
@Data
@AllArgsConstructor
public class InvestmentStatementResource implements Serializable {

    private static final long serialVersionUID = 1L;

    private String name;
    private Double index;

    private List<Double> indexIncome;

    private List<Index> indexUpdates;
    private List<InvestmentEntry> entries;



    public InvestmentStatementResource(){
        this.name = "";
        this.index = 0.0;
        this.indexUpdates = new ArrayList<>(  );
        this.entries = new ArrayList<>(  );

        this.indexIncome = new ArrayList<>(  );
    }
}
