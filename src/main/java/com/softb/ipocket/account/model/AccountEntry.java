package com.softb.ipocket.account.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.softb.ipocket.configuration.model.Category;
import com.softb.system.repository.BaseEntity;

/**
 * Classe que representa os lançamentos realizados nas contas.
 * @author Erik Lacerda
 *
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "ACCOUNT_ENTRY")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = AccountEntry.class)
public class AccountEntry extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Column(name = "ACCOUNT_ID")
	@NotNull
	protected Integer accountId;
	
	@Column(name = "DESCRIPTION")
	@NotEmpty
	protected String description;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "CATEGORY_ID", referencedColumnName = "ID")
	protected Category category;
	
	@Column(name = "DATE")
	@NotNull
	protected Date date;
	
	@Column(name = "RECONCILED", columnDefinition="default 'N'")
	protected String reconciled;
	
	@Column(name="AMOUNT", columnDefinition="Decimal(10,2) default '0.00'")
	protected Double amount;
	
	@Column(name="USER_ID")
	@NotNull
	protected Integer userId;
	
	@Transient
	protected Double balance;
	
	@Transient
	protected String type;
	
	@Transient
	protected Integer destinyAccountId;
	
	@Transient
	@JsonIgnore
	protected boolean selected;
}
