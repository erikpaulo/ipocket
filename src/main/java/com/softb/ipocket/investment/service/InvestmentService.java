package com.softb.ipocket.investment.service;

import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.general.model.utils.AppMaths;
import com.softb.ipocket.investment.model.Index;
import com.softb.ipocket.investment.model.Investment;
import com.softb.ipocket.investment.model.InvestmentEntry;
import com.softb.ipocket.investment.repository.InvestmentEntryRepository;
import com.softb.ipocket.investment.repository.InvestmentRepository;
import com.softb.ipocket.investment.web.resource.InvestmentFRDResource;
import com.softb.ipocket.investment.web.resource.InvestmentSummaryResource;
import com.softb.ipocket.investment.web.resource.InvestmentTypeResource;
import com.softb.system.errorhandler.exception.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by eriklacerda on 4/17/16.
 */
@Service
public class InvestmentService {

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private InvestmentEntryRepository investmentEntryRepository;

    /**
     * Generate a summary of all user investments.
     * @param groupId
     * @return
     */
    public InvestmentSummaryResource getSummary(Integer groupId){
        Map<String, InvestmentTypeResource> groups = new HashMap<>(  );
        InvestmentSummaryResource summary = new InvestmentSummaryResource( );

        // Creates structure of investiments by its types.
        Iterator<Investment.Type> k = new ArrayList<> ( Arrays.asList ( Investment.Type.values () ) ).iterator ();
        while (k.hasNext ()) {
            Investment.Type key = k.next();
            InvestmentTypeResource investType = new InvestmentTypeResource ( key );

            groups.put( key.getName(), investType );
        }

        // Gets all investments of the logged user, grouping by its types
        List<Investment> investments = investmentRepository.findAllByUser( groupId );
        for (Investment investment: investments) {

            // Calculate the amountCurrent of this investment.
            calculateInvestmentBalance( investment );

            Double amountCurrent = investment.getAmountCurrent() + groups.get( investment.getType().getName() ).getAmountCurrent();
            Double amountInvested = investment.getAmountInvested() + groups.get( investment.getType().getName() ).getAmountInvested();

            InvestmentTypeResource type = groups.get( investment.getType().getName() );

            type.setAmountCurrent( amountCurrent );
            type.setAmountInvested( amountInvested );
            if (amountInvested>0){
                type.setPerGrossIncome( roundPercent( (amountCurrent-amountInvested) / amountInvested) );
            }
            type.getInvestments().add( investment );
        }

        // Remove types that don't have investiments.
        for(Iterator<Map.Entry<String, InvestmentTypeResource>> it = groups.entrySet().iterator(); it.hasNext(); ) {
            Map.Entry<String, InvestmentTypeResource> entry = it.next();
            if(entry.getValue().getInvestments().size() == 0) {
                it.remove();
            }
        }

        summary.setTypes( groups );
        return summary;
    }

    /**
     * Calculate the current amountCurrent, based on the last index update and the quantity of quotes the investment has.
     * @param investment
     */
    private void calculateInvestmentBalance(Investment investment) {
        Double indexValue = 0.0;
        if (investment.getIndexUpdates() != null && investment.getIndexUpdates().size() > 0){
            indexValue = investment.getLastIndex().getValue();
        }

        Double qtdQuotes = 0.0, amountInvested = 0.0;
        for (InvestmentEntry entry: investment.getEntries()) {
            qtdQuotes += entry.getQtdQuotes() * getSignal( entry );
            amountInvested += entry.getAmount() * getSignal( entry );
        }

        Double amountCurrent = qtdQuotes * indexValue;
        investment.setAmountCurrent( amountCurrent );
        investment.setAmountInvested( amountInvested );
        if (amountInvested > 0) {
            investment.setPerGrossIncome( roundPercent((amountCurrent - amountInvested ) / amountInvested) );
        } else {
            investment.setPerGrossIncome( 0.0 );
        }
    }

    /**
     * Generate all important infos that composes the investment statement.
     * @param investment
     * @param groupId
     * @return
     */
    public InvestmentFRDResource getFRDStatement(Investment investment, Integer groupId) {

        if (investment.getType().compareTo( Investment.Type.FRD ) != 0){
            throw new BusinessException( "This investment should be of type FRD, but its "+ investment.getType() );
        }

        // Sort indexes by date
        Collections.sort(investment.getIndexUpdates(), new Comparator<Index>() {
            @Override
            public int compare(Index  index1, Index  index2) {
                return index1.getDate().compareTo(index2.getDate());
            }
        });

        Double index = 0.0;
        if (investment.getIndexUpdates().size() > 0){
            index = investment.getLastIndex().getValue();
        }

        Double grossIncome = 0.0;
        Double netIncome = 0.0, grossIncomePercent = 0.0, netIncomePercent = 0.0;
        Double taxesAmount = 0.0, qtdQuotes = 0.0;
        if (investment.getEntries().size() > 0){
            calculateInvestmentBalance( investment );

            grossIncome += (investment.getAmountCurrent() - investment.getAmountInvested());
            taxesAmount = grossIncome * (getProgressiveTaxTable() + investment.getAdminFee());
            netIncome = grossIncome - taxesAmount;

            grossIncomePercent = investment.getPerGrossIncome(); //roundPercent(grossIncome / amountInvested);
            netIncomePercent =  roundPercent(netIncome / investment.getAmountInvested());

        }

        List amountUpdates = new ArrayList(  );
        List<Double> lastIndexByMonth = new ArrayList<>(  );
        DateFormat formatter = new SimpleDateFormat("MM/yyyy");
        String dateTemp = null;
        for (Index i: investment.getIndexUpdates()) {

            // Total balance throw time
            Double sumQuotes = 0.0;
            for (InvestmentEntry entry: investment.getEntries()) {
                if (i.getDate().compareTo( entry.getDate() ) >= 0){
                    sumQuotes += entry.getQtdQuotes() * getSignal( entry );
                }
            }
            amountUpdates.add( i.getValue() * sumQuotes );

            if (dateTemp == null || !dateTemp.equalsIgnoreCase( formatter.format( i.getDate() ) )) {
                dateTemp = formatter.format( i.getDate() );
                lastIndexByMonth.add( i.getValue() );
            } else {
                lastIndexByMonth.set( lastIndexByMonth.size()-1 , i.getValue());
            }

        }

        // Calculate income by month
        List<Double> indexIncome = new ArrayList<>(  );
        Double lastIndexValue = 0.0;
        for (Double d: lastIndexByMonth) {
            if (indexIncome.size() == 0) {
                lastIndexValue = d;
            }

            indexIncome.add( Math.round(((d / lastIndexValue) - 1)*1000) / 10.0  );
            lastIndexValue = d;

        }

        return new InvestmentFRDResource(investment.getName(), netIncomePercent, netIncome, grossIncomePercent, grossIncome, investment.getAmountInvested(),
                                         investment.getAmountCurrent(), investment.getAdminFee(), getProgressiveTaxTable(), taxesAmount,
                                         qtdQuotes, index, indexIncome, investment.getIndexUpdates(), investment.getEntries(), amountUpdates);
    }

    /**
     * Transform the user investments into user accounts;
     * @param groupId
     * @return
     */
    public List<Account> getInvestmentsAsAccounts(Integer groupId) {
        List<Account> accounts = new ArrayList<>(  );
        InvestmentSummaryResource investSummary = getSummary( groupId );

        for (Map.Entry<String, InvestmentTypeResource> type: investSummary.getTypes().entrySet()) {
            InvestmentTypeResource investType = type.getValue();

            for (Investment investment: investType.getInvestments()) {
                Account account = new Account( investment.getName(), Account.Type.INV, new ArrayList<AccountEntry>(  ),
                        investment.getCreateDate(), true, groupId, 0.0, null, 0.0 );

                for (InvestmentEntry entry: investment.getEntries()) {
                    Double amount = entry.getQtdQuotes() * investment.getLastIndex().getValue() * getSignal( entry );
                    account.getEntries().add( new AccountEntry( entry.getDate(), null, amount, false,
                            investment.getId(), null, null, groupId, amount, null ));
                }
                accounts.add( account );
            }
        }

        return accounts;
    }

    /**
     * Gets all user investment entries. This entries will be returned with its amounts updated considering
     * the last index inserted.
     * @param start
     * @param end
     * @param groupId
     * @return
     */
    public List<InvestmentEntry> getAllEntriesByPeriod(Date start, Date end, Integer groupId){
        List<InvestmentEntry> entries = investmentEntryRepository.findAllByUserPeriod( start, end, groupId );

        for (InvestmentEntry entry: entries) {
            Investment invest = investmentRepository.findOne( entry.getInvestmentId(), groupId );
            Double index = invest.getLastIndex().getValue();

            entry.setAmount( entry.getQtdQuotes() * index * getSignal( entry ) );
            entry.setIndexValue( index );
        }

        return entries;
    }

    /**
     * Return the current investment balance until the date informed.
     * @param date
     * @param groupId
     * @return
     */
    public Double getBalanceUntilDate(Date date, Integer groupId){
        Calendar start = Calendar.getInstance();
        start.set( 1900, 1, 1 );

        List<InvestmentEntry> entries = getAllEntriesByPeriod(start.getTime(), new Date(), groupId );

        Double balance = 0.0;
        for (InvestmentEntry entry: entries) {
            balance += entry.getAmount();
        }

        return balance;
    }

    private Double getSignal(InvestmentEntry entry) {
        return (entry.getType().equalsIgnoreCase( "B" ) ? 1.0 : -1.0);
    }

    private Double getProgressiveTaxTable (){
        return 0.225;
    }
    private Double roundPercent(Double value){
        return AppMaths.round( value * 100, 1  );
    }
}
