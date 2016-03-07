package com.softb.ipocket.account.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.softb.ipocket.categorization.model.SubCategory;
import com.softb.system.repository.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
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
@JsonIgnoreProperties(ignoreUnknown = true)
public class AccountEntry extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "DATE")
	@NotNull
	protected Date date;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "SUBCATEGORY_ID", referencedColumnName = "ID")
    protected SubCategory subCategory;

	@Column(name = "AMOUNT")
	@NotNull
	protected Double amount;

	@Column(name = "TRANSFER")
	@NotNull
    @ColumnDefault( value="false" )
	protected Boolean transfer;

	@Column(name = "ACCOUNT_ID")
	@NotNull
	protected Integer accountId;

    @Column(name = "ACCOUNT_DESTINY_ID")
	protected Integer accountDestinyId;

	@Column(name = "TWIN_ENTRY_ID")
	protected Integer twinEntryId;

    @Column(name="USER_GROUP_ID")
	@NotNull
	protected Integer groupId;

    @Transient
    protected Double balance;

    @Override
    public AccountEntry clone() throws CloneNotSupportedException {
        return new AccountEntry( this.date,      this.subCategory, this.amount, this.transfer,
                                 this.accountId, this.accountDestinyId, this.twinEntryId, this.groupId,
                                 this.balance);
    }
}
