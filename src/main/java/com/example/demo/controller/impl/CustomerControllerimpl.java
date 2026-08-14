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
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.model.Customer;
import com.example.demo.service.CustomerService;
@RestController
@RequestMapping("/api/customer")
public class CustomerControllerimpl {
CustomerService customerservice;
	public CustomerControllerimpl(CustomerService customerservice) {
	this.customerservice = customerservice;
}

	@PostMapping
	public ResponseEntity<Customer> save(@RequestBody Customer customer) {
		Customer customer1=customerservice.save(customer);
		return new ResponseEntity<>(customer1,HttpStatus.CREATED);
	}
	
	@GetMapping
	public ResponseEntity<List<Customer>> findAll() {
		List<Customer> list=customerservice.findAll();
		return ResponseEntity.ok(list);
	}

	@GetMapping("/{customerid}")
	public ResponseEntity<Customer> findById(@PathVariable int customerid) {
		Customer customer1=customerservice.findById(customerid);
		if(customer1==null)
		{
			return ResponseEntity.notFound().build();
		}
		else
		{
		    return ResponseEntity.ok(customer1);
		}
	}
	

	@PutMapping
	public ResponseEntity<Customer> update(@RequestBody Customer customer) {
		if(customerservice.findById(customer.getCustomerId())==null)
		{
			return ResponseEntity.notFound().build();
		}
		else
		{
			Customer customer1=customerservice.update(customer);
			return ResponseEntity.ok(customer1);
		}
	}
	

	@DeleteMapping("/{customerid}")
	public ResponseEntity<Void> delete(@PathVariable int customerid) {
		int rowAffected=customerservice.delete(customerid);
		if(rowAffected==0)
		{
			return ResponseEntity.notFound().build();
		}
		else
		return ResponseEntity.noContent().build();
	}

}
