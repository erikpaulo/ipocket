package com.softb.ipocket.account.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import lombok.Data;
import lombok.EqualsAndHashCode;

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.softb.system.repository.BaseEntity;

/**
 * Classe que representa as Categorias de lançamentos
 * @author Erik Lacerda
 *
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "CATEGORY")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Category extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Column(name = "NAME")
	@NotEmpty
	protected String name;

	@Column(name = "SUBCATEGORY_NAME")
	@NotEmpty
	protected String subCategoryName;
	
	@Column(name = "FIXED_COST")
	@NotEmpty
	protected String fixedCost;
	
	@Column(name = "KIND")
	@NotEmpty
	protected String kind;
	
	@Column(name="USER_ID")
	@NotNull
	protected Integer userId;
	
}
