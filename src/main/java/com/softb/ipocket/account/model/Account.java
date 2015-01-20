package com.softb.ipocket.account.model;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import lombok.Data;
import lombok.EqualsAndHashCode;

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.softb.system.repository.BaseEntity;

/**
 * Classe que representa as Contas dos Usuários.
 * @author Erik Lacerda
 *
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "ACCOUNT")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Account extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Column(name = "NAME")
	@NotEmpty
	protected String name;

	@Column(name = "TYPE")
	@NotEmpty
	protected String type;
	
	@Column(name="USER_ID")
	@NotNull
	protected Integer userId;

	@Column(name = "BRANCH")
	protected String branch;

	@Column(name = "NUMBER")
	protected String number;
	
	@Column(name = "START_BALANCE", columnDefinition = "double default 100")
	protected Double startBalance;
	
	@OneToMany(fetch = FetchType.EAGER)
	@JoinColumn(name = "ACCOUNT_ID", referencedColumnName = "ID")
	protected List<AccountEntry> entries;
	
	@Transient
	protected Double balance;
}
