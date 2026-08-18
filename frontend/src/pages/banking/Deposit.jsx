import React, { useState } from 'react';
import { ArrowDownToLine } from 'lucide-react';
import { transactionApi } from '../../api/transactionApi';

const Deposit = () => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    amount: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const submissionData = {
        accountNumber: parseInt(formData.accountNumber, 10),
        amount: parseInt(formData.amount, 10),
        transactionType: 'deposit'
      };

      await transactionApi.deposit(submissionData);
      
      setSuccess(`Successfully deposited $${submissionData.amount} into account ${submissionData.accountNumber}.`);
      setFormData({ accountNumber: '', amount: '' }); // reset form
    } catch (err) {
      setError('Deposit failed. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="page-header" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', 
            backgroundColor: 'var(--success-bg)', color: 'var(--success)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ArrowDownToLine size={32} />
          </div>
          <h1 className="page-title">Deposit Funds</h1>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Account Number</label>
            <input
              type="number"
              name="accountNumber"
              className="form-control"
              placeholder="Enter destination account number"
              value={formData.accountNumber}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Amount ($)</label>
            <input
              type="number"
              name="amount"
              className="form-control"
              placeholder="Enter amount to deposit"
              value={formData.amount}
              onChange={handleChange}
              disabled={loading}
              required
              min="1"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.75rem', marginTop: '1rem', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Processing Deposit...' : 'Confirm Deposit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Deposit;
