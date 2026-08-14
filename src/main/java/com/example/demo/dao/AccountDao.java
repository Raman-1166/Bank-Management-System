package com.example.demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Account;

public interface AccountDao extends JpaRepository<Account,Integer>{
	List<Account> findByCustomerid(int customerid);
}
