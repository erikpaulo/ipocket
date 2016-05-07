package com.softb.ipocket.investment.model;

import com.softb.system.repository.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;

/**
 * Classe que representa uma entrada no investimento.
 * @author Erik Lacerda
 *
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "INVESTMENT_ENTRY")
public class InvestmentEntry extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;

    @Column(name = "INVESTMENT_ID")
    protected Integer investmentId;

//    @ManyToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name = "INVESTMENT_ID", referencedColumnName = "ID")
//    protected Investment investment;

    @Column(name = "DATE")
    @NotNull
    protected Date date;

    @Column(name = "TYPE")
    @NotNull
    protected String type;

    @Column(name = "QTD_QUOTES")
    @NotNull
    protected Double qtdQuotes;

    @Column(name = "AMOUNT")
    @NotNull
    protected Double amount;

    @Column(name = "INCOME_TAX")
    protected Double incomeTax;

    @Column(name = "IOF")
    protected Double iof;

    @Column(name="USER_GROUP_ID")
    @NotNull
    protected Integer groupId;

    @Transient
    protected Double indexValue;

}
