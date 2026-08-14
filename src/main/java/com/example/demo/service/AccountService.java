package com.example.demo.service;

import java.util.List;

import com.example.demo.model.Account;

public interface AccountService {
	Account addAccountService(Account account);
	Account UpdateAccountService(Account account);
	int DeleteAccountService(int accountnumber);
	List<Account> SearchAccountbyCustomerIdService(int customerid);
	Account SearchAccountbyAccountNoService(int accountno);
}
