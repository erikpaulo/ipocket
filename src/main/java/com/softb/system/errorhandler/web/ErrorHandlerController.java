package com.softb.system.errorhandler.web;

import com.softb.system.errorhandler.exception.BusinessException;
import com.softb.system.errorhandler.exception.EntityNotFoundException;
import com.softb.system.errorhandler.exception.FormValidationError;
import com.softb.system.errorhandler.web.resource.FormValidationErrorResource;
import com.softb.system.locale.LocaleContextHolderWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.annotation.Resource;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.*;

/**
 * Exceptions handler que captura as exception de negócio para transformar a exception em
 * JSON. Pode retornar dois formatos de json, dependendo do tipo:
 * -> Tipo = BusinessException
 *       {"timestamp":"26/04/2014","
 *         status":400,
 *         "exception":"com.softb.system.errorhandler.exception.BusinessException",
 *         "message":"Produto invalido"}
 * -> Tipo: EntityNotFoundException
 *       {"timestamp":"26/04/2014","
 *         status":404,
 *         "exception":"com.softb.system.errorhandler.exception.EntityNotFoundException",
 *         "message":"Animal de brinco 71 não pode ser alterado"}
 * -> Tipo: FormValidationError  
 *       {"timestamp":"26/04/2014",
 *        "status":400,
 *        "exception":"com.softb.system.errorhandler.exception.FormValidationError",
 *        "fieldErrors":[{"path":"nome","message":"The column cannot be empty."}]}
 * @author marcuslacerda
 *
 */
@ControllerAdvice
public class ErrorHandlerController {

    private static final Logger logger = LoggerFactory.getLogger(ErrorHandlerController.class);
	
    @Resource
    private LocaleContextHolderWrapper localeHolderWrapper;
    
    @Resource
    private MessageSource messageSource;
	
    @ExceptionHandler(FormValidationError.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleFormValidationError(FormValidationError validationError) {
        logger.debug("Handling form validation error");
        
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		map.put("timestamp", new Date());
		map.put("status", HttpStatus.BAD_REQUEST.value());
		map.put("exception", validationError.getClass().getName());
		map.put("type", "FormValidationError");
		
        Locale current = localeHolderWrapper.getCurrentLocale();

        List<FieldError> fieldErrors = validationError.getFieldErrors();

        FormValidationErrorResource dto = new FormValidationErrorResource();

        for (FieldError fieldError: fieldErrors) {
            String[] fieldErrorCodes = fieldError.getCodes();
            for (int index = 0; index < fieldErrorCodes.length; index++) {
                String fieldErrorCode = fieldErrorCodes[index];

            	String localizedError = messageSource.getMessage(fieldErrorCode, fieldError.getArguments(), fieldErrorCode, current);

                if (!StringUtils.isEmpty(localizedError) && !localizedError.equals(fieldErrorCode)) {
                    logger.debug("Adding error message: {} to field: {}", localizedError, fieldError.getField());
                    dto.addFieldError(fieldError.getField(), localizedError);
                    break;
                }
                else {
                	logger.debug(String.format("message %s not exists in resource file", fieldErrorCode));
                    if (isLastFieldErrorCode(index, fieldErrorCodes)) {
                        dto.addFieldError(fieldError.getField(), String.format("Erro de validacao %s.%s.%s", fieldErrorCode, fieldError.getObjectName(), fieldError.getField()));
                    }
                }                	
                

            }
        }
        
        map.put("fieldErrors", dto.getFieldErrors());

        return map;
    }

    private boolean isLastFieldErrorCode(int index, String[] fieldErrorCodes) {
        return index == fieldErrorCodes.length - 1;
    }
    
    @ExceptionHandler(BusinessException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleBusinessException(BusinessException ex) {
        logger.debug("handling 400 error on a todo entry");
        
        return extract(ex, HttpStatus.BAD_REQUEST.value(), false, false);
    }
    

    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, Object> handleNotFoundException(EntityNotFoundException ex) {
        logger.debug("handling 404 error on a todo entry");
        
        return extract(ex, HttpStatus.NOT_FOUND.value(), false, false);
    }
    
    @ExceptionHandler(Exception.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleException(Exception ex) {
        logger.debug("handling Exception.class");
        ex.printStackTrace();
        
        return extract(ex, HttpStatus.BAD_REQUEST.value(), false, false);
    }    
    
	public Map<String, Object> extract(Exception error, int status, boolean trace, boolean log) {
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		map.put("timestamp", new Date());
		map.put("status", status);
		try {
			if (error != null) {
				map.put("type", error.getClass().getSimpleName());
				map.put("exception", error.getClass().getName());
				map.put("message", error.getMessage());
				if (trace) {
					StringWriter stackTrace = new StringWriter();
					error.printStackTrace(new PrintWriter(stackTrace));
					stackTrace.flush();
					map.put("trace", stackTrace.toString());
				}
				if (log) {
					logger.debug(error.getMessage());
				}
			}
			else {
				map.put("message", "No message available");
			}
			return map;
		}
		catch (Exception ex) {
			map.put("error", ex.getClass().getName());
			map.put("message", ex.getMessage());
			return map;
		}    
	}
	
}
