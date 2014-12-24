package com.softb.system.security.web.resource;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResource {
	private String email;
	private String password;
	private String displayName;
}
