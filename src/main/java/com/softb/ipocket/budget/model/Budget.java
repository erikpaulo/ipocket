package com.softb.ipocket.budget.model;

import com.softb.system.repository.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;

/**
 * Classe que representa o planejamento de despesas e receitas
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

    @Column(name="YEAR")
    @NotNull
    protected Integer year;

    @Column(name="ACTIVE")
    @NotNull
    protected Boolean active;

    @Column(name="USER_GROUP_ID")
    @NotNull
    protected Integer groupId;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "BUDGET_ID", referencedColumnName = "ID")
    protected List<BudgetEntry> entries;

}
