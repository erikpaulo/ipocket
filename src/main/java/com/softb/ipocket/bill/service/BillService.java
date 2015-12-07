package com.softb.ipocket.bill.service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.stereotype.Service;

import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.bill.model.AccountCashFlow;
import com.softb.ipocket.bill.model.Bill;
import com.softb.ipocket.bill.model.BillEntry;
import com.softb.ipocket.bill.model.CashFlowProjection;

@Service
public class BillService {
	
	public CashFlowProjection genCachFlowProjection(Date startDate, Date endDate, String groupBy, List<Account> accounts, List<Bill> bills) {
		HashMap<String, Double> labels = new HashMap<String, Double>();
		Map<String, Map<String, Double>> series = new HashMap<String, Map<String, Double>>();
		
		// Filtra somente as contas do tipo conta corrente.
		Iterator<Account> i = accounts.iterator();
		while (i.hasNext()){
			Account account = i.next();
			if (!account.getType().equalsIgnoreCase("CH")){
				i.remove();
			}
		}
		
		// Gera os labels com todos os dias contidos no período.
		Calendar date = Calendar.getInstance();
		date.setTime(startDate);
		
		while ( date.getTime().compareTo(endDate) <= 0 ){
			labels.put(getGroupId(date.getTime(), groupBy), 0.0);
			if ( groupBy.equalsIgnoreCase("Day") ){
				date.add(Calendar.DAY_OF_MONTH, 1);
			}
		}
		
		// Itera pelas contas e de acordo com a periodicidade, define o saldo total dessas contas nesses períodos.
		for (Account account: accounts){
			// Atualiza a soma do agrupamento.
			doSum(series, labels, account.getName(), account.getCreateDate(), startDate, endDate, account.getStartBalance(), groupBy);
			for (AccountEntry entry: account.getEntries()){
				doSum(series, labels, account.getName(), entry.getDate(), startDate, endDate, entry.getAmount(), groupBy);
			}
		}
		
		// Itera pelos lançamentos programados fazendo projeção do fluxo de caixa.
		for (Bill bill: bills){
			String accountName = "";
			String destinyAccountName = "";
			
			// Recupera o nome da conta associada ao lançameto programado.
			for (Account account: accounts){
				if (account.getId() == bill.getAccountId()){
					accountName = account.getName();
				}
				if (account.getId() == bill.getDestinyAccountId()){
					destinyAccountName = account.getName();
				}
			}
			
			for (BillEntry entry: bill.getBillEntries()){
				if (series.containsKey(accountName)){
					doSum(series, labels, accountName, entry.getDate(), startDate, endDate, entry.getAmount(), groupBy);
				}
				if (series.containsKey(destinyAccountName)){
					doSum(series, labels, destinyAccountName, entry.getDate(), startDate, endDate, entry.getAmount(), groupBy);
				}
			}
		}
		
		// Elimina os pontos sem valor
		if ( groupBy.equalsIgnoreCase("Day") ){
			List<String> labelsToDel = new ArrayList<String>();
			Boolean found = null;
			
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

		
		// Ordena de acordo com o agrupamento.
		List<String> labelNames = new ArrayList<String>();
		labelNames.addAll(labels.keySet());
		Collections.sort(labelNames, new Comparator<String>() {
	        @Override
	        public int compare(String  date1, String  date2) {
	        	int compare = 0;
	        	DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
	        	Date lDate;
	        	Date fDate;
				try {
					fDate = formatter.parse(date1);
					lDate = formatter.parse(date2);
					compare = fDate.compareTo(lDate);
				} catch (ParseException e) {
					e.printStackTrace();
				}
	            return compare;
	        }
	    });
		
		// Coloca os resultados em formato de Lista gerando projeção acumulada.
		CashFlowProjection cashFlow = new CashFlowProjection();
		Double balance = 0.0;
		for (Entry<String, Map<String, Double>> serie: series.entrySet()){
			AccountCashFlow accountCF = new AccountCashFlow();
			accountCF.setName(serie.getKey());

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
//		List<String> monthNames = Arrays.asList("Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez");
		
		// Agrupamento por dia.
		if ("Day".equalsIgnoreCase(groupBy)){
			groupName = formatter.format(source);
		}
		
		return groupName;
	}
	
	// Realiza a soma do valor no mês correspondente.
	private void doSum(	Map<String, Map<String, Double>> series, HashMap<String, Double> labels, String serieName, 
						Date date, Date start, Date end, Double amount, String groupBy) {

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
