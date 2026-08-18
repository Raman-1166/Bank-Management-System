import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowRightLeft,
  History,
  Building2
} from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.includes('customers')) return 'Customer Management';
    if (path.includes('accounts')) return 'Account Management';
    if (path.includes('deposit')) return 'Deposit Money';
    if (path.includes('withdraw')) return 'Withdraw Money';
    if (path.includes('transfer')) return 'Transfer Money';
    if (path.includes('history')) return 'Transaction History';
    return 'Bank Management System';
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Building2 size={24} className="text-primary" />
          <span>Admin Portal</span>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-group-title">Main</div>
          <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          
          <NavLink to="/customers" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            Customers
          </NavLink>
          
          <NavLink to="/accounts" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <CreditCard size={20} />
            Accounts
          </NavLink>

          <div className="nav-group-title">Banking Operations</div>
          
          <NavLink to="/banking/deposit" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <ArrowDownToLine size={20} />
            Deposit
          </NavLink>
          
          <NavLink to="/banking/withdraw" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <ArrowUpFromLine size={20} />
            Withdraw
          </NavLink>
          
          <NavLink to="/banking/transfer" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <ArrowRightLeft size={20} />
            Transfer
          </NavLink>
          
          <NavLink to="/banking/history" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <History size={20} />
            History
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="page-title" style={{ fontSize: '1.25rem' }}>
            {getPageTitle()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>System Administrator</span>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              A
            </div>
          </div>
        </header>
        
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
