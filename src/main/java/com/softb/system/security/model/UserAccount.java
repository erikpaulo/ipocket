package com.softb.system.security.model;

import com.softb.system.repository.BaseEntity;
import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.social.security.SocialUserDetails;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;


/**
 * Domain Entity for user account.
 * 
 */
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Entity
@Table(name = "USER_ACCOUNT")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class UserAccount extends BaseEntity<Integer> implements SocialUserDetails {
    
	private static final long serialVersionUID = 1L;

	@Column(length = 64, nullable = true)
	private String password;	

	@Email
	@Column(unique=true)
    private String email;
    
	@Column
	@NotEmpty
	@Length(max=20)
    private String displayName;
    
	@Column
    private String imageUrl;
    
	@Column
    private String webSite;

	@NotNull
	@Column
    private boolean accountLocked;
    
	@Column
	@NotNull
    private boolean trustedAccount;

    @Column
    @NotEmpty
    private String googleId;

    @Column
    @NotEmpty
    private Integer groupId;
    
	@ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name="user_role",joinColumns={@JoinColumn(name="user_id")})
    @Column(name="role") 
	private Set<String> roles = new HashSet<String>();

	@Override
	public Collection<GrantedAuthority> getAuthorities() {

		Set<String> roles = getRoles();

		if (roles == null) {
			return Collections.emptyList();
		}

		Set<GrantedAuthority> authorities = new HashSet<GrantedAuthority>();
		for (String role : roles) {
			authorities.add(new SimpleGrantedAuthority(role));
		}

		return authorities;
	}    
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !accountLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String getUsername() {
        return this.email;
    }
    
	@Override
	public String getUserId() {
		return "user:" + id;
	}
    
    public boolean isAdmin(){
        for (String role : getRoles()) {
            if ("ROLE_ADMIN".equals(role)){
                return true;
            }
        }        
        return false;
    }
    
    public void updateProfile(String displayName, String email, String webSite){
        setDisplayName(displayName);
        setEmail(email);
        setWebSite(webSite);
    }

	public void defineDefaultRoles() {
        Set<String> roles = new HashSet<String>();
        roles.add("ROLE_USER");
        // atualize o perfil com as roles default para um usuário
        setRoles(roles);
	}

}
