package com.softb.ipocket.budget.model;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import com.softb.ipocket.configuration.model.CategoryGroup;
import com.softb.system.repository.BaseEntity;

/**
 * Classe que representa as entradas do orçamento. Um valor definido para todo o ano a partir 
 * das entradas do orçamento.
 * @author Erik Lacerda
 *
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "BUDGET_GROUP")
public class BudgetEntryGroup extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Column(name = "ANNUAL_AMOUNT")
	@NotNull
	protected Double totalPlanned;
	
	@Column(name = "BUDGET_ID")
	@NotNull
	protected Integer budgetId;
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "CATEGORY_GROUP_ID", referencedColumnName = "ID")
	protected CategoryGroup categoryGroup;
	
	@OneToMany(fetch = FetchType.EAGER)
	@JoinColumn(name = "BUDGET_GROUP_ID", referencedColumnName = "ID")
	protected List<BudgetEntry> entries;
	
	@Column(name="USER_ID")
	@NotNull
	protected Integer userId;
	
	
	
	
}
