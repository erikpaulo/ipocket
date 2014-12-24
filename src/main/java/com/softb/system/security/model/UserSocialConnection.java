package com.softb.system.security.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import com.softb.system.repository.BaseEntity;

/**
 * Domain Entity for user social connection.
 * 
 */
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude={"rank", "imageUrl", "accessToken", "secret", "refreshToken"})
@Entity(name = "USER_SOCIAL_CONNECTION")
public class UserSocialConnection extends BaseEntity<Integer> implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	@Column
	private String userId;
	
	@Column
    private String providerId;
	
	@Column
    private String providerUserId;
	
	@Column
    private int rank;
	
	@Column
    private String displayName;
	
	@Column
    private String profileUrl;
	
	@Column
    private String imageUrl;
	
	@Column
    private String accessToken;
	
	@Column
    private String secret;
	
	@Column
    private String refreshToken;
	
	@Column
    private Long expireTime;

    public UserSocialConnection(String userId, String providerId, String providerUserId, int rank,
            String displayName, String profileUrl, String imageUrl, String accessToken, String secret,
            String refreshToken, Long expireTime) {
        super();
        this.userId = userId;
        this.providerId = providerId;
        this.providerUserId = providerUserId;
        this.rank = rank;
        this.displayName = displayName;
        this.profileUrl = profileUrl;
        this.imageUrl = imageUrl;
        this.accessToken = accessToken;
        this.secret = secret;
        this.refreshToken = refreshToken;
        this.expireTime = expireTime;
    }

}
