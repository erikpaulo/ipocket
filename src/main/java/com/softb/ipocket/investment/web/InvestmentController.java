package com.softb.ipocket.investment.web;

import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.investment.model.Index;
import com.softb.ipocket.investment.model.Investment;
import com.softb.ipocket.investment.repository.IndexRepository;
import com.softb.ipocket.investment.repository.InvestmentEntryRepository;
import com.softb.ipocket.investment.repository.InvestmentRepository;
import com.softb.ipocket.investment.service.InvestmentService;
import com.softb.ipocket.investment.web.resource.InvestmentStatementResource;
import com.softb.ipocket.investment.web.resource.InvestmentSummaryResource;
import com.softb.system.errorhandler.exception.FormValidationError;
import com.softb.system.rest.AbstractRestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.Date;

@RestController("AppInvestmentController")
@RequestMapping("/api/investment")
public class InvestmentController extends AbstractRestController<Account, Integer> {

	public static final String INVESTMENT_OBJECT_NAME = "Investment";

	@Autowired
	private InvestmentRepository investmentRepository;

    @Autowired
    private InvestmentEntryRepository investmentEntryRepository;

	@Autowired
	private IndexRepository indexRepository;

    @Inject
    private InvestmentService investmentService;


    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    public Investment create(@RequestBody Investment investment) throws FormValidationError {

        // Set default values
        investment.setGroupId( getGroupId() );
        investment.setActivated( true );
        investment.setLastUpdate( new Date( ) );
        investment.setCreateDate( new Date( ) );
        investment.setAdminFee( investment.getAdminFee() / 12 / 100.0 );
        validate( INVESTMENT_OBJECT_NAME, investment );

        investment = investmentRepository.save( investment );

        return investment;
    }

    @RequestMapping(value = "/summary", method = RequestMethod.GET)
    public InvestmentSummaryResource summary() {
        return investmentService.getSummary( getGroupId() );
    }

    @RequestMapping(value = "/{id}/statement", method = RequestMethod.GET)
    public InvestmentStatementResource statement(@PathVariable Integer id) {
        Investment investment = investmentRepository.findOne( id, getGroupId() );

        if (investment.getType().compareTo( Investment.Type.FRD ) == 0){
            return investmentService.getFRDStatement( investment, getGroupId() );
        }

        return null;
    }

    @RequestMapping(value = "/{id}/updateIndex", method = RequestMethod.POST)
    public Index updateIndex(@RequestBody Index json) {
        return indexRepository.save( new Index(json.getId(), new Date(), json.getValue()) );
    }
}

