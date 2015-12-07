package com.softb.ipocket.general.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Transient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * Classe que representa as Categorias de lançamentos
 * @author Erik Lacerda
 *
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Period implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Transient
	@NotEmpty
	protected Date startDate;
	
	@Transient
	@NotEmpty
	protected Date endDate;
	
	@Transient
	protected String groupBy;
}
