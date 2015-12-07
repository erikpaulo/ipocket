package com.softb.ipocket.bill.model;

import java.io.Serializable;
import java.util.Date;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * Classe que representa um evento de calendário para um pagamento.
 * @author Erik Lacerda
 *
 */
@Data
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class BillEvent implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@NotEmpty
	protected String title;
	
	@NotNull
	protected Date start;
	
	@NotNull
	protected Double amount;
	
	@NotNull
	protected Bill b;
	
	@NotNull
	protected BillEntry e;
}

