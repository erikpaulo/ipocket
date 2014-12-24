package com.softb.system.security.web.resource;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.softb.system.security.model.UserAccount;
import com.softb.system.security.model.UserSocialConnection;

@Getter
@Setter
public class UserAccountResource {
    private String userId;

    private String webSite;

    private boolean admin;

    private String email;
    
    private String displayName;    
    
    private String imageUrl;    
    
    private Map<String, Boolean> roles;
    
    private boolean accountLocked;
    
    private boolean trustedAccount;

    private Map<String, SocialConnectionResource> socialConnections;

    public UserAccountResource() {}
    
    public UserAccountResource(UserAccount userAccount) {
        this(userAccount, false);
    }
    
    public UserAccountResource(UserAccount userAccount, boolean admin) {
        this.userId = userAccount.getUserId();
        this.displayName = userAccount.getDisplayName();
        this.imageUrl = userAccount.getImageUrl();
        this.webSite = userAccount.getWebSite();
        this.admin = userAccount.isAdmin();
        if (admin) {
            this.trustedAccount = userAccount.isTrustedAccount();
            this.accountLocked = userAccount.isAccountLocked();
            this.email = userAccount.getEmail();
        }
    }

    public void setSocialConnections(List<UserSocialConnection> connections) {
        if (connections != null) {
            this.socialConnections = new HashMap<String, SocialConnectionResource>();
            for (UserSocialConnection connection : connections) {
                this.socialConnections.put(connection.getProviderId(), new SocialConnectionResource(connection));
            }
        }
    }
    
    public static UserAccountResource transferForAccountOverview(UserAccount userAccount, 
            List<UserSocialConnection> connections) {
        UserAccountResource userAccountDto = new UserAccountResource(userAccount);
        userAccountDto.setTrustedAccount(userAccount.isTrustedAccount());
        userAccountDto.setAccountLocked(userAccount.isAccountLocked());
        userAccountDto.setEmail(userAccount.getEmail());
        
        userAccountDto.setRoles(createRoleMap(userAccount));
        
        userAccountDto.setSocialConnections(connections);
        return userAccountDto;
    }
 
    public static UserAccountResource transferForProfileUpdate(UserAccount userAccount) {
        UserAccountResource userAccountDto = new UserAccountResource(userAccount);
        userAccountDto.setEmail(userAccount.getEmail());
        return userAccountDto;
    }
    
    public static UserAccountResource transferFor(UserAccount userAccount) {
        UserAccountResource userAccountDto = new UserAccountResource(userAccount);
        userAccountDto.setEmail(userAccount.getEmail());
        return userAccountDto;
    }
    
	private static Map<String, Boolean> createRoleMap(UserDetails userDetails) {

		Map<String, Boolean> roles = new HashMap<String, Boolean>();
		for (GrantedAuthority authority : userDetails.getAuthorities()) {
			roles.put(authority.getAuthority(), Boolean.TRUE);
		}

		return roles;
	}    

}

