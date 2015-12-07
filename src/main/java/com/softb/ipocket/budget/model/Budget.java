package com.softb.ipocket.budget.model;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import org.hibernate.validator.constraints.NotEmpty;

import com.softb.system.repository.BaseEntity;

/**
 * Classe que representa o orçamento de um usuário para um determinado ano. Só pode haver 
 * 01 budget por ano.
 * @author Erik Lacerda
 *
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "BUDGET")
public class Budget extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Column(name = "NAME")
	@NotEmpty
	protected String name;
	
	@Column(name = "OBJECTIVE")
	protected String objective;
	
	@Column(name="YEAR")
	@NotNull
	protected Integer year;

	@OneToMany(fetch = FetchType.EAGER)
	@JoinColumn(name = "BUDGET_ID", referencedColumnName = "ID")
	protected List<BudgetEntryGroup> entryGroups;
	
	@Column(name="USER_ID")
	@NotNull
	protected Integer userId;
}
