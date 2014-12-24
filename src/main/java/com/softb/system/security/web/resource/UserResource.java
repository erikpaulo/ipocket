package com.softb.system.security.web.resource;

import lombok.Data;

import com.softb.system.security.model.UserAccount;

@Data
public class UserResource {
	private boolean authenticated;
	
	private String displayName;
	
	private String imageUrl;
	
	private boolean admin;

	public UserResource() {
		this.authenticated = false;
	}
	
	public UserResource(UserAccount account) {
		this.authenticated = true;
		this.displayName = account.getDisplayName();
		this.imageUrl = account.getImageUrl();
		this.admin = account.isAdmin();
	}
}
