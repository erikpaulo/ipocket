package com.softb.ipocket.categorization.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.softb.system.repository.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * Classe que representa as Sub Categorias de lançamentos
 * @author Erik Lacerda
 *
 */
@AllArgsConstructor
@NoArgsConstructor
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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CATEGORY_ID", referencedColumnName = "ID")
    @JsonBackReference
    protected Category category;

    @Column(name="USER_ID")
	@NotNull
	protected Integer userId;

    @Transient
    protected Integer categoryId;

	@Transient
	protected String fullName;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getActivated() {
        return activated;
    }

    public void setActivated(Boolean activated) {
        this.activated = activated;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public String getFullName() {
        return this.category.getName() +" : "+ this.name;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
