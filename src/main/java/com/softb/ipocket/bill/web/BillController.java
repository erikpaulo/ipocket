package com.softb.ipocket.bill.web;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
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

import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.account.repository.AccountEntryRepository;
import com.softb.ipocket.account.web.AccountConstants;
import com.softb.ipocket.account.web.AccountController;
import com.softb.ipocket.bill.model.Bill;
import com.softb.ipocket.bill.model.BillEntry;
import com.softb.ipocket.bill.model.BillEvent;
import com.softb.ipocket.bill.model.CashFlowProjection;
import com.softb.ipocket.bill.repository.BillEntryRepository;
import com.softb.ipocket.bill.repository.BillRepository;
import com.softb.ipocket.bill.service.BillService;
import com.softb.ipocket.configuration.model.Category;
import com.softb.ipocket.configuration.web.CategoryController;
import com.softb.ipocket.general.model.Period;
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
	
	@Autowired
	private CategoryController categoryController;
	
	@Autowired
	private BillService billService;
	
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
		
		// Ordena as entradas da lista de lançamento de cada uma das contas.
		for(Bill bill: bills){
			Collections.sort(bill.getBillEntries(), new Comparator<BillEntry>() {
				@Override
				public int compare(BillEntry  entry1, BillEntry  entry2) {
					return entry1.getDate().compareTo(entry2.getDate());
				}
			});
		}
		
		return bills;
	}
	
	@RequestMapping(value = "/listAllAsEvents", method = RequestMethod.GET)
	public List<BillEvent> listAllAsEvents() {
		List<BillEvent> events = new ArrayList<BillEvent>();
		
		// Recupera todas as contas do usuário logado.
		List<Bill> bills =  billRepository.listAllByUser(userAccountService.getCurrentUser().getId());
		
		// Constre os objetos de evento de calendário.
		for (Bill bill: bills){
			for (BillEntry entry: bill.getBillEntries()){
				events.add(new BillEvent(bill.getCategory().getFullName(), entry.getDate(), entry.getAmount(), bill, entry));
			}
		}
		
		return events;
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.POST)
	public Bill saveBill(@RequestBody Bill bill) {
		
		// Salva as entradas.
		List<BillEntry> billEntries = billEntryRepository.save(bill.getBillEntries());
		
		// Salva o pagamento programado.
		bill = billRepository.save(bill);
		bill.setBillEntries(billEntries);

		return bill;
	}
	
	@RequestMapping(value = "/{billId}/entries/{id}", method = RequestMethod.POST)
	public Bill saveEntry(@RequestBody BillEntry entry) {
		billEntryRepository.save(entry);
		
		// Recupera o cabeçalho da conta.
		Bill bill = billRepository.findOne(entry.getBillId());
		
		return bill;
	}
	
	@Transactional
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
		
		// Recupera categoria associada.
		Category category = categoryController.get(bill.getCategory().getId());
		bill.setCategory(category);
		
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
	@RequestMapping(value = "/{billId}/entries/{id}/register", method = RequestMethod.POST)
	public Bill register(@RequestBody BillEntry entry) throws FormValidationError {
		
		// Remove o lançamento programado.
		billEntryRepository.delete(entry); 

		// Recupera o cabeçalho da conta.
		Bill bill = billRepository.findOne(entry.getBillId());
		
		// Verifica se possui conta destino, pois nesse caso se trata de uma transferência.
		String type = (bill.getDestinyAccountId() == null ? AccountConstants.TYPE_DIRECT : AccountConstants.TYPE_TRANSFER);
		
		// Cria o lançamento que será incluído.
		AccountEntry accountEntry = new AccountEntry(	bill.getAccountId(), bill.getDescription(), bill.getCategory(), 
														entry.getDate(), null, entry.getAmount(), null, 
												null,  type, bill.getDestinyAccountId(), false);
		accountController.createEntry(bill.getAccountId(), accountEntry);
		
		// Atualiza as entradas do pagamento.
		bill = updateEntries(bill);
		
		return bill;
	}

	@RequestMapping(value = "/{billId}/entries/{id}/skip", method = RequestMethod.POST)
	public Bill skip(@RequestBody BillEntry entry) throws FormValidationError {
		// Remove a entrada do lançamento.
		billEntryRepository.delete(entry);
		
		// Recupera o cabeçalho da conta.
		Bill bill = billRepository.findOne(entry.getBillId());
		
		// Verifica se ainda existem lançamentos na conta.
		if (bill.getBillEntries().isEmpty()){
			billRepository.delete(bill);
			bill = null;
		}
		
		return bill;
	}
	
	@RequestMapping(value = "/cashflowprojection", method = RequestMethod.POST)
	public CashFlowProjection getCashFlowProjection(@RequestBody Period period) throws FormValidationError {
		
		// Recupera as contas do usuário.
		List<Account> accounts =  accountController.listAll();
		
		// Recupera os pagamentos programados.
		List<Bill> bills = listAll();
		
		return billService.genCachFlowProjection(period.getStartDate(), period.getEndDate(), period.getGroupBy(), accounts, bills);
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

