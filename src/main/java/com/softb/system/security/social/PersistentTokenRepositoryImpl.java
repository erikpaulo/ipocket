package com.softb.system.security.social;

import java.util.Date;
import java.util.List;

import org.springframework.security.web.authentication.rememberme.PersistentRememberMeToken;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;

import com.softb.system.security.model.RememberMeToken;
import com.softb.system.security.repository.RememberMeTokenRepository;

/**
 * Implementation for {@link PersistentTokenRepository}. Store {@link RememberMeToken}
 * 
 */
public class PersistentTokenRepositoryImpl implements PersistentTokenRepository {

    private final RememberMeTokenRepository rememberMeTokenRepository;
    
    public PersistentTokenRepositoryImpl(RememberMeTokenRepository rememberMeTokenRepository){
        this.rememberMeTokenRepository = rememberMeTokenRepository;
    }
    
    @Override
    public void createNewToken(PersistentRememberMeToken token) {
        RememberMeToken newToken = new RememberMeToken(token);
        this.rememberMeTokenRepository.save(newToken);
    }

    @Override
    public void updateToken(String series, String tokenValue, Date lastUsed) {
        RememberMeToken token = this.rememberMeTokenRepository.findBySeries(series);
        if (token != null){
            token.setTokenValue(tokenValue);
            token.setDate(lastUsed);
            this.rememberMeTokenRepository.save(token);
        }

    }

    @Override
    public PersistentRememberMeToken getTokenForSeries(String seriesId) {
        RememberMeToken token = this.rememberMeTokenRepository.findBySeries(seriesId);
        if (token == null){
            return null;
        }
        return new PersistentRememberMeToken(token.getUsername(), token.getSeries(), token.getTokenValue(), token.getDate());
    }

    @Override
    public void removeUserTokens(String username) {
        List<RememberMeToken> tokens = this.rememberMeTokenRepository.findByUsername(username);
        this.rememberMeTokenRepository.delete(tokens);
    }

}
