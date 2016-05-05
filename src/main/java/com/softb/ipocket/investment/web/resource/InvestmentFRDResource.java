package com.softb.ipocket.investment.web.resource;

import com.softb.ipocket.investment.model.Index;
import com.softb.ipocket.investment.model.InvestmentEntry;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * Resource that represents an investment referenced by some index like DI.
 * Created by eriklacerda on 4/18/16.
 */
@Data
public class InvestmentFRDResource extends InvestmentStatementResource implements Serializable {

    private static final long serialVersionUID = 1L;

    private Double netIncomePercent;
    private Double netIncome;

    private Double grossIncomePercent;
    private Double grossIncome;

    private Double amountInvested;
    private Double amountCurrent;

    private Double adminPercent;
    private Double taxesPercent;
    private Double taxesAmount;

    private Double qtdQuotes;

    private List<Double> amountCurrentUpdates;

    public InvestmentFRDResource(String name, Double netIncomePercent, Double netIncome, Double grossIncomePercent,
                                 Double grossIncome, Double amountInvested, Double amountCurrent, Double adminPercent,
                                 Double taxesPercent, Double taxesAmount, Double qtdQuotes, Double index, List<Double> indexIncome,
                                 List<Index> indexUpdates, List<InvestmentEntry> entries, List<Double> amountCurrentUpdates){

        super(name, index, indexIncome, indexUpdates, entries);

        this.netIncomePercent = netIncomePercent;
        this.netIncome = netIncome;
        this.grossIncomePercent = grossIncomePercent;
        this.grossIncome = grossIncome;
        this.amountInvested = amountInvested;
        this.amountCurrent = amountCurrent;
        this.adminPercent = adminPercent;
        this.taxesPercent = taxesPercent;
        this.taxesAmount = taxesAmount;
        this.qtdQuotes = qtdQuotes;
        this.amountCurrentUpdates = amountCurrentUpdates;
    }

    public InvestmentFRDResource() {

        super();

        this.netIncomePercent = 0.0;
        this.netIncome = 0.0;
        this.grossIncomePercent = 0.0;
        this.grossIncome = 0.0;
        this.amountInvested = 0.0;
        this.amountCurrent = 0.0;
        this.adminPercent = 0.0;
        this.taxesPercent = 0.0;
        this.taxesAmount = 0.0;
        this.qtdQuotes = 0.0;
    }


}
