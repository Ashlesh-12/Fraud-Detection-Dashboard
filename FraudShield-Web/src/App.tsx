import { Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, PieChart, Users, AlertTriangle, ShieldAlert, Search, Bell, Download } from 'lucide-react';
import ExecutiveOverview from './pages/ExecutiveOverview';
import FraudPattern from './pages/FraudPattern';
import AccountAnalysis from './pages/AccountAnalysis';
import RiskMatrix from './pages/RiskMatrix';

function App() {
  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <ShieldAlert size={28} color="var(--accent-danger)" />
          FraudShield
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <LayoutDashboard size={20} /> Executive Overview
          </NavLink>
          <NavLink to="/patterns" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <PieChart size={20} /> Fraud Pattern
          </NavLink>
          <NavLink to="/accounts" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <Users size={20} /> Account Analysis
          </NavLink>
          <NavLink to="/risk-matrix" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <AlertTriangle size={20} /> Risk Matrix
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <div className="content-wrapper">
        
        {/* Top Header / App Bar */}
        <header className="top-bar">
          <div className="search-bar">
            <Search size={18} color="var(--text-muted)" />
            <input type="text" placeholder="Search transactions, accounts..." />
          </div>
          
          <div className="top-bar-actions">
            <div className="action-icon">
              <Bell size={20} />
              <div className="notification-dot"></div>
            </div>
            <div className="avatar">JD</div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ExecutiveOverview />} />
            <Route path="/patterns" element={<FraudPattern />} />
            <Route path="/accounts" element={<AccountAnalysis />} />
            <Route path="/risk-matrix" element={<RiskMatrix />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
