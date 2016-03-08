package com.softb.ipocket.dashboard.service;

import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.account.repository.AccountEntryRepository;
import com.softb.ipocket.dashboard.web.resource.SavingResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;


@Service
public class DashboardService {

    @Autowired
    private AccountEntryRepository accountEntryRepository;

    public SavingResource getSavingInfo(Integer groupId) {
        List<Double> monthly = new ArrayList<Double>(  );
        for (int i=0;i<12;i++) monthly.add( 0.0 );
        List<Double> accumulated = new ArrayList<>( 12 );
        for (int i=0;i<12;i++) accumulated.add( 0.0 );

        Calendar start = Calendar.getInstance();
        Calendar end = Calendar.getInstance();
        start.set( start.get( Calendar.YEAR), Calendar.JANUARY, 1 ); // first day of this year
        end.set( end.get( Calendar.YEAR ), Calendar.DECEMBER, 31 ); // last day of the year

        List<AccountEntry> entries = accountEntryRepository.listAllByUserPeriod( start.getTime(), end.getTime(), groupId );

        for (AccountEntry entry: entries) {
            monthly.set( getIndex( entry.getDate() ) , monthly.get( getIndex( entry.getDate() )) + entry.getAmount() );
        }

        Double accBalance = 0.0;
        for (int i=0;i<12;i++) {
            accBalance += monthly.get( i );
            accumulated.set( i, accBalance );
        }

        return new SavingResource(monthly, accumulated);
    }

    private Integer getIndex(Date date){
        Calendar dateCal = Calendar.getInstance();
        dateCal.setTime( date );
        return dateCal.get( Calendar.MONTH );
    }

}