package com.softb.ipocket.budget.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.softb.ipocket.configuration.model.Category;
import com.softb.system.repository.BaseEntity;


/**
 * Classe que representa as entradas do orçamento. Um valor definido por mês para
 * a categoria relacionada.
 * @author Erik Lacerda
 *
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "BUDGET_ENTRY")
public class BudgetEntry extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Column(name = "JAN")
	@NotNull
	protected Double janPlanned;
	
	@Column(name = "FEB")
	@NotNull
	protected Double febPlanned;
	
	@Column(name = "MAR")
	@NotNull
	protected Double marPlanned;
	
	@Column(name = "APR")
	@NotNull
	protected Double aprPlanned;
	
	@Column(name = "MAY")
	@NotNull
	protected Double mayPlanned;
	
	@Column(name = "JUN")
	@NotNull
	protected Double junPlanned;
	
	@Column(name = "JUL")
	@NotNull
	protected Double julPlanned;
	
	@Column(name = "AUG")
	@NotNull
	protected Double augPlanned;
	
	@Column(name = "SEP")
	@NotNull
	protected Double sepPlanned;
	
	@Column(name = "OCT")
	@NotNull
	protected Double octPlanned;
	
	@Column(name = "NOV")
	@NotNull
	protected Double novPlanned;
	
	@Column(name = "DEC")
	@NotNull
	protected Double decPlanned;
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "CATEGORY_ID", referencedColumnName = "ID")
	protected Category category;
	
	@Column(name="BUDGET_GROUP_ID")
	@NotNull
	protected Integer groupId;
	
	@Column(name="USER_ID")
	@NotNull
	protected Integer userId;
	
	@Transient
	@JsonIgnore
	protected Double thisMonth;
	
	@Transient
	@JsonIgnore
	protected Double totalAnnual;
}
