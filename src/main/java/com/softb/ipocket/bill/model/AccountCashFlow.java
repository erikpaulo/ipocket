package com.softb.ipocket.bill.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Transient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Classe que representa os valores ao longo do tempo que caracterizam o fluxo de caixa.
 * @author Erik Lacerda
 *
 */
@Data
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class AccountCashFlow implements Serializable {

	private static final long serialVersionUID = 1L;
	
	public AccountCashFlow(){
		this.data = new ArrayList<Double>();
	}
	
	@Transient
	private String name;
	
	private List<Double> data;
}

