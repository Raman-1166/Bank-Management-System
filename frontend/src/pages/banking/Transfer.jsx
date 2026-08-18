import React, { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { transactionApi } from '../../api/transactionApi';
import { accountApi } from '../../api/accountApi';
import { customerApi } from '../../api/customerApi';

const Transfer = () => {
  const [formData, setFormData] = useState({
    senderaccount: '',
    receiveraccount: '',
    amount: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Sender details lookup state
  const [senderDetails, setSenderDetails] = useState(null);
  const [senderLoading, setSenderLoading] = useState(false);
  const [senderError, setSenderError] = useState(null);

  // Receiver details lookup state
  const [receiverDetails, setReceiverDetails] = useState(null);
  const [receiverLoading, setReceiverLoading] = useState(false);
  const [receiverError, setReceiverError] = useState(null);

  // Live Sender account lookup with debounce
  useEffect(() => {
    if (!formData.senderaccount) {
      setSenderDetails(null);
      setSenderError(null);
      setSenderLoading(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSenderLoading(true);
      setSenderError(null);
      try {
        const accountNum = parseInt(formData.senderaccount, 10);
        if (isNaN(accountNum)) {
          throw new Error('Invalid account number');
        }
        const account = await accountApi.getByAccountNumber(accountNum);
        if (!account) {
          throw new Error('Account not found');
        }

        let customerName = 'Unknown Customer';
        try {
          const customer = await customerApi.getById(account.customerid);
          if (customer && customer.customername) {
            customerName = customer.customername;
          }
        } catch (e) {
          console.error("Failed to fetch customer name", e);
        }

        setSenderDetails({
          accountNumber: account.accountNumber,
          balance: account.balance,
          accountType: account.accounttype,
          customerName: customerName
        });
      } catch (err) {
        setSenderDetails(null);
        setSenderError('Sender account not found or invalid.');
      } finally {
        setSenderLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [formData.senderaccount]);

  // Live Receiver account lookup with debounce
  useEffect(() => {
    if (!formData.receiveraccount) {
      setReceiverDetails(null);
      setReceiverError(null);
      setReceiverLoading(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setReceiverLoading(true);
      setReceiverError(null);
      try {
        const accountNum = parseInt(formData.receiveraccount, 10);
        if (isNaN(accountNum)) {
          throw new Error('Invalid account number');
        }
        const account = await accountApi.getByAccountNumber(accountNum);
        if (!account) {
          throw new Error('Account not found');
        }

        let customerName = 'Unknown Customer';
        try {
          const customer = await customerApi.getById(account.customerid);
          if (customer && customer.customername) {
            customerName = customer.customername;
          }
        } catch (e) {
          console.error("Failed to fetch customer name", e);
        }

        setReceiverDetails({
          accountNumber: account.accountNumber,
          accountType: account.accounttype,
          customerName: customerName
        });
      } catch (err) {
        setReceiverDetails(null);
        setReceiverError('Receiver account not found or invalid.');
      } finally {
        setReceiverLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [formData.receiveraccount]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const amountVal = formData.amount ? parseInt(formData.amount, 10) : 0;
  const isSenderInsufficient = senderDetails && amountVal > senderDetails.balance;
  const isSenderEmptyBalance = senderDetails && senderDetails.balance <= 0;
  const isSameAccount = formData.senderaccount && formData.receiveraccount && formData.senderaccount === formData.receiveraccount;

  const isSubmitDisabled = 
    loading ||
    senderLoading ||
    receiverLoading ||
    !!senderError ||
    !!receiverError ||
    !senderDetails ||
    !receiverDetails ||
    isSenderInsufficient ||
    isSenderEmptyBalance ||
    isSameAccount ||
    !formData.amount ||
    amountVal <= 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSameAccount) {
      setError('Sender and Receiver accounts cannot be the same.');
      return;
    }

    if (isSenderInsufficient || isSenderEmptyBalance) {
      setError('Transfer failed: Insufficient balance in sender account.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const submissionData = {
        Senderaccount: parseInt(formData.senderaccount, 10),
        Receiveraccount: parseInt(formData.receiveraccount, 10),
        senderaccount: parseInt(formData.senderaccount, 10),
        receiveraccount: parseInt(formData.receiveraccount, 10),
        amount: amountVal,
        transactionType: 'transfer'
      };

      await transactionApi.transfer(submissionData);
      
      setSuccess(`Successfully transferred $${submissionData.amount} from account ${submissionData.Senderaccount} (${senderDetails.customerName}) to ${submissionData.Receiveraccount} (${receiverDetails.customerName}).`);
      setFormData({ senderaccount: '', receiveraccount: '', amount: '' }); // reset form
      setSenderDetails(null);
      setReceiverDetails(null);
    } catch (err) {
      const data = err.response?.data;
      let serverMsg = data?.message;
      if (!serverMsg && data?.error) {
        serverMsg = `${data.error} (Insufficient Balance or Invalid Account Number)`;
      }
      if (!serverMsg) {
        serverMsg = err.message;
      }
      setError('Transfer failed: ' + serverMsg);
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
            backgroundColor: '#e0e7ff', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ArrowRightLeft size={32} />
          </div>
          <h1 className="page-title">Transfer Funds</h1>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Sender Account Number</label>
            <input
              type="number"
              name="senderaccount"
              className="form-control"
              placeholder="Enter source account number"
              value={formData.senderaccount}
              onChange={handleChange}
              disabled={loading}
              required
              style={{
                borderColor: senderError ? 'var(--danger)' : (senderDetails ? 'var(--success)' : 'var(--border-color)'),
                transition: 'border-color 0.2s ease'
              }}
            />
            {senderLoading && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Verifying account...</div>}
            {senderError && <div style={{ fontSize: '0.85rem', color: 'var(--danger)', marginTop: '0.25rem' }}>{senderError}</div>}
            {senderDetails && (
              <div style={{ 
                fontSize: '0.85rem', 
                backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                color: '#047857', 
                padding: '0.35rem 0.75rem', 
                borderRadius: 'var(--radius-md)', 
                marginTop: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: '500'
              }}>
                <span>👤 Owner: {senderDetails.customerName}</span>
                <span>💰 Balance: ${senderDetails.balance} ({senderDetails.accountType})</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Receiver Account Number</label>
            <input
              type="number"
              name="receiveraccount"
              className="form-control"
              placeholder="Enter destination account number"
              value={formData.receiveraccount}
              onChange={handleChange}
              disabled={loading}
              required
              style={{
                borderColor: receiverError ? 'var(--danger)' : (receiverDetails ? 'var(--success)' : 'var(--border-color)'),
                transition: 'border-color 0.2s ease'
              }}
            />
            {receiverLoading && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Verifying account...</div>}
            {receiverError && <div style={{ fontSize: '0.85rem', color: 'var(--danger)', marginTop: '0.25rem' }}>{receiverError}</div>}
            {receiverDetails && (
              <div style={{ 
                fontSize: '0.85rem', 
                backgroundColor: 'rgba(37, 99, 235, 0.1)', 
                color: '#1d4ed8', 
                padding: '0.35rem 0.75rem', 
                borderRadius: 'var(--radius-md)', 
                marginTop: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: '500'
              }}>
                <span>👤 Recipient: {receiverDetails.customerName}</span>
                <span>Type: {receiverDetails.accountType}</span>
              </div>
            )}
            {isSameAccount && (
              <div style={{ fontSize: '0.85rem', color: 'var(--danger)', marginTop: '0.25rem' }}>
                Sender and Receiver accounts cannot be the same.
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Amount ($)</label>
            <input
              type="number"
              name="amount"
              className="form-control"
              placeholder="Enter amount to transfer"
              value={formData.amount}
              onChange={handleChange}
              disabled={loading}
              required
              min="1"
              style={{
                borderColor: isSenderInsufficient ? 'var(--danger)' : 'var(--border-color)',
                transition: 'border-color 0.2s ease'
              }}
            />
            {isSenderInsufficient && (
              <div style={{ fontSize: '0.85rem', color: 'var(--danger)', marginTop: '0.25rem', fontWeight: '500' }}>
                ❌ Insufficient balance! The sender account only has a balance of ${senderDetails.balance}.
              </div>
            )}
            {isSenderEmptyBalance && (
              <div style={{ fontSize: '0.85rem', color: 'var(--danger)', marginTop: '0.25rem', fontWeight: '500' }}>
                ❌ The sender account has no funds (Balance is $0).
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.75rem', marginTop: '1rem', fontSize: '1rem' }}
            disabled={isSubmitDisabled}
          >
            {loading ? 'Processing Transfer...' : 'Confirm Transfer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Transfer;
