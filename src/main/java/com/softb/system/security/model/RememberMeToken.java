package com.softb.system.security.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import org.springframework.security.web.authentication.rememberme.PersistentRememberMeToken;

import com.softb.system.repository.BaseEntity;

/**
 * Entity for RememberMe token.
 * 
 */
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude={"series"})
@Entity(name = "remember_me_token")
public class RememberMeToken extends BaseEntity<Integer>{

	@Column
    private String username;
    
    @Column
    private String series;
    
    @Column
    private String tokenValue;
    
    private Date date;
    
    public RememberMeToken(PersistentRememberMeToken token){
        this.series = token.getSeries();
        this.username = token.getUsername();
        this.tokenValue = token.getTokenValue();
        this.date = token.getDate();
    }

}
