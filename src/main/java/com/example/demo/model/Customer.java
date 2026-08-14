package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="customertable")
public class Customer {
	@Id
    private int customerId;
	@Column
	private String customername;
	@Column
	private String customeremail;
	@Column
	private int customerphone;
	@Column
	private String customeraddress;
	@Column
	private int customeraadhaar;
	@Column
	private String customerpan;
	public int getCustomerId() {
		return customerId;
	}
	public void setCustomerId(int customerId) {
		this.customerId = customerId;
	}
	public String getCustomername() {
		return customername;
	}
	public void setCustomername(String customername) {
		this.customername = customername;
	}
	public String getCustomeremail() {
		return customeremail;
	}
	public void setCustomeremail(String customeremail) {
		this.customeremail = customeremail;
	}
	public int getCustomerphone() {
		return customerphone;
	}
	public void setCustomerphone(int customerphone) {
		this.customerphone = customerphone;
	}
	public String getCustomeraddress() {
		return customeraddress;
	}
	public void setCustomeraddress(String customeraddress) {
		this.customeraddress = customeraddress;
	}
	public int getCustomeraadhaar() {
		return customeraadhaar;
	}
	public void setCustomeraadhaar(int customeraadhaar) {
		this.customeraadhaar = customeraadhaar;
	}
	public String getCustomerpan() {
		return customerpan;
	}
	public void setCustomerpan(String customerpan) {
		this.customerpan = customerpan;
	}	
	
}
