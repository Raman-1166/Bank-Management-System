import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CustomerForm = ({ initialData, onSubmit, onClose, isLoading }) => {
  const isEditing = !!initialData;
  
  const [formData, setFormData] = useState({
    customerId: '',
    customername: '',
    customeremail: '',
    customerphone: '',
    customeraddress: '',
    customeraadhaar: '',
    customerpan: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For integer fields, we convert to number on submit, keep as string in state for easier editing
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert to integers as required by the backend
    const submissionData = {
      ...formData,
      customerId: parseInt(formData.customerId, 10),
      customerphone: parseInt(formData.customerphone, 10),
      customeraadhaar: parseInt(formData.customeraadhaar, 10)
    };
    
    onSubmit(submissionData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{isEditing ? 'Edit Customer' : 'Add New Customer'}</h2>
          <button className="close-btn" onClick={onClose} disabled={isLoading}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Customer ID</label>
              <input
                type="number"
                name="customerId"
                className="form-control"
                value={formData.customerId}
                onChange={handleChange}
                disabled={isEditing || isLoading}
                required
              />
              {!isEditing && <small className="text-secondary">Unique ID for the customer</small>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="customername"
                className="form-control"
                value={formData.customername}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="customeremail"
                className="form-control"
                value={formData.customeremail}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="number"
                name="customerphone"
                className="form-control"
                value={formData.customerphone}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="customeraddress"
                className="form-control"
                value={formData.customeraddress}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Aadhaar Number</label>
                <input
                  type="number"
                  name="customeraadhaar"
                  className="form-control"
                  value={formData.customeraadhaar}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">PAN Number</label>
                <input
                  type="text"
                  name="customerpan"
                  className="form-control"
                  value={formData.customerpan}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : (isEditing ? 'Update Customer' : 'Add Customer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
