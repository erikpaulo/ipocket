package com.softb.system.security.web.resource;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResource {
	private String email;
	private String password;
	private String googleTokenId;
	private Boolean rememberMe;
}
