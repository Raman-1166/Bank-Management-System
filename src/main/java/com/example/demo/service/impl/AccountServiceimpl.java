package com.example.demo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dao.AccountDao;
import com.example.demo.model.Account;
import com.example.demo.service.AccountService;
@Service
public class AccountServiceimpl implements AccountService {
AccountDao accountDao;

	public AccountServiceimpl(AccountDao accountDao) {
	super();
	this.accountDao = accountDao;
}

	@Override
	public Account addAccountService(Account account) {
		return accountDao.save(account);
	}

	@Override
	public List<Account> SearchAccountbyCustomerIdService(int customerid) {
		return accountDao.findByCustomerid(customerid);
	}
	
	@Override
	public Account SearchAccountbyAccountNoService(int accountno) {
		return accountDao.findById(accountno).orElse(null);
	}

	@Override
	public Account UpdateAccountService(Account account) {
		if(accountDao.existsById(account.getAccountNumber()))
		{
			return accountDao.save(account);
		}
		else
		{
			throw new RuntimeException("data updation failure");	     
		}
	}

	@Override
	public int DeleteAccountService(int accountnumber) {
		if(accountDao.existsById(accountnumber))
		{
	    	accountDao.deleteById(accountnumber);
	        return 1;
		}
		return 0;
	}

}
