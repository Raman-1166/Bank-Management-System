import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/customers/Customers';
import Accounts from './pages/accounts/Accounts';
import Deposit from './pages/banking/Deposit';
import Withdraw from './pages/banking/Withdraw';
import Transfer from './pages/banking/Transfer';
import History from './pages/banking/History';

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="banking">
            <Route path="deposit" element={<Deposit />} />
            <Route path="withdraw" element={<Withdraw />} />
            <Route path="transfer" element={<Transfer />} />
            <Route path="history" element={<History />} />
          </Route>
        </Route>
      </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
