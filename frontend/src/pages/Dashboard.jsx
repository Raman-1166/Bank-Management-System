import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, History, ArrowRightLeft, CreditCard } from 'lucide-react';
import { customerApi } from '../api/customerApi';
import { transactionApi } from '../api/transactionApi';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalTransactions: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const results = await Promise.allSettled([
          customerApi.getAll(),
          transactionApi.getHistory()
        ]);

        const customersRes = results[0];
        const transactionsRes = results[1];

        let customerCount = 0;
        let transactionCount = 0;
        let recent = [];
        let hasError = false;

        if (customersRes.status === 'fulfilled') {
          customerCount = customersRes.value?.length || 0;
        } else {
          hasError = true;
        }

        if (transactionsRes.status === 'fulfilled') {
          const transactions = transactionsRes.value || [];
          transactionCount = transactions.length;
          const sorted = [...transactions].sort((a, b) => b.transactionId - a.transactionId);
          recent = sorted.slice(0, 5);
        } else {
          hasError = true;
        }

        setStats({
          totalCustomers: customerCount,
          totalTransactions: transactionCount,
          recentTransactions: recent
        });

        if (hasError && customersRes.status === 'rejected' && transactionsRes.status === 'rejected') {
          setError('Unable to connect to the backend server. Please verify your Spring Boot backend is running on http://localhost:8080.');
        }
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome back, Admin</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Customers</h3>
            <p>{stats.totalCustomers}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <History size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Transactions</h3>
            <p>{stats.totalTransactions}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Quick Actions</h3>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
            <button className="btn btn-primary" onClick={() => navigate('/customers')} style={{ padding: '1rem' }}>
              <Users size={20} />
              Manage Customers
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/accounts')} style={{ padding: '1rem' }}>
              <CreditCard size={20} />
              Manage Accounts
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/banking/deposit')} style={{ padding: '1rem' }}>
              <ArrowRightLeft size={20} />
              Make a Deposit
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/banking/transfer')} style={{ padding: '1rem' }}>
              <ArrowRightLeft size={20} />
              Transfer Money
            </button>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Recent Transactions</h3>
          {stats.recentTransactions.length === 0 ? (
            <p className="text-secondary">No recent transactions found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.recentTransactions.map((tx) => (
                <div key={tx.transactionId} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  <div>
                    <div style={{ fontWeight: 500, textTransform: 'capitalize' }}>{tx.transactionType}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Txn ID: {tx.transactionId} {tx.accountNumber ? `| Acc: ${tx.accountNumber}` : ''}
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: 600,
                    color: tx.transactionType === 'deposit' ? 'var(--success)' : 
                           tx.transactionType === 'withdraw' ? 'var(--danger)' : 'var(--text-primary)'
                  }}>
                    {tx.transactionType === 'withdraw' ? '-' : '+'}${tx.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
