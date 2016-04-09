package com.softb.ipocket.budget.model;

import com.softb.ipocket.categorization.model.SubCategory;
import com.softb.system.repository.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * Classe que representa os Pagamentos programados
 * @author Erik Lacerda
 *
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "BUDGET_ENTRY")
public class BudgetEntry extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "MONTH_PLAN")
	@NotNull
	protected Double monthPlan;

    @Column(name="BUDGET_ID")
    @NotNull
    protected Integer budgetId;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "SUBCATEGORY_ID", referencedColumnName = "ID")
	protected SubCategory subCategory;

    @Column(name="USER_GROUP_ID")
    @NotNull
    protected Integer groupId;
}
