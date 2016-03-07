package com.softb.system.rest;

import com.softb.system.errorhandler.exception.FormValidationError;
import com.softb.system.security.model.UserAccount;
import com.softb.system.security.service.UserAccountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.Validator;

import javax.annotation.Resource;
import javax.inject.Inject;
import java.io.Serializable;

/**
 * Base controller to abstract base REST operations. If you need, you can extends <code>RESTBaseController</code> and
 * overhide these operations as you wish. 
 * <br>
 * Pattern:
 * GET 		/api/<module>/<entity>/:id			
 * GET 		/api/<module>/<entity>/
 * POST 	/api/<module>/<entity>/
 * PUT    	/api/<module>/<entity>/:id     
 * DELETE 	/api/<module>/<entity>/:id
  * 
 * 
 * @author marcuslacerda
 *
 * @param <T> - entity
 * @param <ID> - primary attribute of entity
 */
public abstract class AbstractRestController<T, ID extends Serializable> {

	protected final static Logger logger = LoggerFactory.getLogger(AbstractRestController.class);
    @Inject
    private UserAccountService userAccountService;
    @Resource
    private Validator validator;

//    public abstract JpaRepository<T, ID> getRepository();

//    @RequestMapping(value="/{id}", method=RequestMethod.GET)
//    public T get(@PathVariable ID id) {
//        return getRepository().findOne(id);
//    }

//    @RequestMapping(method=RequestMethod.GET)
//    public List<T> listAll() {
//        return getRepository().findAll();
//    }

//    @RequestMapping(method=RequestMethod.POST)
//    public @ResponseBody T create(@RequestBody T json) throws FormValidationError {
//    	logger.debug("create() with body {} of type {}", json, json.getClass());
//
//    	validate(getEntityName(), json);
//    	T created = getRepository().save(json);
//
//        return created;
//    }

//    public abstract String getEntityName();

//	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
//    public T update(@PathVariable("id") ID id, @RequestBody T json) {
//        logger.debug("update() of id#{} with body {}", id, json);
//        logger.debug("T json is of type {}", json.getClass());
//
//        // TODO - Valid if exists. If not, throw exception
//        // T entity = repository.findOne(id);
//
//        validate(getEntityName(), json);
//        T updated = getRepository().save(json);
//
//        return updated;
//    }

//    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
//    public @ResponseBody void delete(@PathVariable("id") ID id) {
//    	getRepository().delete(id);
//    }
    
//	@RequestMapping(value = "deleteAll", method = RequestMethod.DELETE)
//	public @ResponseBody void deleteAll() {
//		getRepository().deleteAll();
//	}
	
	
    protected void validate(String objectName, Object validated) throws FormValidationError {
    	logger.debug("Validating object: " + validated);

        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(validated, objectName);
        validator.validate(validated, bindingResult);

        if (bindingResult.hasErrors()) {
        	logger.debug("Validation errors found:" + bindingResult.getFieldErrors());
            throw new FormValidationError(bindingResult.getFieldErrors());
        }
    }

    protected Integer getGroupId() {
        UserAccount user = userAccountService.getCurrentUser ();
        return user.getGroupId ();
    }
}