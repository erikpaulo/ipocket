package com.softb.ipocket.account.model;

import com.softb.system.repository.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * Classe que representa as Contas bancárias do usuário
 * @author Erik Lacerda 
 *
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "ACCOUNT")
public class Account extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "NAME")
	@NotEmpty
	protected String name;

	@Column(name = "TYPE")
	@NotNull
	@Enumerated(EnumType.STRING)
	protected Type type;

	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "ACCOUNT_ID", referencedColumnName = "ID")
	protected List<AccountEntry> entries;

    @Column(name="CREATE_DATE")
    @NotNull
    protected Date createDate;

    @Column(name="ACTIVATED")
    @NotNull
    protected Boolean activated;

    @Column(name="USER_GROUP_ID")
	@NotNull
	protected Integer groupId;

    @Column(name="START_BALANCE")
    @NotNull
    protected Double startBalance;

    @Column(name="LAST_UPDATE")
    @NotNull
    protected Date lastUpdate;

	@Transient
    protected Double balance;

    public enum Type {
        CKA ( "Conta Corrente" ), SVA ( "Conta Poupança" ), INV ( "Conta Investimento" ), CCA ( "Cartão de Crédito" );
        private String name;

        Type(String name) {
            this.name = name;
        }

        public String getName() {
            return this.name;
        }
    }

}
