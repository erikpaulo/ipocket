package com.softb.system.security.service;

import com.softb.system.security.model.UserAccount;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.social.security.SocialUserDetailsService;

/**
 * Domain Service para administração do usuário, Extende SocialUserDetailsService,
 * UserDetailsService and UserIdSource pois é chamado do SocialAuthenticationProvider no momento da autenticação
 * através do método loadUserByUserId
 * 
 */
public interface UserAccountService extends SocialUserDetailsService, UserDetailsService {
    
    /**
     * Cria um novo usuário a partir dos dados informados
     * Default role = ROLE_USER
     * 
     * @param data
     * @return
     */
    UserAccount createUserAccount(UserAccount account);

    /**
     * Adiciona uma role para o user.
     * 
     * @param userId
     * @param isAuthor
     */
    UserAccount grant(String userId, String role);
    
    /**
     * Retira uma role do usuário
     * 
     * @param userId
     * @param role
     */
    UserAccount revoke(String userId, String role);
    
    /**
     * Override SocialUserDetailsService.loadUserByUserId(String groupId) to
     * return UserAccount.
     */
    UserAccount loadUserByUserId(String userId) throws UsernameNotFoundException;
    
    /**
     * Override UserDetailsService.loadUserByUsername(String username) to 
     * return UserAccount.
     */
    UserAccount loadUserByUsername(String username) throws UsernameNotFoundException;


    UserAccount loadUserByGoogleId(String googleId) throws UsernameNotFoundException;
    
    /**
     * Recupara o usuário corrent logado. Recupera os detalhes do UserAccount object do database. 
     * 
     * @return UserAccount. Null se o usuário não estiver logado.
     */
    UserAccount getCurrentUser();

    /**
     * Recupera o clientId da aplicação.
     * @return
     */
    String getClientId();

}
