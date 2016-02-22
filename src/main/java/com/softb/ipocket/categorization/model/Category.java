package com.softb.ipocket.categorization.model;

import com.softb.system.repository.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

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
	
	@Column(name = "NAME")
	@NotEmpty
	protected String name;

	@Column(name = "TYPE")
	@NotEmpty
	protected String type;

//	@JsonBackReference
//	@ManyToOne(fetch = FetchType.EAGER)
//	@JoinColumn(name = "GROUP_ID", referencedColumnName = "ID")
//	@NotNull
//	protected CategoryGroup group;

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
