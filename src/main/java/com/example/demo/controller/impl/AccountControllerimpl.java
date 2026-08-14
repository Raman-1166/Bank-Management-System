package com.example.demo.controller.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.model.Account;
import com.example.demo.model.Customer;
import com.example.demo.service.AccountService;
import com.example.demo.service.CustomerService;
@RestController
@RequestMapping("/api/account")
public class AccountControllerimpl {
AccountService accountService;
CustomerService customerService;

public AccountControllerimpl(AccountService accountService, CustomerService customerService) {
	this.accountService = accountService;
	this.customerService = customerService;
}

	@PostMapping
	public ResponseEntity<Account> addAccountController(@RequestBody Account account) {
		Customer customer=customerService.findById(account.getCustomerid());
		if(customer==null)
		{
			return ResponseEntity.notFound().build();
		}
		else
		{
			Account account1=accountService.addAccountService(account);
		    return new ResponseEntity<>(account1,HttpStatus.CREATED);
		}
	}

	@GetMapping("/customer/{customerid}")
	public ResponseEntity<List<Account>> SearchAccountbyCustomerIdController(@PathVariable int customerid) {
		Customer customer=customerService.findById(customerid);
		if(customer==null)
		{
			return ResponseEntity.notFound().build();
		}
		List<Account> list=accountService.SearchAccountbyCustomerIdService(customer.getCustomerId());
		if(list.isEmpty())
		{
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(list);
	}
	

	@GetMapping("/account/{accountno}")
	public ResponseEntity<Account> SearchAccountbyAccountNoController(@PathVariable int accountno) {
		Account account1=accountService.SearchAccountbyAccountNoService(accountno);
		if(account1==null)
		{
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(account1);
	}


	@PutMapping
	public ResponseEntity<Account> UpdateAccountController(@RequestBody Account account) {
		List<Account> list=accountService.SearchAccountbyCustomerIdService(account.getCustomerid());
		if(list.isEmpty())
		{
			return ResponseEntity.notFound().build();
		}
		else
		{
		      Account account1=accountService.UpdateAccountService(account);
	          return new ResponseEntity<>(account1,HttpStatus.CREATED); 
		}
	}


	@DeleteMapping("/{accountno}")
	public ResponseEntity<Void> DeleteAccountController(@PathVariable int accountno) {
		int rowAffected=accountService.DeleteAccountService(accountno);
		if(rowAffected==0)
		{
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.noContent().build();
	}

}
