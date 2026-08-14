package com.example.demo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dao.CustomerDao;
import com.example.demo.model.Customer;
import com.example.demo.service.CustomerService;
@Service
public class CustomerServiceimpl implements CustomerService {
CustomerDao customerdao;

	public CustomerServiceimpl(CustomerDao customerdao) {
	this.customerdao = customerdao;
}

	@Override
	public Customer save(Customer customer) {
		return customerdao.save(customer);
	}
	
	@Override
	public Customer findById(int customerid) {
		return customerdao.findById(customerid).orElse(null);
	}
	
	@Override
	public List<Customer> findAll() {
		return customerdao.findAll();
	}
	
	@Override
	public Customer update(Customer customer) {
		if(customerdao.existsById(customer.getCustomerId()))
		{
	    	return customerdao.save(customer);
		}
		else
		{
			throw new RuntimeException("data updation failure");
		}
	}
	
	@Override
	public int delete(int customerid) {
		if(customerdao.existsById(customerid))
		{
	    	customerdao.deleteById(customerid);
	    	return 1;
	    }
		return 0;
	}

}
