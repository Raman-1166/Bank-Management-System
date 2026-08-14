package com.example.demo.service;

import java.util.List;

import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.model.Account;
import com.example.demo.model.Transaction;

public interface TransactionService {

	Transaction DepositService(Transaction transaction);
	Transaction WithdrawService(Transaction transaction);
	Transaction TranferMoneyService(Transaction transaction);
    List<Transaction> TransactionHistory();
}	
