package com.example.demo.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dao.AccountDao;
import com.example.demo.dao.TransactionDao;
import com.example.demo.model.Account;
import com.example.demo.model.Transaction;
import com.example.demo.service.TransactionService;

@Service
public class TransactionServiceimpl implements TransactionService {
	AccountDao accountDao;
	TransactionDao transactionDao;

	public TransactionServiceimpl(AccountDao accountDao, TransactionDao transactionDao) {
		this.accountDao = accountDao;
		this.transactionDao = transactionDao;
	}

	@Override
	public Transaction DepositService(Transaction transaction) {

		// 1. Account find karo
		Account account = accountDao.findById(transaction.getAccountNumber())
				.orElseThrow(() -> new RuntimeException("Account not found"));

		// 2. Balance update karo
		int updatedBalance = account.getBalance() + transaction.getAmount();
		account.setBalance(updatedBalance);

		// 3. Account table me updated balance save karo
		accountDao.save(account);

		// 4. Transaction ki details set karo
		transaction.setTransactionType("Deposit");
		transaction.setTransactionStatus("Success");

		// deposit me sender nahi hota
		transaction.setSenderaccount(0);

		// jis account me paisa deposit hua
		transaction.setReceiveraccount(0);

		// 5. Transaction table me new record create karo
		return transactionDao.save(transaction);
	}

	@Override
	public Transaction WithdrawService(Transaction transaction) {

		// 1. Account find karo
		Account account = accountDao.findById(transaction.getAccountNumber())
				.orElseThrow(() -> new RuntimeException("Account not found"));

		if (account.getBalance() <= 0) {
			throw new RuntimeException("Insufficient Balance");
		}

		// 2. Balance update karo
		int updatedBalance = account.getBalance() - transaction.getAmount();
		account.setBalance(updatedBalance);

		// 3. Account table me updated balance save karo
		accountDao.save(account);

		// 4. Transaction ki details set karo
		transaction.setTransactionType("withdraw");
		transaction.setTransactionStatus("Success");

		// deposit me sender nahi hota
		transaction.setSenderaccount(0);

		// jis account me paisa deposit hua
		transaction.setReceiveraccount(0);

		// 5. Transaction table me new record create karo
		return transactionDao.save(transaction);
	}

	@Override
	public Transaction TranferMoneyService(Transaction transaction) {
		Account account1 = accountDao.findById(transaction.getSenderaccount())
				.orElseThrow(() -> new RuntimeException("Account not found"));
		Account account2 = accountDao.findById(transaction.getReceiveraccount())
				.orElseThrow(() -> new RuntimeException("Account not found"));

		if (account1.getBalance() <= 0 || transaction.getAmount()>account1.getBalance()) {
			throw new RuntimeException("Insufficient Balance");
		}
		int senderBalance = account1.getBalance();
		int receiverBalance = account2.getBalance();
		int updatedsenderbalance = (account1.getBalance() - transaction.getAmount());
		int updatedrecieverbalance = (account2.getBalance() + transaction.getAmount());
		account1.setBalance(updatedsenderbalance);
		account2.setBalance(updatedrecieverbalance);
		accountDao.save(account1);
		accountDao.save(account2);

		transaction.setSenderaccount(account1.getAccountNumber());
		transaction.setReceiveraccount(account2.getAccountNumber());
		transaction.setAccountNumber(0);
		transaction.setAmount(transaction.getAmount());
		transaction.setTransactionStatus("success");
		transaction.setTransactionType("transfer");
		Transaction transaction1 = transactionDao.save(transaction);
		return transaction1;
	}

	@Override
	public List<Transaction> TransactionHistory() {
		return transactionDao.findAll();
	}

}
