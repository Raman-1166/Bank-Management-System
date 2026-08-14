package com.example.demo.controller.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.model.Account;
import com.example.demo.model.Transaction;
import com.example.demo.service.TransactionService;
@RestController
@RequestMapping("/api/transaction")
public class TransactionControllerImpl{
TransactionService transactionService;
	
	public TransactionControllerImpl(TransactionService transactionService) {
	this.transactionService = transactionService;
}


	@PostMapping("/deposit")
	public ResponseEntity<Transaction> DepositController(@RequestBody Transaction transaction) {
		Transaction transaction1=transactionService.DepositService(transaction);
		return new ResponseEntity<>(transaction1,HttpStatus.CREATED);
	}

	@PostMapping("/withdraw")
	public ResponseEntity<Transaction> WithdrawController(@RequestBody Transaction transaction) {
		Transaction transaction1=transactionService.WithdrawService(transaction);
		return new ResponseEntity<>(transaction1,HttpStatus.CREATED);
	}
	@PostMapping("/transaction")
	public ResponseEntity<Transaction> TranferMoneyController(@RequestBody Transaction transaction) {
		Transaction transaction1=transactionService.TranferMoneyService(transaction);
		return new ResponseEntity<>(transaction1,HttpStatus.CREATED);
	}
	@PostMapping("/transaction/history")
	public List<Transaction> TransactionHistory() {
		List list=transactionService.TransactionHistory();
		return list;
	}

}
