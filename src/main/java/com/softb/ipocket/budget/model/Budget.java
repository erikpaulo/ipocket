package com.softb.ipocket.budget.model;

import com.softb.system.repository.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Classe que representa o orçamento do usuário para um determinado ano.
 * @author Erik Lacerda
 *
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "BUDGET")
public class Budget extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;
	@Column(name = "YEAR")
	@NotNull
	protected Integer year;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "BUDGET_ID", referencedColumnName = "ID")
	protected List<BudgetEntry> entries;

    @Column(name="USER_GROUP_ID")
    @NotNull
    protected Integer groupId;

    @Transient
	protected Double totalIncome;

	@Transient
	protected Double totalExpense;

	@Transient
	protected Double totalInvested;

	@Transient
	protected Double totalNotAllocated;

    public Budget(Integer year, Integer groupId) {
        this.year = year;
        this.groupId = groupId;

        this.entries = new ArrayList<>();
        this.totalIncome = 0.0;
        this.totalExpense = 0.0;
        this.totalInvested = 0.0;
        this.totalNotAllocated = 0.0;
    }
}
