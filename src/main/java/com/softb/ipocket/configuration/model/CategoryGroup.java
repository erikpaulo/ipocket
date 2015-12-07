package com.softb.ipocket.configuration.model;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.softb.system.repository.BaseEntity;

/**
 * Classe que representa as Categorias de lançamentos
 * @author Erik Lacerda
 *
 */
//@Data
@AllArgsConstructor
@NoArgsConstructor
//@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "CATEGORY_GROUP")
public class CategoryGroup extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Column(name = "NAME")
	@NotEmpty
	protected String name;
	
	@Column(name = "KIND")
	@NotEmpty
	protected String kind;

	@JsonManagedReference
	@OneToMany(fetch = FetchType.EAGER)
	@JoinColumn(name = "GROUP_ID", referencedColumnName = "ID")
	protected List<Category> categories;
	
	@Column(name="USER_ID")
	@NotNull
	protected Integer userId;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Category> getCategories() {
		return categories;
	}

	public void setCategories(List<Category> categories) {
		this.categories = categories;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	public String getKind() {
		return kind;
	}

	public void setKind(String kind) {
		this.kind = kind;
	}

	@Getter
	public enum Kind {
		INCOME("IC"), EXPENSE("EX"), INVESTIMENT("IV");
		private String value;
		
		private Kind(String kind){
			this.value = kind;
		}
	}
}
