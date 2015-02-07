package com.softb.ipocket.bill.web;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.inject.Inject;

import org.apache.commons.lang.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.account.model.Category;
import com.softb.ipocket.account.repository.AccountEntryRepository;
import com.softb.ipocket.account.web.AccountConstants;
import com.softb.ipocket.account.web.AccountController;
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
	
	@Autowired
	private AccountController accountController;
	
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
		
		// Salva as entradas.
		List<BillEntry> billEntries = billEntryRepository.save(bill.getBillEntries());
		
		// Salva o pagamento programado.
		bill = billRepository.save(bill);
		bill.setBillEntries(billEntries);

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
		
		return bill;
	}

	@Transactional
	@RequestMapping(value = "/{id}/register", method = RequestMethod.POST)
	public Bill register(@RequestBody Bill bill) throws FormValidationError {
		validate(getEntityName(), bill);
		BillEntry entryToDelete = bill.getBillEntries().get(0);
		
		// Cria o lançamento que será incluído.
		AccountEntry entry = new AccountEntry(	bill.getAccount().getId(), bill.getDescription(), bill.getCategory(), 
												entryToDelete.getDate(), null, entryToDelete.getAmount(), null, 
												null, AccountConstants.TYPE_DIRECT, null);
		accountController.createEntry(bill.getAccount().getId(), entry);
		
		// Remove esta entrada dos lançamentos programados.
		billEntryRepository.delete(entryToDelete); 
		bill.getBillEntries().remove(0);
		
		// Atualiza as entradas do pagamento.
		bill = updateEntries(bill);
		
		return bill;
	}

	
	@RequestMapping(value = "/{id}/skip", method = RequestMethod.POST)
	public Bill skip(@RequestBody Bill bill) throws FormValidationError {
		
		billEntryRepository.delete(bill.getBillEntries().get(0));
		bill.getBillEntries().remove(0);
		return updateEntries(bill);
	}
	
	/**
	 * Atualiza os valores das entradas da conta.
	 * @param bill
	 * @return
	 */
	private Bill updateEntries(Bill bill) {
		if (bill.getBillEntries().size() > 0){
			
			// Atualiza o valor das entradas se o tipo da conta é média dos ultimos lançamentos.
			if (bill.getCalcType().equalsIgnoreCase("A")){
				Double amount = getAccountEntryAmountAverage(bill.getCategory(), bill.getAverageCount());
				for (BillEntry entryToUpdate: bill.getBillEntries()){
					entryToUpdate.setAmount(amount);
				}
				billEntryRepository.save(bill.getBillEntries());
			}
		} else {
			// Remove a conta do sistema.
			billRepository.delete(bill);
		}
		
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

