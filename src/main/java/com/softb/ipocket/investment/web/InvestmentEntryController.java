package com.softb.ipocket.investment.web;

import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.general.model.utils.AppMaths;
import com.softb.ipocket.investment.model.Index;
import com.softb.ipocket.investment.model.InvestmentEntry;
import com.softb.ipocket.investment.repository.IndexRepository;
import com.softb.ipocket.investment.repository.InvestmentEntryRepository;
import com.softb.ipocket.investment.service.InvestmentService;
import com.softb.system.errorhandler.exception.FormValidationError;
import com.softb.system.rest.AbstractRestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import javax.transaction.Transactional;

@RestController("AppInvestmentEntryController")
@RequestMapping("/api/investment/{id}")
public class InvestmentEntryController extends AbstractRestController<Account, Integer> {

	public static final String INVESTMENT_OBJECT_NAME = "Investment";

    @Autowired
    private InvestmentEntryRepository investmentEntryRepository;

	@Autowired
	private IndexRepository indexRepository;

    @Inject
    private InvestmentService investmentService;


    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public InvestmentEntry create(@RequestBody InvestmentEntry entry) throws FormValidationError {

        // Set default values
        entry.setGroupId( getGroupId() );
        entry.setIncomeTax( (entry.getIncomeTax() == null ? 0 : entry.getIncomeTax()) );
        entry.setIof( (entry.getIof() == null ? 0 : entry.getIof()) );
        entry.setQtdQuotes( Math.abs( AppMaths.round((entry.getAmount()+entry.getIof()+entry.getIncomeTax()) / entry.getIndexValue(), 5)) );

        entry = investmentEntryRepository.save( entry );

        indexRepository.save( new Index( entry.getInvestmentId(), entry.getDate(), entry.getIndexValue() ) );

        return entry;
    }
}

