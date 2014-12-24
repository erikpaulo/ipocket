package com.softb.system.errorhandler.exception;

import java.util.List;

import org.springframework.validation.FieldError;

public class FormValidationError extends RuntimeException {

	private static final long serialVersionUID = 1L;
	
	private List<FieldError> fieldErrors;

    public FormValidationError(List<FieldError> fieldErrors) {
        this.fieldErrors = fieldErrors;
    }

    public List<FieldError> getFieldErrors() {
        return fieldErrors;
    }
}
