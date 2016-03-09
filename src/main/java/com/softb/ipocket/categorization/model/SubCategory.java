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
    @Enumerated(EnumType.STRING)
	protected Type type;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CATEGORY_ID", referencedColumnName = "ID")
    @JsonBackReference
    protected Category category;

    @Column(name="USER_GROUP_ID")
	@NotNull
	protected Integer groupId;

    @Transient
    protected Integer categoryId;

	@Transient
	protected String fullName;

    public enum Type {
        FC ( "Despesa Mensal Fixa" ), IC ( "Despesa Irregular" ), VC ( "Despesa Mensal Variável" );
        private String name;

        Type(String name) {
            this.name = name;
        }

        public String getName() {
            return this.name;
        }
    }

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

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
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

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }
}
