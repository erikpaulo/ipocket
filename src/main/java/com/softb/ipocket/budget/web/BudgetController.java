package com.softb.ipocket.budget.web;

import java.util.List;

import javax.inject.Inject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.softb.ipocket.budget.model.Budget;
import com.softb.ipocket.budget.model.BudgetEntry;
import com.softb.ipocket.budget.model.BudgetEntryGroup;
import com.softb.ipocket.budget.repository.BudgetEntryGroupRepository;
import com.softb.ipocket.budget.repository.BudgetEntryRepository;
import com.softb.ipocket.budget.repository.BudgetRepository;
import com.softb.system.errorhandler.exception.FormValidationError;
import com.softb.system.rest.AbstractRestController;
import com.softb.system.security.service.UserAccountService;

@RestController("iPocketBudgetController")
@RequestMapping("/api/budget")
public class BudgetController extends AbstractRestController<Budget, Integer> {

	public static final String OBJECT_NAME = "Budget";
	
	@Autowired
	private BudgetRepository budgetRepository;
	
	@Autowired
	private BudgetEntryGroupRepository budgetEntryGroupRepository;
	
	@Autowired
	private BudgetEntryRepository budgetEntryRepository;
	
	
	@Override
	public BudgetRepository getRepository() {
		return budgetRepository;
	}
	
	@Inject
	private UserAccountService userAccountService;
	
	
	
	@Override
	public Budget get(@PathVariable Integer id) {
		Integer userId = userAccountService.getCurrentUser().getId();
		Budget budget = budgetRepository.getOneByUser(id, userId);
		return budget;
	}


	@Override
	@Transactional(readOnly = false)
	public Budget create(@RequestBody Budget budget) throws FormValidationError {
		Integer userId = userAccountService.getCurrentUser().getId();
		
		// Grava a entidade raiz do orçamento.
		List<BudgetEntryGroup> budgetGroups = budget.getEntryGroups();
		budget.setEntryGroups(null); // Feito para evitar gravação em cascata do hibernate.
		budget.setUserId(userId);
		budget = budgetRepository.save(budget);
		
		// Salva as entidades filhas
		for (int i=0;i<budgetGroups.size();i++){
			BudgetEntryGroup group = budgetGroups.get(i);
			
			// Complementa os dados do grupo de entradas do orçamento e grava.
			group.setUserId(userId);
			group.setBudgetId(budget.getId());
			List<BudgetEntry> entries = group.getEntries();
			group.setEntries(null);
			group = budgetEntryGroupRepository.save(group);
			
			// Complementa os dados das entradas do orçamento e grava.
			for(int r=0;r<entries.size();r++){
				BudgetEntry entry = entries.get(r); 
				entry.setUserId(userId);
				entry.setGroupId(group.getId());
			}
			group.setEntries(budgetEntryRepository.save(entries));
			
		}
		budget.setEntryGroups(budgetGroups);
		
		return budget;
	}

	

	@RequestMapping(value = "/{id}", method = RequestMethod.POST)
	@Transactional(readOnly = false)
	public Budget update(@PathVariable Integer id, @RequestBody Budget budget) {
		Integer userId = userAccountService.getCurrentUser().getId();
		
		// Usuário logado.
		budget.setUserId(userId);
		
		// Salva as entidades filhas
		for (int i=0;i<budget.getEntryGroups().size();i++){
			BudgetEntryGroup group = budget.getEntryGroups().get(i);
			
			// Salva
			budgetEntryRepository.save(group.getEntries());
			group = budgetEntryGroupRepository.save(group);
			
			// Salva
			budget = budgetRepository.save(budget);
		}
		
		return budget;
	}


	@Override
	public String getEntityName() {
		return OBJECT_NAME;
	}
}

