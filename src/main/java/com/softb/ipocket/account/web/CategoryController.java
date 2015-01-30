package com.softb.ipocket.account.web;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.softb.ipocket.account.model.Category;
import com.softb.ipocket.account.repository.CategoryRepository;
import com.softb.system.errorhandler.exception.FormValidationError;
import com.softb.system.rest.AbstractRestController;
import com.softb.system.security.model.UserAccount;
import com.softb.system.security.service.UserAccountService;

@RestController("iPocketCategoryController")
@RequestMapping("/api/account/category")
public class CategoryController extends AbstractRestController<Category, Integer> {

	public static final String OBJECT_NAME = "Category";
	
	@Autowired
	private CategoryRepository categoryRepository;
	
	@Inject
	private UserAccountService userAccountService;
	

	@Override
	public CategoryRepository getRepository() {
		return categoryRepository;
	}

	@Override
	public List<Category> listAll() {
		
		// Recupera o id do usuário logado para filtro dos dados.
		UserAccount user = userAccountService.getCurrentUser();
		Integer userId = user.getId();
		
		// Recupera todas as categorias do usuário
		List<Category> categories =  categoryRepository.listAllByUser(userId);
		return categories;
	}

	@Override
	public String getEntityName() {
		return OBJECT_NAME;
	}

	@Override
	public Map<String, Object> create(@RequestBody Category json) throws FormValidationError {

		// Recupera o id do usuário logado para filtro dos dados.
		UserAccount user = userAccountService.getCurrentUser();
		json.setUserId(user.getId());
		
		// Verifica se uma operação de criação ou atualização deve ser acionada.
		Integer id = json.getId();
		return(id != null ? super.update(id, json) : super.create(json));
	}
	
	@RequestMapping(value="/deleteList", method=RequestMethod.POST)
	public @ResponseBody void delete(@RequestBody List<Category> json) throws FormValidationError{
		categoryRepository.delete(json);
	}
}
