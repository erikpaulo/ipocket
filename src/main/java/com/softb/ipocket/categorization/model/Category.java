package com.softb.ipocket.categorization.model;

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

	public Category (String name, String type, Integer userId){
		this.name = name;
		this.type = Type.valueOf( type );
		this.subcategories = new ArrayList<SubCategory>(  );
		this.userId = userId;
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
	protected List<SubCategory> subcategories;

    @Column(name="USER_ID")
	@NotNull
	protected Integer userId;

	@Transient
	protected String fullName;

    public enum Type {
        EXP ( "Despesas" ), INC ( "Entradas" ), INV ( "Investimentos" );
        private String name;

        Type(String name) {
            this.name = name;
        }

        public String getName() {
            return this.name;
        }
    }
}
