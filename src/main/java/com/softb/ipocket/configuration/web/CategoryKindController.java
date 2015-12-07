package com.softb.ipocket.configuration.web;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.softb.ipocket.configuration.model.CategoryGroup;
import com.softb.ipocket.configuration.model.CategoryKind;
import com.softb.ipocket.configuration.repository.CategoryGroupRepository;
import com.softb.system.security.model.UserAccount;
import com.softb.system.security.service.UserAccountService;

@RestController("iPocketCategoryKindController")
@RequestMapping("/api/configuration/kind")
public class CategoryKindController {

	@Autowired
	private CategoryGroupRepository categoryGroupRepository;
	
	@Inject
	private UserAccountService userAccountService;
	
	@RequestMapping(method=RequestMethod.GET)
	public List<CategoryKind> listAll() {
		List<CategoryKind> kinds = new ArrayList<CategoryKind>();
		
		// Recupera o id do usuário logado para filtro dos dados.
		UserAccount user = userAccountService.getCurrentUser();
		Integer userId = user.getId();
		
		// Recupera os grupos de DESPESAS com suas categorias.
		List<CategoryGroup> expensesGroups = categoryGroupRepository.listAllByUserKind(userId, CategoryGroup.Kind.EXPENSE.getValue());
		kinds.add(new CategoryKind("Despesas", CategoryGroup.Kind.EXPENSE.getValue(), expensesGroups));
		
		// Recupera os grupos de ENTRADAS com suas categorias.
		List<CategoryGroup> incomeGroups = categoryGroupRepository.listAllByUserKind(userId, CategoryGroup.Kind.INCOME.getValue());
		kinds.add(new CategoryKind("Entradas", CategoryGroup.Kind.INCOME.getValue(), incomeGroups));
		
		// Recupera os grupos de INVESTIMENTOS com suas categorias.
		List<CategoryGroup> investGroups = categoryGroupRepository.listAllByUserKind(userId, CategoryGroup.Kind.INVESTIMENT.getValue());
		kinds.add(new CategoryKind("Investimentos", CategoryGroup.Kind.INVESTIMENT.getValue(), investGroups));
		
		
		return kinds;
	}
}
