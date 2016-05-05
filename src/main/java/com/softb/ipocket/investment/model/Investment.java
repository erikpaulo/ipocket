package com.softb.ipocket.investment.model;

import com.softb.system.repository.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * Classe que representa um investimento.
 * @author Erik Lacerda
 *
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "INVESTMENT")
public class Investment extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;

    @Column(name = "NAME")
    @NotEmpty
    protected String name;

    @Column(name = "TYPE")
    @NotNull
    @Enumerated(EnumType.STRING)
    protected Type type;

    @Column(name = "ADMIN_FEE")
    @NotNull
    protected Double adminFee;

    @Column(name="CREATE_DATE")
    @NotNull
    protected Date createDate;

    @Column(name="ACTIVATED")
    @NotNull
    protected Boolean activated;

    @Column(name="USER_GROUP_ID")
    @NotNull
    protected Integer groupId;

    @Column(name="LAST_UPDATE")
    @NotNull
    protected Date lastUpdate;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "INVESTMENT_ID", referencedColumnName = "ID")
    protected List<InvestmentEntry> entries;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "INVESTMENT_ID", referencedColumnName = "ID")
    protected List<Index> indexUpdates;


    @Transient
    protected Double quoteValue;

    @Transient
    protected  Double amountCurrent;

    @Transient
    protected  Double amountInvested;

    @Transient
    protected Double perGrossIncome;

    public enum Type {
        FCP ( "Fundo de Curto Prazo" ),
        FRD ( "Fundo Referenciado" ),
        FRF ( "Fundo de Renda Fixa" ),
        FAC ( "Fundo de Ações" ),
        FCB ( "Fundo Cambial" ),
        FDE ( "Fundo da Dívida Externa" ),
        FMM ( "Fundo Multimercado" );
        private String name;

        Type(String name) {
            this.name = name;
        }

        public String getName() {
            return this.name;
        }
    }

}
