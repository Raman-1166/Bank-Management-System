import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft } from 'lucide-react';
import { transactionApi } from '../../api/transactionApi';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionApi.getHistory();
      
      // Sort by ID descending (newest first, assuming sequential IDs since no date field exists)
      const sorted = (data || []).sort((a, b) => b.transactionId - a.transactionId);
      setTransactions(sorted);
    } catch (err) {
      setError('Failed to load transaction history. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    const t = type?.toLowerCase() || '';
    if (t === 'deposit') return <ArrowDownToLine size={16} className="text-success" />;
    if (t === 'withdraw') return <ArrowUpFromLine size={16} className="text-danger" />;
    if (t === 'transfer') return <ArrowRightLeft size={16} className="text-primary" />;
    return null;
  };

  const getStatusBadge = (status) => {
    if (!status) return <span className="badge badge-success">Completed</span>; // default
    
    const s = status.toLowerCase();
    if (s.includes('success') || s === 'completed') {
      return <span className="badge badge-success">{status}</span>;
    }
    if (s.includes('fail') || s === 'error') {
      return <span className="badge badge-danger">{status}</span>;
    }
    return <span className="badge badge-warning">{status}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <HistoryIcon size={28} />
          Transaction History
        </h1>
        <button className="btn btn-outline" onClick={fetchHistory} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {loading && transactions.length === 0 ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Loading transaction history...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <HistoryIcon size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No transactions found.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Type</th>
                  <th>Account No</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(txn => (
                  <tr key={txn.transactionId}>
                    <td><strong>#{txn.transactionId}</strong></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'capitalize' }}>
                        {getTypeIcon(txn.transactionType)}
                        {txn.transactionType || 'Unknown'}
                      </div>
                    </td>
                    <td>{txn.accountNumber || '-'}</td>
                    <td>{txn.Senderaccount || txn.senderaccount || '-'}</td>
                    <td>{txn.Receiveraccount || txn.receiveraccount || '-'}</td>
                    <td style={{ 
                      fontWeight: 600, 
                      color: txn.transactionType?.toLowerCase() === 'deposit' ? 'var(--success)' : 
                             txn.transactionType?.toLowerCase() === 'withdraw' ? 'var(--danger)' : 'inherit'
                    }}>
                      ${txn.amount}
                    </td>
                    <td>{getStatusBadge(txn.transactionStatus)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
