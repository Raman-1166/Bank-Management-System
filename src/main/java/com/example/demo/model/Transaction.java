package com.example.demo.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
@Entity
@Table(name="transactiontable")
public class Transaction {
	@Column
	private int Receiveraccount;
	@Column
	private int Senderaccount;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int transactionId;
	@Column
	private int accountNumber;
	@Column
	private String transactionType;
	@Column
	private int amount;
	@Column
	private String transactionStatus;
	
	
	public int getReceiveraccount() {
		return Receiveraccount;
	}
	public void setReceiveraccount(int receiveraccount) {
		Receiveraccount = receiveraccount;
	}
	public int getSenderaccount() {
		return Senderaccount;
	}
	public void setSenderaccount(int senderaccount) {
		Senderaccount = senderaccount;
	}
	public int getTransactionId() {
		return transactionId;
	}
	public void setTransactionId(int transactionId) {
		this.transactionId = transactionId;
	}
	public int getAccountNumber() {
		return accountNumber;
	}
	public void setAccountNumber(int accountNumber) {
		this.accountNumber = accountNumber;
	}
	public String getTransactionType() {
		return transactionType;
	}
	public void setTransactionType(String transactionType) {
		this.transactionType = transactionType;
	}
	public int getAmount() {
		return amount;
	}
	public void setAmount(int amount) {
		this.amount = amount;
	}
	public String getTransactionStatus() {
		return transactionStatus;
	}
	public void setTransactionStatus(String transactionStatus) {
		this.transactionStatus = transactionStatus;
	}
	    
}
