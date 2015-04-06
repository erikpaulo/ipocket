package com.softb.ipocket.configuration.web;

import java.util.List;

import javax.inject.Inject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.softb.ipocket.configuration.model.Category;
import com.softb.ipocket.configuration.repository.CategoryGroupRepository;
import com.softb.ipocket.configuration.repository.CategoryRepository;
import com.softb.system.errorhandler.exception.FormValidationError;
import com.softb.system.rest.AbstractRestController;
import com.softb.system.security.model.UserAccount;
import com.softb.system.security.service.UserAccountService;

@RestController("iPocketCategoryController")
@RequestMapping("/api/configuration/category")
public class CategoryController extends AbstractRestController<Category, Integer> {

	public static final String OBJECT_NAME = "Category";
	
	@Autowired
	private CategoryRepository categoryRepository;
	
	@Autowired
	private CategoryGroupRepository categoryGroupRepository;
	
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
	public Category create(@RequestBody Category json) throws FormValidationError {

		// Recupera o id do usuário logado para filtro dos dados.
		UserAccount user = userAccountService.getCurrentUser();
		json.setUserId(user.getId());
		json.getGroup().setUserId(user.getId());
		
		// Salva a categoria.
		Category category = categoryRepository.save(json);
		return category;
	}
	
//	@Transactional
//	@RequestMapping(value="/{categoryId}", method=RequestMethod.DELETE)
//	public @ResponseBody void delete(@RequestBody Integer categoryId) throws FormValidationError{
//		categoryRepository.delete(categoryId);
//		
////		// Remove o grupo caso não exista categoria associada
////		for (Category category : json){
////			List<Category> categories = categoryRepository.findByGroupUser(category.getGroup().getId(), category.getUserId());
////			if (categories != null && categories.size() == 0){
////				categoryGroupRepository.delete(category.getGroup().getId());
////			}
////		}
//	}
	
	@Override
	public String getEntityName() {
		return OBJECT_NAME;
	}
}
