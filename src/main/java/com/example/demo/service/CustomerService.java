package com.example.demo.service;

import java.util.List;

import com.example.demo.model.Customer;

public interface CustomerService {
    
	Customer findById(int customerid);

	Customer update(Customer customer);

	int delete(int customerId);

	Customer save(Customer customer);
	
	List<Customer> findAll();


}
