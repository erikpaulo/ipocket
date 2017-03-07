package com.softb.ipocket.categorization.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.softb.system.repository.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Classe que representa as Categorias de lançamentos
 * @author Erik Lacerda
 *
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "CATEGORY")
public class Category extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;

	public Category (String name, String type, Integer groupId){
		this.name = name;
		this.type = Type.valueOf( type );
		this.subcategories = new ArrayList<SubCategory>(  );
		this.groupId = groupId;
	}

	@Column(name = "NAME")
	@NotEmpty
	protected String name;

	@Column(name = "TYPE")
	@NotNull
	@Enumerated(EnumType.STRING)
	protected Type type;

	@OneToMany(fetch = FetchType.EAGER)
	@JoinColumn(name = "CATEGORY_ID", referencedColumnName = "ID")
	@JsonManagedReference
	protected List<SubCategory> subcategories;

    @Column(name="USER_GROUP_ID")
	@NotNull
	protected Integer groupId;

	@Transient
	protected String fullName;

    public enum Type {
        INC ( "Entradas" ), EXP ( "Despesas" ), INV ( "Investimentos" );
        private String name;
		private Boolean positive = true;

        Type(String name) {
			this.name = name;
			if (this.name.equalsIgnoreCase( "Despesas" )){
				this.positive = false;
			}
        }

        public String getName() {
            return this.name;
        }

        public Boolean isPositive() { return this.positive;}
    }
}
