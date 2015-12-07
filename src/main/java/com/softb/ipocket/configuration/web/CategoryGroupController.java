package com.softb.ipocket.configuration.web;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.softb.ipocket.configuration.model.Category;
import com.softb.ipocket.configuration.model.CategoryGroup;
import com.softb.ipocket.configuration.repository.CategoryGroupRepository;
import com.softb.ipocket.configuration.repository.CategoryRepository;
import com.softb.system.errorhandler.exception.FormValidationError;
import com.softb.system.rest.AbstractRestController;
import com.softb.system.security.model.UserAccount;
import com.softb.system.security.service.UserAccountService;

@RestController("iPocketCategoryGroupController")
@RequestMapping("/api/configuration/categorygroup")
public class CategoryGroupController extends AbstractRestController<CategoryGroup, Integer> {

	public static final String OBJECT_NAME = "CategoryGroup";
	
	@Autowired
	private CategoryRepository categoryRepository;
	
	@Autowired
	private CategoryGroupRepository categoryGroupRepository;
	
	@Inject
	private UserAccountService userAccountService;
	

	public CategoryGroupRepository getRepository() {
		return categoryGroupRepository;
	}

	@Override
	public List<CategoryGroup> listAll() {
		
		// Recupera o id do usuário logado para filtro dos dados.
		UserAccount user = userAccountService.getCurrentUser();
		Integer userId = user.getId();
		
		// Recupera os grupos com suas categorias.
		List<CategoryGroup> groups = categoryGroupRepository.listAllByUser(userId);
		
		return groups;
	}

	@Override
	public CategoryGroup create(@RequestBody CategoryGroup json) throws FormValidationError {
		
		// Recupera o id do usuário logado para filtro dos dados.
		UserAccount user = userAccountService.getCurrentUser();
		Integer userId = user.getId();
		
		json.setUserId(userId);
		json.setCategories(null);

		CategoryGroup group = null;
		if (json.getId() != null){
			group = super.update(json.getId(), json);
		} else {
			group = super.create(json);
			group.setCategories(new ArrayList<Category>());
		}
		return group;
	}
	
	

	@Override
	public CategoryGroup update(@PathVariable Integer id, @RequestBody CategoryGroup json) {
		// Recupera o id do usuário logado para filtro dos dados.
		UserAccount user = userAccountService.getCurrentUser();
		Integer userId = user.getId();
		
		// TODO Auto-generated method stub
		return super.update(id, json);
	}

	@Override
	public void delete(@PathVariable Integer id) {
		
		// Tenta remover as categorias do grupo.
		CategoryGroup group = categoryGroupRepository.getOne(id);
		for (Category category: group.getCategories()){
			categoryRepository.delete(category);
		}
		
		super.delete(id);
	}

	@Override
	public String getEntityName() {
		return OBJECT_NAME;
	}
	

}
