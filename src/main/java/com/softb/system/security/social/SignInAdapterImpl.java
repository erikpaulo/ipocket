package com.softb.system.security.social;

import org.springframework.social.connect.Connection;
import org.springframework.web.context.request.NativeWebRequest;


public class SignInAdapterImpl implements org.springframework.social.connect.web.SignInAdapter {

	@Override
	public String signIn(String userId, Connection<?> connection, NativeWebRequest request) {
		return null;
	}

}
