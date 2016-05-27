package com.softb.ipocket.bill.web;

import com.softb.ipocket.account.model.Account;
import com.softb.ipocket.account.repository.AccountRepository;
import com.softb.ipocket.account.web.AccountController;
import com.softb.ipocket.bill.model.Bill;
import com.softb.ipocket.bill.repository.BillRepository;
import com.softb.ipocket.bill.service.BillService;
import com.softb.ipocket.bill.web.resource.BudgetNodeRoot;
import com.softb.ipocket.bill.web.resource.CashFlowProjectionResource;
import com.softb.ipocket.categorization.model.SubCategory;
import com.softb.ipocket.categorization.repository.SubCategoryRepository;
import com.softb.system.errorhandler.exception.BusinessException;
import com.softb.system.rest.AbstractRestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@RestController("AppBillController")
@RequestMapping("/api/bill")
public class BillController extends AbstractRestController<Bill, Integer> {

	public static final String BILL_OBJECT_NAME = "Bill";

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private SubCategoryRepository subCategoryRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountController accountController;

    @Inject
    private BillService billService;


    /**
     * Return all bills of the current user.
     * @return
     */
    @RequestMapping(method = RequestMethod.GET)
    public List<Bill> listAll() {
        List<Bill> bills = billRepository.findAllByUser( getGroupId() );
        return bills;
    }

    /**
     * Creates one or more entries of bill, depending on the number of events of this bill.
     * @param json
     * @return
     */
    @RequestMapping(method = RequestMethod.POST)
    public Bill create(@RequestBody Bill json) throws CloneNotSupportedException {

        json.setGroupId( getGroupId() );
        json.setDone( false );
        validate( BILL_OBJECT_NAME, json );

        SubCategory subCategory = subCategoryRepository.findOneByUser( json.getSubCategory().getId(), getGroupId() );
        Bill bill = billRepository.save( json );
        bill.setSubCategory( subCategory );
        bill.setRelatedBills( new ArrayList<Bill>(  ) );

        Calendar cal = Calendar.getInstance();
        cal.setTime( json.getDate() );
        for (int i=1;i<json.getEvents();i++){

            cal.add( Calendar.MONTH, 1 );

            Bill relBill = json.clone();
            relBill.setDate( cal.getTime() );
            relBill.setSubCategory( subCategory );

            relBill = billRepository.save( relBill );

            bill.getRelatedBills().add( relBill );
        }

        return bill;
    }

    /**
     * Update an bill.
     * @param json
     * @return
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public Bill save(@PathVariable Integer id, @RequestBody Bill json) {

        SubCategory subCategory = subCategoryRepository.findOneByUser( json.getSubCategory().getId(), getGroupId() );
        Account accountTo = accountRepository.findOne( json.getAccountTo().getId(), getGroupId() );
        Account accountFrom = (json.getAccountFrom() != null ? accountRepository.findOne( json.getAccountFrom().getId(), getGroupId() ) : null);

        // Update related entities
        json.setGroupId( getGroupId() );
        json.setSubCategory( subCategory );
        json.setAccountTo( accountTo );
        json.setAccountFrom( accountFrom );
        validate( BILL_OBJECT_NAME, json );

        Bill bill = billRepository.save( json );

        return bill;
    }

    /**
     * Set a bill as done.
     * @param id
     * @return
     */
    @RequestMapping(value = "/{id}/done", method = RequestMethod.GET)
    public Bill done(@PathVariable Integer id) {

        Bill bill = billRepository.findOneByUser( id, getGroupId() );

        bill.setDone( true );
        bill = billRepository.save( bill );

        return bill;
    }

    /**
     * This point remove the specified bill from system. This bill needs to belong to the current user.
     * @param id
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable Integer id) {

        Bill bill = billRepository.findOneByUser( id, getGroupId() );
        if (bill == null){
            throw new BusinessException( "This bill doesn't belong to this user." );
        }
        billRepository.delete( id );
    }

    @RequestMapping(value = "/cashFlow", method = RequestMethod.GET)
    public CashFlowProjectionResource genCashFlowProjection() {
        Calendar start = Calendar.getInstance();
        Calendar end = Calendar.getInstance();
        end.set( Calendar.MONTH, start.get( Calendar.MONTH ) + 11 );
        end.set( Calendar.DAY_OF_MONTH, end.getActualMaximum( Calendar.DAY_OF_MONTH ) );

        // Gets user accounts (all)
        List<Account> accounts =  accountRepository.findAllByUser( getGroupId() );
        List<Bill> bills = billRepository.findAllByUser( getGroupId() );

        return billService.genCachFlowProjection( start.getTime() , end.getTime(), BillService.CASHFLOW_GROUP_DAY,
                                                  accounts, bills);
    }

    @RequestMapping(value = "/saveBaseline", method = RequestMethod.GET)
    public void saveBaseline() {
        billService.saveBaseline( getGroupId() );
    }

    @RequestMapping(value = "/budget", method = RequestMethod.GET)
    public BudgetNodeRoot genBudget() {
        return billService.genBudget( getGroupId() );
    }
}

