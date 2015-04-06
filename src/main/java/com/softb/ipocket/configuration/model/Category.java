package com.softb.ipocket.configuration.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import lombok.EqualsAndHashCode;

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.softb.system.repository.BaseEntity;

/**
 * Classe que representa as Categorias de lançamentos
 * @author Erik Lacerda
 *
 */
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "CATEGORY")
public class Category extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Column(name = "NAME")
	@NotEmpty
	protected String name;

	@Column(name = "TYPE")
	@NotEmpty
	protected String type;

	@JsonBackReference
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "GROUP_ID", referencedColumnName = "ID")
	@NotNull
	protected CategoryGroup group;
	
	@Column(name="USER_ID")
	@NotNull
	protected Integer userId;
	
	@Transient
	protected String fullName;
	
	@Transient
	protected String groupName;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public CategoryGroup getGroup() {
		return group;
	}

	public void setGroup(CategoryGroup group) {
		this.group = group;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public String getFullName() {
		if (group != null){
			return group.name +" : "+ name;
		} else {
			return fullName;
		}
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	
	public String getGroupName() {
		if (group != null){
			return group.name;
		} else {
			return groupName;
		}
	}
	
	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}
	
	
}
