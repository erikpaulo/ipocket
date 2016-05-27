package com.softb.ipocket.bill.model;

import com.softb.ipocket.account.model.Account;
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
 * Classe que representa o baselinde planejado para os pagamentos
 * @author Erik Lacerda
 *
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "BILL_BASELINE")
public class Baseline extends BaseEntity<Integer> implements Serializable {

	private static final long serialVersionUID = 1L;
	@Column(name = "DATE")
	@NotNull
	protected Date date;

	@Column(name = "AMOUNT")
	@NotNull
	protected Double amount;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "SUBCATEGORY_ID", referencedColumnName = "ID")
	protected SubCategory subCategory;

	@Column(name = "TRANSFER")
	@ColumnDefault( value="false" )
	protected Boolean transfer;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "ACCOUNT_TO_ID", referencedColumnName = "ID")
    @NotNull
	protected Account accountTo;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "ACCOUNT_FROM_ID", referencedColumnName = "ID")
	protected Account accountFrom;

    @Column(name="USER_GROUP_ID")
    @NotNull
    protected Integer groupId;

}
