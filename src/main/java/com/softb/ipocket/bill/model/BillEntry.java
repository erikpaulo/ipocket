package com.softb.ipocket.bill.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import com.softb.system.repository.BaseEntity;

/**
 * Classe que representa as Contas dos Usuários.
 * @author Erik Lacerda
 *
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "BILL_ENTRY")
public class BillEntry extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Column(name = "DATE")
	@NotNull
	protected Date date;
	
	@Column(name="AMOUNT")
	@NotNull
	protected Double amount;
	
	@Column(name="BILL_ID")
	@NotNull
	protected Integer billId;
}
