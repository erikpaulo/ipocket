package com.softb.system.security.web;

import java.util.List;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.softb.system.security.model.UserAccount;
import com.softb.system.security.model.UserSocialConnection;
import com.softb.system.security.repository.UserAccountRepository;
import com.softb.system.security.repository.UserSocialConnectionRepository;
import com.softb.system.security.service.UserAccountService;
import com.softb.system.security.web.resource.UserAccountResource;

/**
 * RESTful Service para o usuário logado no Spring Security.
 * 
 * <p>
 * API: '<b>api/accounts/:action</b>'
 * </p>
 * <p>
 * <b>:action</b> pode ser
 * <ul>
 * <li>'overview' - retorna os dados do usuário logado, incluindo dados do provedor (google, ...) de segurança
 * <li>'profile' - retorna (GET) ou atualiza (PUT) os dados do usuário logado.</li>
 * <li>'useSocialImage' - permite que o usuário seleciona qual imagem gostaria de utilizar (util quando o usuário estiver connectado a mais de um provider)
 * </ul>
 * </p>
 * 
 */
@RequestMapping(value = "api/accounts")
@Controller
public class AccountController {
    private static final Logger logger = LoggerFactory.getLogger(AccountController.class);

    private final UserAccountRepository userAccountRepository;
    private final UserSocialConnectionRepository userSocialConnectionRepository;
    private final UserAccountService userAccountService;

    @Inject
    public AccountController(UserAccountRepository userAccountRepository,
            UserSocialConnectionRepository userSocialConnectionRepository, UserAccountService userAccountService) {
        this.userAccountRepository = userAccountRepository;
        this.userSocialConnectionRepository = userSocialConnectionRepository;
        this.userAccountService = userAccountService;
    }

    @RequestMapping(value = "overview", method = RequestMethod.GET)
    @ResponseBody
//    @Timed
    public UserAccountResource getCurrentUserAccount() {
        UserAccount currentUser = userAccountService.getCurrentUser();
        List<UserSocialConnection> connections = userSocialConnectionRepository.findByUserId(currentUser.getUserId());
        return UserAccountResource.transferForAccountOverview(currentUser, connections);
    }

    @RequestMapping(value = "profile", method = RequestMethod.GET)
    @ResponseBody
//    @Timed
    public UserAccountResource getProfile() {
        UserAccount currentUser = userAccountService.getCurrentUser();
        return UserAccountResource.transferForProfileUpdate(currentUser);
    }

    @RequestMapping(value = "profile", method = RequestMethod.PUT)
    @ResponseStatus(HttpStatus.NO_CONTENT)
//    @Timed
    public void updateProfile(@RequestBody UserAccountResource profile) {
        UserAccount currentUser = userAccountService.getCurrentUser();
        currentUser.updateProfile(profile.getDisplayName(), profile.getEmail(), profile.getWebSite());
        userAccountRepository.save(currentUser);
    }

    @RequestMapping(value = "useSocialImage", method = RequestMethod.PUT)
    @ResponseBody
//    @Timed
    public UserAccountResource useSocialImage(@RequestParam("provider") String provider) {
        UserAccount currentUser = userAccountService.getCurrentUser();
        List<UserSocialConnection> connections = userSocialConnectionRepository.findByUserId(currentUser.getUserId());

        for (UserSocialConnection connection : connections) {
            if (connection.getProviderId().equals(provider)) {
                currentUser.setImageUrl(connection.getImageUrl());
                logger.debug("Change user image to social account image of " + provider);
                break;
            }
        }
        currentUser = userAccountRepository.save(currentUser);
        return UserAccountResource.transferForAccountOverview(currentUser, connections);
    }
}
