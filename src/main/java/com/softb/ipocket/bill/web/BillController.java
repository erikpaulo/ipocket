package com.softb.ipocket.bill.web;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.lang.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.account.model.Category;
import com.softb.ipocket.account.repository.AccountEntryRepository;
import com.softb.ipocket.bill.model.Bill;
import com.softb.ipocket.bill.model.BillEntry;
import com.softb.ipocket.bill.repository.BillEntryRepository;
import com.softb.ipocket.bill.repository.BillRepository;
import com.softb.system.errorhandler.exception.FormValidationError;
import com.softb.system.rest.AbstractRestController;
import com.softb.system.security.service.UserAccountService;

@RestController("iPocketBillController")
@RequestMapping("/api/bill")
public class BillController extends AbstractRestController<Bill, Integer> {

	public static final String OBJECT_NAME = "Bill";
	
	@Autowired
	private BillRepository billRepository;
	
	@Autowired
	private BillEntryRepository billEntryRepository;
	
	@Autowired
	private AccountEntryRepository accountEntryRepository;
	
	@Override
	public BillRepository getRepository() {
		return billRepository;
	}
	
	@Inject
	private UserAccountService userAccountService;
	

	@Override
	public List<Bill> listAll() {
		
		// Recupera todas as contas do usuário logado.
		List<Bill> bills =  billRepository.listAllByUser(userAccountService.getCurrentUser().getId());
		return bills;
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.POST)
	public Bill save(@RequestBody Bill bill) {
//		Map<String, Object> map = new HashMap<String, Object>();
		
		// Salva as entradas.
		List<BillEntry> billEntries = billEntryRepository.save(bill.getBillEntries());
		
		// Salva o lançamento programado.
		bill = billRepository.save(bill);
		bill.setBillEntries(billEntries);

//		map.put("success", true);
//		map.put("object", bill);
		
		return bill;
	}



	public Bill create(@RequestBody Bill bill) throws FormValidationError {
		List<BillEntry> entriesToSave = new ArrayList<BillEntry>();
		
		// Define o usuário.
		bill.setUserId(userAccountService.getCurrentUser().getId());
		
		// Recupera o valor das entradas
		Double amount = (bill.getCalcType().equalsIgnoreCase("F") ? bill.getAmount() : getAccountEntryAmountAverage(bill.getCategory(), bill.getAverageCount()));
		
		// Recupera a data da primeira entrada.
		Date date = bill.getDate();
		
		// Grava o lançamento programado.
		bill = billRepository.save(bill);
		
		// Cria as entradas recorrentes
		for (int i=0;i<bill.getTimes();i++){
			BillEntry billEntry = new BillEntry(date, amount, bill.getId());
			entriesToSave.add(billEntry);
			
			date = DateUtils.addMonths(date, 1);
		}
		entriesToSave = billEntryRepository.save(entriesToSave);
		bill.setBillEntries(entriesToSave);
		
//		Map<String, Object> map = new HashMap<String, Object>();
//		map.put("success", true);
//		map.put("object", bill);
		
		return bill;
	}


	/**
	 * Recupera a média dos 'count' ultimos itens lançados com a categoria informada.
	 * @param category
	 * @param averageCount
	 * @return
	 */
	private Double getAccountEntryAmountAverage(Category category,	Integer count) {
		Double sum = 0.0;
		Integer divisor = 0;
		
		// Recupera os lançamentos já realizados pelo usuário para a categoria informada.
		List<AccountEntry> entries = accountEntryRepository.listByUserCategory(userAccountService.getCurrentUser().getId(), category.getId());
		
		// Itera pelos lançamentos
		Iterator<AccountEntry> i = entries.iterator();
		while(i.hasNext() && divisor++ <= count){
			AccountEntry entry = i.next();
			sum += entry.getAmount();
		}
		
		return (divisor>0 ? sum/divisor : 0);
	}

	@Override
	public String getEntityName() {
		return OBJECT_NAME;
	}
}

