package com.softb.system.security.web.resource;

import lombok.Getter;
import lombok.Setter;

import com.softb.system.security.model.UserSocialConnection;

@Getter
@Setter
public class SocialConnectionResource {
    private String displayName;
    
    private String profileUrl;
    
    private String imageUrl;
    
    public SocialConnectionResource(UserSocialConnection connection) {
        this.displayName = connection.getDisplayName();
        this.profileUrl = connection.getProfileUrl();
        this.imageUrl = connection.getImageUrl();
    }
}
