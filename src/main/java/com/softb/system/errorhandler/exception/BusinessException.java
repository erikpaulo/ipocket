package com.softb.system.errorhandler.exception;

public class BusinessException extends RuntimeException {

	private static final long serialVersionUID = 1L;
	
	public BusinessException(String message) {
		super(message);
	}
	
	@Override
	public String toString() {
		return super.toString();
	}
	
}
