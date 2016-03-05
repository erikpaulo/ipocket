package com.softb.ipocket.account.service;

import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.account.repository.AccountEntryRepository;
import com.softb.ipocket.account.repository.AccountRepository;
import com.softb.system.security.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.Date;
import java.util.List;

/**
 * Created by eriklacerda on 3/1/16.
 */
@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountEntryRepository accountEntryRepository;

    @Inject
    private UserAccountService userAccountService;

    public Account getAccountStatement(Integer accountId, Date start, Date end){

        Account account = accountRepository.getOne(accountId);

        // Recupera o saldo até o início do período.
        Double balance = accountEntryRepository.getBalanceByDateAccount(accountId, start, userAccountService.getCurrentUser().getId());
        if (balance == null) balance = 0.0;

        // Recupera lançamentos do usuário para o mês corrente e anterior.
        List<AccountEntry> entries = accountEntryRepository.listAllByUserDateAccount(accountId, start, userAccountService.getCurrentUser().getId());

        // Calcula o saldo acumulativo.
        balance += account.getStartBalance();
        for (AccountEntry entry: entries){
            balance += entry.getAmount();
            entry.setBalance(balance);
        }
        account.setEntries(entries);
        account.setBalance(balance);

        return account;
    }
}
