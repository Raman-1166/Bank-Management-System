import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, AlertCircle, Users } from 'lucide-react';
import { customerApi } from '../../api/customerApi';
import CustomerForm from './CustomerForm';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      setFilteredCustomers(
        customers.filter(c => {
          const name = c.customername ? c.customername.toLowerCase() : '';
          const id = c.customerId ? c.customerId.toString() : '';
          const email = c.customeremail ? c.customeremail.toLowerCase() : '';
          return name.includes(lowerQuery) || id.includes(lowerQuery) || email.includes(lowerQuery);
        })
      );
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchQuery, customers]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerApi.getAll();
      setCustomers(data || []);
    } catch (err) {
      setError('Failed to fetch customers. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCustomer(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError(null);
      
      if (editingCustomer) {
        await customerApi.update(formData);
        showSuccess('Customer updated successfully');
      } else {
        await customerApi.create(formData);
        showSuccess('Customer added successfully');
      }
      
      handleCloseForm();
      fetchCustomers();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message || 'Operation failed'));
    } finally {
      setFormLoading(false);
    }
  };

  const requestDelete = (customer) => {
    setDeleteConfirm(customer);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await customerApi.delete(deleteConfirm.customerId);
      showSuccess('Customer deleted successfully');
      setDeleteConfirm(null);
      fetchCustomers();
    } catch (err) {
      alert('Failed to delete customer: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Customer Management</h1>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
          <Search size={18} style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }} />
          <input
            type="text"
            placeholder="Search by ID, Name or Email..."
            style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: '0.875rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="empty-state">
            <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>{searchQuery ? 'No customers match your search.' : 'No customers found.'}</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Aadhaar</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr key={customer.customerId}>
                    <td><strong>{customer.customerId}</strong></td>
                    <td>{customer.customername}</td>
                    <td>{customer.customeremail}</td>
                    <td>{customer.customerphone}</td>
                    <td>{customer.customeraadhaar}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '0.375rem 0.5rem' }}
                          onClick={() => handleOpenEdit(customer)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '0.375rem 0.5rem', color: 'var(--danger)', borderColor: 'var(--danger-bg)' }}
                          onClick={() => requestDelete(customer)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormOpen && (
        <CustomerForm 
          initialData={editingCustomer}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
          isLoading={formLoading}
        />
      )}

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
                <AlertCircle size={24} /> Confirm Deletion
              </h2>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete customer <strong>{deleteConfirm.customername}</strong> (ID: {deleteConfirm.customerId})?</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                This action cannot be undone. Associated accounts may be affected.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)} disabled={deleteLoading}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete} disabled={deleteLoading}>
                {deleteLoading ? 'Deleting...' : 'Yes, Delete Customer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
