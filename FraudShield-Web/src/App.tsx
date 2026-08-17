import { useEffect, useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, PieChart, Users, AlertTriangle, ShieldAlert, Sun, Moon, Terminal } from 'lucide-react';
import ExecutiveOverview from './pages/ExecutiveOverview';
import FraudPattern from './pages/FraudPattern';
import AccountAnalysis from './pages/AccountAnalysis';
import RiskMatrix from './pages/RiskMatrix';
import Sandbox from './pages/Sandbox';

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark'; // Default to light mode (false) unless explicitly dark
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <ShieldAlert size={28} color="var(--accent-primary)" />
          FraudShield
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <LayoutDashboard size={20} /> Executive Overview
          </NavLink>
          <NavLink to="/patterns" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <PieChart size={20} /> Fraud Patterns
          </NavLink>
          <NavLink to="/accounts" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <Users size={20} /> Account Analysis
          </NavLink>
          <NavLink to="/risk-matrix" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <AlertTriangle size={20} /> Risk Matrix
          </NavLink>
          <NavLink to="/sandbox" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <Terminal size={20} /> Risk Simulation
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <div className="content-wrapper">
        
        {/* Top Header / App Bar */}
        <header className="top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.25rem 0.5rem', background: 'var(--bg-main)', color: 'var(--text-secondary)', borderRadius: '0.25rem' }}>
              PaySim Dashboard
            </span>
          </div>
          
          <div className="top-bar-actions">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="close-btn" 
              title="Toggle Dark Mode"
              style={{ color: 'var(--text-secondary)' }}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="avatar">BI</div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ExecutiveOverview />} />
            <Route path="/patterns" element={<FraudPattern />} />
            <Route path="/accounts" element={<AccountAnalysis />} />
            <Route path="/risk-matrix" element={<RiskMatrix />} />
            <Route path="/sandbox" element={<Sandbox />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
