package com.softb.system.errorhandler.web.resource;

public class FieldValidationErrorResource {

    private String path;
    private String message;

    public FieldValidationErrorResource(String path, String message) {
        this.path = path;
        this.message = message;
    }

    public String getPath() {
        return path;
    }

    public String getMessage() {
        return message;
    }
}
