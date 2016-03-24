package com.softb.ipocket.bill.service;


import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.bill.model.Bill;
import com.softb.ipocket.bill.web.resource.AccountCashFlowResource;
import com.softb.ipocket.bill.web.resource.CashFlowProjectionResource;
import com.softb.system.errorhandler.exception.BusinessException;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Map.Entry;

/**
 * Service for some rules related to bills.
 */
@Service
public class BillService {

	public static final String CASHFLOW_GROUP_DAY = "Day";

	/**
	 * This service generates the impact the bills does into the accounts. Calculating the cashflow.
	 * @param startDate The begining of the period to be considered
	 * @param endDate The end of the period to be considered
	 * @param groupBy Can be groups by Day
	 * @param accounts Accounts to be considered
	 * @param bills Bills that generates those impacts into the accounts
     * @return Cashflow
     */
	public CashFlowProjectionResource genCachFlowProjection(Date startDate, Date endDate, String groupBy, List<Account> accounts, List<Bill> bills) {
		HashMap<String, Double> labels = new HashMap<String, Double>();
		Map<String, Map<String, Double>> series = new HashMap<String, Map<String, Double>>();

		// Gera os labels com todos os dias contidos no período.
		Calendar date = Calendar.getInstance();
		date.setTime(startDate);

		// Generate the labels, grouped by day or month, as the choosen.
		while ( date.getTime().compareTo(endDate) <= 0 ){
			labels.put(getGroupId(date.getTime(), groupBy), 0.0);
			if ( groupBy.equalsIgnoreCase(CASHFLOW_GROUP_DAY) ){
				date.add(Calendar.DAY_OF_MONTH, 1);
			}
		}

		// Goes over the accounts, calculating its balance.
		for (Account account: accounts){
			// Atualiza a soma do agrupamento.
			doSum(series, labels, account.getName(), account.getCreateDate(), startDate, endDate, account.getStartBalance(), groupBy);
			for (AccountEntry entry: account.getEntries()){
				doSum(series, labels, account.getName(), entry.getDate(), startDate, endDate, entry.getAmount(), groupBy);
			}
		}

		// Goes over the bills entries, calculating the impact into the account cashflows.
		for (Bill bill: bills){
			String accountToName = (bill.getAccountTo() != null ? bill.getAccountTo().getName(): "");
			String accountFromName = (bill.getAccountFrom() != null ? bill.getAccountFrom().getName() : "");

            if (series.containsKey(accountToName)){
                doSum(series, labels, accountToName, bill.getDate(), startDate, endDate, bill.getAmount(), groupBy);
            }
            if (series.containsKey(accountFromName)){
                doSum(series, labels, accountFromName, bill.getDate(), startDate, endDate, bill.getAmount()*-1, groupBy);
            }
		}

		// Delete the no-value points
		if ( groupBy.equalsIgnoreCase(CASHFLOW_GROUP_DAY) ){
			List<String> labelsToDel = new ArrayList<>();
			Boolean found;

			for (Entry<String, Double> label: labels.entrySet()){
				found = false;

				for (Entry<String, Map<String, Double>> col: series.entrySet()){
					Double amount = col.getValue().get(label.getKey());
					if ( amount.compareTo(0.0) == 0 ){
						found = true;
					} else {
						found = false;
						break;
					}
				}

				if (found){
					labelsToDel.add(label.getKey());
				}

			}
			for (String labelName: labelsToDel){
				labels.remove(labelName);

				for (Entry<String, Map<String, Double>> col: series.entrySet()){
					col.getValue().remove(labelName);
				}
			}

		}

		// Sort
		List<String> labelNames = new ArrayList<>();
		labelNames.addAll(labels.keySet());
		Collections.sort(labelNames, new Comparator<String>() {
			@Override
			public int compare(String  date1, String  date2) {
				int compare;
				DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
				Date lDate;
				Date fDate;
				try {
					fDate = formatter.parse(date1);
					lDate = formatter.parse(date2);
					compare = fDate.compareTo(lDate);
				} catch (ParseException e) {
					throw new BusinessException( e.getMessage() );
				}
				return compare;
			}
		});

		// Generate accumulated projection
		CashFlowProjectionResource cashFlow = new CashFlowProjectionResource();
		for (Entry<String, Map<String, Double>> serie: series.entrySet()){
			AccountCashFlowResource accountCF = new AccountCashFlowResource(serie.getKey(), new ArrayList<Double>(  ));
//			accountCF.setName(serie.getKey());

			Double balance = 0.0;
			for (String labelName: labelNames){
				Double amount = serie.getValue().get(labelName);
				balance += amount;
				accountCF.getData().add(balance);
			}
			cashFlow.getSeries().add(accountCF);
		}
		cashFlow.setLabels(labelNames);

		return cashFlow;
	}

	private String getGroupId(Date source, String groupBy){
		DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		String groupName = "";

		// Agrupamento por dia.
		if (CASHFLOW_GROUP_DAY.equalsIgnoreCase(groupBy)){
			groupName = formatter.format(source);
		}

		return groupName;
	}

	// Realiza a soma do valor no mês correspondente.
	private void doSum(	Map<String, Map<String, Double>> series, HashMap<String, Double> labels, String serieName,
						Date date, 	Date start, Date end, Double amount, String groupBy) {

		if (!series.containsKey(serieName)){
			series.put(serieName, new HashMap<>(labels));
		}

		if ( date.compareTo(start) >= 0 && date.compareTo(end) <= 0 ){
			Double balance = series.get(serieName).get(getGroupId(date, groupBy));
			balance += amount;
			series.get(serieName).put(getGroupId(date, groupBy), balance);
		} else {
			if ( date.before(start) ){
				Double balance = series.get(serieName).get(getGroupId(start, groupBy));
				balance += amount;
				series.get(serieName).put(getGroupId(start, groupBy), balance);
			}
		}
	}
}