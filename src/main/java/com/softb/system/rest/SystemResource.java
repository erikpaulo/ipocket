package com.softb.system.rest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Controller usado para acessar serviços public (não autenticados) do siste
 * 
 */
@Controller
@RequestMapping("/api/public")
public class SystemResource {

	@RequestMapping(value = "/ping", method = RequestMethod.GET)
	@ResponseBody
	public String hi() {
		return "pong";
	}
	
	@RequestMapping(value = "/oups", method = RequestMethod.GET)
	public String triggerException() {
		throw new RuntimeException(
				"Expected: controller used to showcase what "
						+ "happens when an exception is thrown");
	}

	@RequestMapping(value = "/error", method = RequestMethod.GET)
	public String error() {
		return "error";
	}

	@RequestMapping(value = "/exception", method = RequestMethod.GET)
	public String exception() {
		return "exception";
	}	

}
