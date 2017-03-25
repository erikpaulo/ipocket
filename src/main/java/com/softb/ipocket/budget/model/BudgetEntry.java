package com.softb.ipocket.budget.model;

import com.softb.ipocket.categorization.model.SubCategory;
import com.softb.system.repository.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * Classe que representa uma entrada no orçamento do usuário
 * @author Erik Lacerda
 *
 */
@AllArgsConstructor
@Data
@Entity
@Table(name = "BUDGET_ENTRY")
public class BudgetEntry extends BaseEntity<Integer> implements Serializable {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "SUBCATEGORY_ID", referencedColumnName = "ID")
    protected SubCategory subCategory;

    @Column(name = "BUDGET_ID")
    @NotNull
    protected Integer budgetID;

    @Column(name = "JAN")
    protected Double jan = 0.0;

    @Column(name = "FEB")
    protected Double feb = 0.0;

    @Column(name = "MAR")
    protected Double mar = 0.0;

    @Column(name = "APR")
    protected Double apr = 0.0;

    @Column(name = "MAY")
    protected Double may = 0.0;

    @Column(name = "JUN")
    protected Double jun = 0.0;

    @Column(name = "JUL")
    protected Double jul = 0.0;

    @Column(name = "AUG")
    protected Double aug = 0.0;

    @Column(name = "SEP")
    protected Double sep = 0.0;

    @Column(name = "OCT")
    protected Double oct = 0.0;

    @Column(name = "NOV")
    protected Double nov = 0.0;

    @Column(name = "DEC")
    protected Double dec = 0.0;

    @Column(name = "POSITIVE")
    protected Boolean positive = true;

    @Column(name="USER_GROUP_ID")
    protected Integer groupId;

    @Transient
    private Integer budgetYear;

    @Transient
    private Integer subCategoryId;

    public BudgetEntry(){
        this.subCategory = null;
        this.budgetID = null;
        this.jan = 0.0;
        this.feb = 0.0;
        this.mar = 0.0;
        this.apr = 0.0;
        this.may = 0.0;
        this.jun = 0.0;
        this.jul = 0.0;
        this.aug = 0.0;
        this.sep = 0.0;
        this.oct = 0.0;
        this.nov = 0.0;
        this.dec = 0.0;
    }

    public BudgetEntry(SubCategory subCategory){
        this.subCategory = subCategory;
        this.budgetID = null;
        this.jan = 0.0;
        this.feb = 0.0;
        this.mar = 0.0;
        this.apr = 0.0;
        this.may = 0.0;
        this.jun = 0.0;
        this.jul = 0.0;
        this.aug = 0.0;
        this.sep = 0.0;
        this.oct = 0.0;
        this.nov = 0.0;
        this.dec = 0.0;
    }
}
