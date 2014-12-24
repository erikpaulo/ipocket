package com.softb.system.errorhandler.web.resource;

import java.util.ArrayList;
import java.util.List;

public class FormValidationErrorResource {

    private List<FieldValidationErrorResource> fieldErrors = new ArrayList<FieldValidationErrorResource>();

    public FormValidationErrorResource() {

    }

    public void addFieldError(String path, String message) {
        FieldValidationErrorResource fieldError = new FieldValidationErrorResource(path, message);
        fieldErrors.add(fieldError);
    }

    public List<FieldValidationErrorResource> getFieldErrors() {
        return fieldErrors;
    }
}
