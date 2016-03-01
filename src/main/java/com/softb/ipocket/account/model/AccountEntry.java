package com.softb.ipocket.account.model;

import com.softb.system.repository.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;

/**
 * Classe que representa as entradas em uma conta de usuário.
 * @author Erik Lacerda
 *
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "ACCOUNT_ENTRY")
public class AccountEntry extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "DATE")
	@NotNull
	protected Date date;

//    @ManyToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name = "ACCOUNT_ID", referencedColumnName = "ID")
//    protected Account account;

	@Column(name = "AMOUNT")
	@NotNull
	protected Double amount;

	@Column(name = "ACCOUNT_ID")
	@NotNull
	protected Integer accountId;

    @Column(name="USER_ID")
	@NotNull
	protected Integer userId;

}
