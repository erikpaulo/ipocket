package com.softb.ipocket.account.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Classe que representa os tipos de contas tratadas pelo sistema.
 * @author Erik Lacerda
 *
 */
@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
public class AccountType implements Serializable {

	private static final long serialVersionUID = 1L;
	
	public AccountType(){
		this.accounts = new ArrayList<Account>();
		this.total = 0.0;
	}
	
	protected String name;
	protected List<Account> accounts;
	protected Double total;
}
