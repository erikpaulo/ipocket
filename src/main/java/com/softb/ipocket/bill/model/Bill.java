package com.softb.ipocket.bill.model;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import lombok.Data;
import lombok.EqualsAndHashCode;

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.softb.ipocket.account.model.Category;
import com.softb.system.repository.BaseEntity;

/**
 * Classe que representa as Contas dos Usuários.
 * @author Erik Lacerda
 *
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "BILL")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Bill extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Column(name = "DESCRIPTION")
	@NotEmpty
	protected String description;
	
	@Column(name="CALC_TYPE")
	@NotEmpty
	protected String calcType;
	
	@Column(name="AVERAGE_COUNT")
	protected Integer averageCount;
	
	@Column(name="USER_ID")
	@NotNull
	protected Integer userId;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "CATEGORY_ID", referencedColumnName = "ID")
	protected Category category;
	
//	@ManyToOne(fetch = FetchType.EAGER)
//	@JoinColumn(name = "ACCOUNT_ID", referencedColumnName = "ID")
//	protected Account account;
	
	@Column(name="ACCOUNT_ID")
	@NotNull
	protected Integer accountId;

	@Column(name="DESTINY_ACCOUNT_ID")
	protected Integer destinyAccountId;
	
	@OneToMany(fetch = FetchType.EAGER)
	@JoinColumn(name= "BILL_ID", referencedColumnName = "ID")
	protected List<BillEntry> billEntries;
	
	@Transient
	protected Date date;
	
	@Transient
	protected Integer times;
	
	@Transient
	protected Double amount;
	
}
