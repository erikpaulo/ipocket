package com.softb.system.rest;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.Validator;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.softb.system.errorhandler.exception.FormValidationError;

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
	
    public abstract JpaRepository<T, ID> getRepository();
    
    @Resource
    private Validator validator;

    @RequestMapping(value="/{id}", method=RequestMethod.GET)
    public T get(@PathVariable ID id) {
        return getRepository().findOne(id);
    }
    
    @RequestMapping(method=RequestMethod.GET)
    public List<T> listAll() {
        return getRepository().findAll();
    }

    @RequestMapping(method=RequestMethod.POST)
    public @ResponseBody Map<String, Object> create(@RequestBody T json) throws FormValidationError {
    	logger.debug("create() with body {} of type {}", json, json.getClass());

    	validate(getEntityName(), json);
    	
    	T created = getRepository().save(json);

        Map<String, Object> m = new HashMap<String, Object>();
        m.put("success", true);
        m.put("created", created);
        return m;
    }

    public abstract String getEntityName();

	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public Map<String, Object> update(@PathVariable("id") ID id, @RequestBody T json) {
        logger.debug("update() of id#{} with body {}", id, json);
        logger.debug("T json is of type {}", json.getClass());

        // TODO - Valid if exists. If not, throw exception
        // T entity = repository.findOne(id);
        
        validate(getEntityName(), json);
        
        T updated = getRepository().save(json);
        logger.debug("updated enitity: {}", updated);

        Map<String, Object> m = new HashMap<String, Object>();
        m.put("success", true);
        m.put("id", id);
        m.put("updated", updated);
        return m;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public @ResponseBody Map<String, Object> delete(@PathVariable("id") ID id) {
    	getRepository().delete(id);
        Map<String, Object> m = new HashMap<String, Object>();
        m.put("success", true);
        return m;
    }
    
	@RequestMapping(value = "deleteAll", method = RequestMethod.DELETE)
	public @ResponseBody void deleteAll() {
		getRepository().deleteAll();
	}    
	
	
    private void validate(String objectName, Object validated) throws FormValidationError {
    	logger.debug("Validating object: " + validated);

        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(validated, objectName);
        validator.validate(validated, bindingResult);

        if (bindingResult.hasErrors()) {
        	logger.debug("Validation errors found:" + bindingResult.getFieldErrors());
            throw new FormValidationError(bindingResult.getFieldErrors());
        }
    }
}