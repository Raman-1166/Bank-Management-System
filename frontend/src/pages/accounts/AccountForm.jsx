import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AccountForm = ({ initialData, onSubmit, onClose, isLoading }) => {
  const isEditing = !!initialData;
  
  const [formData, setFormData] = useState({
    accountNumber: '',
    accounttype: 'Savings',
    balance: '',
    customerid: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Parse numeric fields to integer as required by the backend
    const submissionData = {
      ...formData,
      accountNumber: parseInt(formData.accountNumber, 10),
      balance: parseInt(formData.balance, 10),
      customerid: parseInt(formData.customerid, 10)
    };
    
    onSubmit(submissionData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{isEditing ? 'Edit Account' : 'Add New Account'}</h2>
          <button className="close-btn" onClick={onClose} disabled={isLoading}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input
                type="number"
                name="accountNumber"
                className="form-control"
                value={formData.accountNumber}
                onChange={handleChange}
                disabled={isEditing || isLoading}
                required
              />
              {!isEditing && <small className="text-secondary">Unique account identifier</small>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Customer ID</label>
              <input
                type="number"
                name="customerid"
                className="form-control"
                value={formData.customerid}
                onChange={handleChange}
                disabled={isEditing || isLoading} // Usually shouldn't change the owner of an account
                required
              />
              {!isEditing && <small className="text-secondary">Must be an existing Customer ID</small>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Account Type</label>
              <select
                name="accounttype"
                className="form-control"
                value={formData.accounttype}
                onChange={handleChange}
                disabled={isLoading}
                required
              >
                <option value="Savings">Savings</option>
                <option value="Current">Current</option>
                <option value="Fixed Deposit">Fixed Deposit</option>
                <option value="Salary">Salary</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Initial Balance ($)</label>
              <input
                type="number"
                name="balance"
                className="form-control"
                value={formData.balance}
                onChange={handleChange}
                disabled={isLoading}
                required
                min="0"
              />
            </div>
            
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : (isEditing ? 'Update Account' : 'Add Account')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;
