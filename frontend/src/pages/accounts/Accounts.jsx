import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, AlertCircle, CreditCard } from 'lucide-react';
import { accountApi } from '../../api/accountApi';
import AccountForm from './AccountForm';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  
  const [searchType, setSearchType] = useState('customerId'); // 'customerId' or 'accountNo'
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    try {
      setLoading(true);
      setError(null);
      setAccounts([]);
      setHasSearched(true);
      
      let data;
      if (searchType === 'customerId') {
        data = await accountApi.getByCustomerId(searchQuery);
        // The API returns a list of accounts
        setAccounts(Array.isArray(data) ? data : [data]);
      } else {
        data = await accountApi.getByAccountNumber(searchQuery);
        // The API returns a single account
        setAccounts(data ? [data] : []);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // Just empty results, not necessarily an error to display a big red banner for
        setAccounts([]);
      } else {
        setError('Failed to search accounts. ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshSearch = async () => {
    if (hasSearched && searchQuery) {
      try {
        let data;
        if (searchType === 'customerId') {
          data = await accountApi.getByCustomerId(searchQuery);
          setAccounts(Array.isArray(data) ? data : [data]);
        } else {
          data = await accountApi.getByAccountNumber(searchQuery);
          setAccounts(data ? [data] : []);
        }
      } catch (err) {
        if (err.response?.status === 404) setAccounts([]);
      }
    }
  };

  const handleOpenAdd = () => {
    setEditingAccount(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (account) => {
    setEditingAccount(account);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAccount(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError(null);
      
      if (editingAccount) {
        await accountApi.update(formData);
        showSuccess('Account updated successfully');
      } else {
        await accountApi.create(formData);
        showSuccess('Account added successfully');
      }
      
      handleCloseForm();
      // If we added/updated, try to refresh our search results if they match
      if (hasSearched) {
        if (searchType === 'customerId' && parseInt(searchQuery) === formData.customerid) {
          refreshSearch();
        } else if (searchType === 'accountNo' && parseInt(searchQuery) === formData.accountNumber) {
          refreshSearch();
        }
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message || 'Operation failed'));
    } finally {
      setFormLoading(false);
    }
  };

  const requestDelete = (account) => {
    setDeleteConfirm(account);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await accountApi.delete(deleteConfirm.accountNumber);
      showSuccess('Account deleted successfully');
      setDeleteConfirm(null);
      
      // Remove from current list visually
      setAccounts(accounts.filter(a => a.accountNumber !== deleteConfirm.accountNumber));
    } catch (err) {
      alert('Failed to delete account: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Account Management</h1>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} />
          Add Account
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
          <select 
            className="form-control" 
            style={{ width: '200px', marginBottom: 0 }}
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="customerId">Customer ID</option>
            <option value="accountNo">Account Number</option>
          </select>
          
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="number"
              className="form-control"
              style={{ marginBottom: 0, paddingLeft: '2.5rem' }}
              placeholder={`Enter ${searchType === 'customerId' ? 'Customer ID' : 'Account Number'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {!hasSearched ? (
          <div className="empty-state">
            <Search size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>Search for accounts by Customer ID or Account Number.</p>
          </div>
        ) : loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Searching accounts...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="empty-state">
            <CreditCard size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No accounts found matching your search criteria.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Account No</th>
                  <th>Customer ID</th>
                  <th>Type</th>
                  <th>Balance ($)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map(account => (
                  <tr key={account.accountNumber}>
                    <td><strong>{account.accountNumber}</strong></td>
                    <td>{account.customerid}</td>
                    <td>
                      <span className="badge badge-info" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
                        {account.accounttype}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--success)' }}>
                      ${account.balance}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '0.375rem 0.5rem' }}
                          onClick={() => handleOpenEdit(account)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '0.375rem 0.5rem', color: 'var(--danger)', borderColor: 'var(--danger-bg)' }}
                          onClick={() => requestDelete(account)}
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
        <AccountForm 
          initialData={editingAccount}
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
              <p>Are you sure you want to delete Account <strong>{deleteConfirm.accountNumber}</strong>?</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                This action cannot be undone and will permanently remove this account.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)} disabled={deleteLoading}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete} disabled={deleteLoading}>
                {deleteLoading ? 'Deleting...' : 'Yes, Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
