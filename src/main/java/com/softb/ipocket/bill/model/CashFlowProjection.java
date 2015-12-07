package com.softb.ipocket.bill.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Transient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Classe que representa um evento de calendário para um pagamento.
 * @author Erik Lacerda
 *
 */
@Data
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class CashFlowProjection implements Serializable {

	private static final long serialVersionUID = 1L;
	
	public CashFlowProjection(){
		this.series = new ArrayList<AccountCashFlow>();
	}
	
	@Transient
	private List<String> labels;
	
	private List<AccountCashFlow> series;
}

