package com.softb.ipocket.account.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Classe que representa o resumo das contas bancárias do usuário.
 * @author Erik Lacerda
 *
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class AccountSummary implements Serializable {

	private static final long serialVersionUID = 1L;
	
	protected List<AccountType> accountTypes;
	protected Double total;
	
	public AccountSummary(){
		this.accountTypes = new ArrayList<AccountType>();
		this.total = 0.0;
	}
}
