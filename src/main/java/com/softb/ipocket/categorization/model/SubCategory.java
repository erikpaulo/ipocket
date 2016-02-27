package com.softb.ipocket.categorization.model;

import com.softb.system.repository.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * Classe que representa as Sub Categorias de lançamentos
 * @author Erik Lacerda
 *
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "SUBCATEGORY")
public class SubCategory extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Column(name = "NAME")
	@NotEmpty
	protected String name;

	@Column(name = "ACTIVATED")
	@NotNull
	protected Boolean activated;

	@Column(name = "TYPE")
	protected String type;

    @NotNull
    @Column(name = "CATEGORY_ID")
    protected  Integer categoryId;

    @Column(name="USER_ID")
	@NotNull
	protected Integer userId;

}
