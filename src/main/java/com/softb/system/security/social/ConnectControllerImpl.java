package com.softb.system.security.social;

import org.springframework.social.connect.ConnectionFactoryLocator;
import org.springframework.social.connect.ConnectionRepository;
import org.springframework.social.connect.web.ConnectController;

public class ConnectControllerImpl extends ConnectController {

	public ConnectControllerImpl(ConnectionFactoryLocator connectionFactoryLocator, ConnectionRepository connectionRepository) {
		super(connectionFactoryLocator, connectionRepository);
	}

	@Override
	protected String connectView(String providerId) {
		return "redirect:/#/account/NotConnect";
	}
	
	@Override
    protected String connectedView(String providerId) {
        return "redirect:/#/account/Connected";
    }
	
}
