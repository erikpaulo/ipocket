package com.softb.ipocket.categorization.web;

import com.softb.ipocket.categorization.model.Category;
import com.softb.ipocket.categorization.repository.CategoryRepository;
import com.softb.ipocket.categorization.web.resource.CategoryGroupResource;
import com.softb.system.errorhandler.exception.FormValidationError;
import com.softb.system.rest.AbstractRestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.*;

@RestController("AppCategoryController")
@RequestMapping("/api/categorization/")
public class CategoryController extends AbstractRestController<Category, Integer> {

	public static final String OBJECT_NAME = "Category";
	
	@Autowired
	private CategoryRepository categoryRepository;
	
	@Override
	public CategoryRepository getRepository() {
		return categoryRepository;
	}

    /**
     * This URL lists all categories created by the current user. This categories are grouped into
     * groups that represents the category type, i.e.: expenses, incomes and investiments.
     *
     * @return List
     */
    @RequestMapping(method = RequestMethod.GET)
    public List<CategoryGroupResource> listAll() {
        List<CategoryGroupResource> groups = new ArrayList<CategoryGroupResource> ();
        Map<String, ArrayList<Category>> map = new HashMap<String, ArrayList<Category>> ();

        // Gets all categories of the logged user, grouping by category types
        List<Category> categories = categoryRepository.listAllByUser ( getUserId () );

        Iterator<Category> c = categories.iterator ();
        while (c.hasNext ()) {
            Category category = c.next ();
            if (!map.containsKey ( category.getType () )) {
                map.put ( category.getType (), new ArrayList<Category> () );
            }
            map.get ( category.getType () ).add ( category );
        }

        Iterator<Category.Type> k = new ArrayList<> ( Arrays.asList ( Category.Type.values () ) ).iterator ();
        while (k.hasNext ()) {
            Category.Type key = k.next ();

            CategoryGroupResource group = new CategoryGroupResource ( key, key.getName () );
            groups.add ( group );
        }

        return groups;
    }

	@Override
	public Category create(@RequestBody Category json) throws FormValidationError {

		// Recupera o id do usuário logado para filtro dos dados.
//		UserAccount user = userAccountService.getCurrentUser();
//		json.setUserId(user.getId());
//		json.getGroup().setUserId(user.getId());

        // Salva a categoria.
		Category category = categoryRepository.save(json);
		return category;
	}
	
	
	
	@Override
	@Transactional
	public Category update(@PathVariable Integer id, @RequestBody Category json) {
		
		// Recupera o id do usuário logado para filtro dos dados.
//		UserAccount user = userAccountService.getCurrentUser();
//		json.setUserId(user.getId());
//		json.getGroup().setUserId(user.getId());

        // Salva a categoria.
		Category category = categoryRepository.save(json);
		return category;
	}

	@Transactional
	@RequestMapping(value="/{id}", method=RequestMethod.DELETE)
	public @ResponseBody void delete(@PathVariable Integer id) throws FormValidationError{
		categoryRepository.delete(id);
		
//		// Remove o grupo caso não exista categoria associada
//		for (Category categorization : json){
//			List<Category> categories = categoryRepository.findByGroupUser(categorization.getGroup().getId(), categorization.getUserId());
//			if (categories != null && categories.size() == 0){
//				categoryGroupRepository.delete(categorization.getGroup().getId());
//			}
//		}
	}
	
	@Override
	public String getEntityName() {
		return OBJECT_NAME;
	}
}
