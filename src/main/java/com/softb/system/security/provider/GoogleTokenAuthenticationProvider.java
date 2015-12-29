package com.softb.system.security.provider;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softb.system.security.model.UserAccount;
import com.softb.system.security.service.UserAccountService;
import com.softb.system.security.web.resource.GoogleTokenResponseResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * Created by eriklacerda on 12/21/15.
 */
@Component
public class GoogleTokenAuthenticationProvider implements AuthenticationProvider {
    private static final Logger logger = LoggerFactory.getLogger(GoogleTokenAuthenticationProvider.class);

    private UserAccountService userDetailsService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        Authentication auth = null;

        String tokenId = authentication.getName ();

        if (!tokenId.isEmpty ()) {

            GoogleTokenResponseResource token = validateGoogleToken ( tokenId );
            if ( token != null){

                List<GrantedAuthority> grantedAuths = new ArrayList<> ();
                grantedAuths.add ( new SimpleGrantedAuthority ( "ROLE_USER" ) );
                UserAccount userAccount = userDetailsService.loadUserByGoogleId ( "erik.lacerda@gmail.com" );
                userAccount.setImageUrl ( token.getPicture () );

                auth = new UsernamePasswordAuthenticationToken ( userAccount, userAccount.getPassword (), grantedAuths );
            }
        }

        return auth;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals ( GoogleAuthenticationToken.class );
    }

    public void setUserDetailsService(UserAccountService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    private GoogleTokenResponseResource validateGoogleToken(String tokenId){
        Map<String, String> vars = new HashMap<String, String> ();
        RestTemplate restTemplate = new RestTemplate ();
        GoogleTokenResponseResource ret = null;

        vars.put ( "id_token", tokenId );
        String json = restTemplate.getForObject ( "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={id_token}", String.class, vars );

        ObjectMapper mapper = new ObjectMapper ();
        GoogleTokenResponseResource token = null;
        try {
            token = mapper.readValue ( json, GoogleTokenResponseResource.class );
        } catch (IOException e) {
            logger.debug ( "Não foi possível converter o json de resposta.", e );
        }

        String clientId = userDetailsService.getClientId ();
        if (token != null && clientId.equals ( token.getAud () ) ){
            return token;
        } else {
            return null;
        }
    }
}
