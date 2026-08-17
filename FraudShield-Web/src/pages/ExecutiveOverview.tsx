import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, ShieldAlert, Clock, ChevronRight, X, ShieldCheck, Snowflake } from 'lucide-react';

interface ThreatAlert {
  id: string;
  type: string;
  title: string;
  desc: string;
  amount: number;
  sender: string;
  receiver: string;
  senderOld: number;
  senderNew: number;
  receiverOld: number;
  receiverNew: number;
  hour: number;
  severity: string;
  time: string;
  status: 'Pending' | 'Frozen' | 'Approved';
}

interface TypeData {
  type: string;
  totalCount: number;
  totalAmount: number;
  fraudCount: number;
  fraudAmount: number;
  fraudRate: number;
}

export default function ExecutiveOverview() {
  const [kpisBase, setKpisBase] = useState<any>(null);
  const [typeData, setTypeData] = useState<TypeData[]>([]);
  const [trendDataBase, setTrendDataBase] = useState<any[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<ThreatAlert | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Slicer States
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [timeFilter, setTimeFilter] = useState<string>('All');

  // Simulated Alerts (Labeled as Illustrative Demonstration Layer)
  const [alerts, setAlerts] = useState<ThreatAlert[]>([
    {
      id: 'alert-1',
      type: 'TRANSFER',
      title: 'Transfer Anomaly: Zero-Balance Sender',
      desc: 'Illustrative Alert: Account has initial balance of $0 but is attempting to transfer $450,200.',
      amount: 450200,
      sender: 'C-982181',
      receiver: 'C-109282',
      senderOld: 0,
      senderNew: 0,
      receiverOld: 12000,
      receiverNew: 462200,
      hour: 3,
      severity: 'critical',
      time: 'Just now',
      status: 'Pending'
    },
    {
      id: 'alert-2',
      type: 'CASH_OUT',
      title: 'Cash Out Anomaly: Immediate Cash Out',
      desc: 'Illustrative Alert: CASH_OUT matches inbound transfer amount within a 2-minute window.',
      amount: 185000,
      sender: 'C-772922',
      receiver: 'C-229202',
      senderOld: 185000,
      senderNew: 0,
      receiverOld: 0,
      receiverNew: 0,
      hour: 4,
      severity: 'critical',
      time: '2 mins ago',
      status: 'Pending'
    },
    {
      id: 'alert-3',
      type: 'TRANSFER',
      title: 'Velocity Spike Flagged',
      desc: 'Illustrative Alert: Velocity pattern of 12 sequential transfers from AC-883 in 1 hour.',
      amount: 89000,
      sender: 'AC-883',
      receiver: 'C-382910',
      senderOld: 124000,
      senderNew: 35000,
      receiverOld: 1500,
      receiverNew: 90500,
      hour: 1,
      severity: 'high',
      time: '15 mins ago',
      status: 'Pending'
    },
    {
      id: 'alert-4',
      type: 'TRANSFER',
      title: 'Anomalous Time-Window Activity',
      desc: 'Illustrative Alert: Off-hours transaction executed between 2:00 AM and 6:00 AM.',
      amount: 15400,
      sender: 'C-556102',
      receiver: 'C-920188',
      senderOld: 18500,
      senderNew: 3100,
      receiverOld: 450,
      receiverNew: 15850,
      hour: 2,
      severity: 'warning',
      time: '1 hour ago',
      status: 'Pending'
    }
  ]);

  useEffect(() => {
    fetch('/data/kpis.json')
      .then(res => res.json())
      .then(data => setKpisBase(data));

    fetch('/data/fraud_by_type.json')
      .then(res => res.json())
      .then(data => setTypeData(data));
      
    fetch('/data/fraud_by_hour.json')
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: any, b: any) => a.hour - b.hour);
        setTrendDataBase(sorted);
      });
  }, []);

  // Formatter for Currency / Value according to requirements
  const formatVolume = (val: number) => {
    if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (val: number) => new Intl.NumberFormat().format(val);

  // CSV Report Generator
  const handleExportCSV = () => {
    const headers = ['Alert ID', 'Type', 'Title', 'Description', 'Amount', 'Sender', 'Receiver', 'Severity', 'Status'];
    const rows = alerts.map(a => [
      a.id,
      a.type,
      a.title,
      `"${a.desc.replace(/"/g, '""')}"`,
      a.amount,
      a.sender,
      a.receiver,
      a.severity,
      a.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'paysim_alerts_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Analytical report CSV downloaded successfully!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const closeDrawer = () => setSelectedAlert(null);

  const handleFreezeAccount = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Frozen' } : a));
    if (selectedAlert && selectedAlert.id === alertId) {
      setSelectedAlert(prev => prev ? { ...prev, status: 'Frozen' } : null);
    }
    showToast(`Simulation: Account frozen and lock applied.`);
  };

  const handleApproveTransaction = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    closeDrawer();
    showToast(`Simulation: Transaction approved and cleared.`);
  };

  if (!kpisBase || typeData.length === 0 || trendDataBase.length === 0) {
    return <div className="page-title">Loading PaySim BI Data Model...</div>;
  }

  // --- Real-time Slicer / Filter Engine Logic ---
  // Filters time index (mod 24 hours) based on timeFilter
  const getHourFilterList = (): number[] => {
    if (timeFilter === '00–05') return [0, 1, 2, 3, 4, 5];
    if (timeFilter === '06–11') return [6, 7, 8, 9, 10, 11];
    if (timeFilter === '12–17') return [12, 13, 14, 15, 16, 17];
    if (timeFilter === '18–23') return [18, 19, 20, 21, 22, 23];
    return Array.from({ length: 24 }, (_, i) => i);
  };

  const filteredHours = getHourFilterList();

  // Filter trend lines
  const displayTrendData = trendDataBase
    .filter(d => filteredHours.includes(d.hour))
    .map(d => {
      // Apply status and type filters to trend points where possible
      let total = d.totalCount;
      let fraud = d.fraudCount;

      if (typeFilter !== 'All') {
        const typeRatio = typeData.find(t => t.type === typeFilter);
        const ratio = typeRatio ? (typeRatio.totalCount / kpisBase.totalTransactions) : 1;
        const fraudRatio = typeRatio ? (typeRatio.fraudCount / kpisBase.fraudTransactions) : 1;
        total = Math.round(total * ratio);
        fraud = Math.round(fraud * fraudRatio);
      }

      if (statusFilter === 'Fraud') {
        total = fraud;
      } else if (statusFilter === 'Legitimate') {
        total = Math.max(0, total - fraud);
        fraud = 0;
      }

      return {
        ...d,
        totalCount: total,
        fraudCount: fraud
      };
    });

  // Calculate Dynamic KPIs based on Slicers
  let totalTransactions = kpisBase.totalTransactions;
  let totalAmount = kpisBase.totalAmount;
  let fraudTransactions = kpisBase.fraudTransactions;
  let fraudAmount = kpisBase.fraudAmount;
  let fraudRate = 0;

  // 1. Apply Type Slicer
  if (typeFilter !== 'All') {
    const selectedTypeInfo = typeData.find(t => t.type === typeFilter);
    if (selectedTypeInfo) {
      totalTransactions = selectedTypeInfo.totalCount;
      totalAmount = selectedTypeInfo.totalAmount;
      fraudTransactions = selectedTypeInfo.fraudCount;
      fraudAmount = selectedTypeInfo.fraudAmount;
    }
  }

  // 2. Apply Time Hour Slicer
  if (timeFilter !== 'All') {
    const activeHoursData = trendDataBase.filter(d => filteredHours.includes(d.hour));
    const totalHoursCount = activeHoursData.reduce((sum, h) => sum + h.totalCount, 0);
    const fraudHoursCount = activeHoursData.reduce((sum, h) => sum + h.fraudCount, 0);
    
    // Scale total metrics based on hour distributions
    const totalRatio = totalHoursCount / kpisBase.totalTransactions;
    const fraudRatio = kpisBase.fraudTransactions > 0 ? (fraudHoursCount / kpisBase.fraudTransactions) : 0;

    totalTransactions = Math.round(totalTransactions * totalRatio);
    totalAmount = totalAmount * totalRatio;
    fraudTransactions = Math.round(fraudTransactions * fraudRatio);
    fraudAmount = fraudAmount * fraudRatio;
  }

  // 3. Apply Fraud Status Slicer
  if (statusFilter === 'Fraud') {
    totalTransactions = fraudTransactions;
    totalAmount = fraudAmount;
    fraudRate = 100;
  } else if (statusFilter === 'Legitimate') {
    totalTransactions = Math.max(0, totalTransactions - fraudTransactions);
    totalAmount = Math.max(0, totalAmount - fraudAmount);
    fraudTransactions = 0;
    fraudAmount = 0;
    fraudRate = 0;
  } else {
    fraudRate = totalTransactions > 0 ? (fraudTransactions / totalTransactions) * 100 : 0;
  }

  // Active Alerts filtering for demonstration
  const activeAlerts = alerts.filter(a => a.status !== 'Approved');

  return (
    <div className="animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#1E293B',
          color: 'white',
          padding: '0.75rem 1.25rem',
          borderRadius: '0.25rem',
          boxShadow: 'var(--shadow-md)',
          zIndex: 1000,
          fontWeight: '600',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          borderLeft: '4px solid var(--accent-success)',
          animation: 'fadeIn 0.2s ease'
        }}>
          <ShieldCheck size={16} color="var(--accent-success)" />
          {toastMessage}
        </div>
      )}

      {/* Report Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.65rem', fontWeight: 800 }}>Fraud Detection Executive Overview</h1>
          <p className="page-subtitle" style={{ fontSize: '0.85rem' }}>PaySim transaction and fraud intelligence dashboard</p>
        </div>
        <button className="btn btn-primary" onClick={handleExportCSV}>
          <Download size={16} /> Export Slicer Data
        </button>
      </div>

      {/* BI Slicers / Filters Bar */}
      <div className="slicers-bar">
        <div className="slicer-box">
          <label>Transaction Type</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All Types</option>
            <option value="TRANSFER">TRANSFER</option>
            <option value="CASH_OUT">CASH_OUT</option>
            <option value="CASH_IN">CASH_IN</option>
            <option value="PAYMENT">PAYMENT</option>
            <option value="DEBIT">DEBIT</option>
          </select>
        </div>

        <div className="slicer-box">
          <label>Fraud Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Transactions</option>
            <option value="Fraud">Fraudulent Only</option>
            <option value="Legitimate">Legitimate Only</option>
          </select>
        </div>

        <div className="slicer-box">
          <label>Time Slicer (Hour Range)</label>
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
            <option value="All">Full 24-Hours</option>
            <option value="00–05">Night (00:00 - 05:00)</option>
            <option value="06–11">Morning (06:00 - 11:00)</option>
            <option value="12–17">Afternoon (12:00 - 17:00)</option>
            <option value="18–23">Evening (18:00 - 23:00)</option>
          </select>
        </div>
      </div>
      
      {/* 5 KPI Cards Grid */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div className="kpi-card">
          <div className="kpi-title">Total Transactions</div>
          <div className="kpi-value" style={{ fontSize: '1.5rem' }}>{formatNumber(totalTransactions)}</div>
          <div className="kpi-card-subtitle">Active database transaction count</div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-title">Transaction Value</div>
          <div className="kpi-value" style={{ fontSize: '1.5rem' }}>{formatVolume(totalAmount)}</div>
          <div className="kpi-card-subtitle">Accumulated volume value</div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-title" style={{ color: 'var(--accent-danger)' }}>Fraud Cases</div>
          <div className="kpi-value danger" style={{ fontSize: '1.5rem' }}>{formatNumber(fraudTransactions)}</div>
          <div className="kpi-card-subtitle">Flagged isFraud cases</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title" style={{ color: 'var(--accent-danger)' }}>Fraud Value</div>
          <div className="kpi-value danger" style={{ fontSize: '1.5rem' }}>{formatVolume(fraudAmount)}</div>
          <div className="kpi-card-subtitle">SUM(amount) where isFraud = 1</div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-title" style={{ color: 'var(--accent-danger)' }}>Fraud Rate</div>
          <div className="kpi-value danger" style={{ fontSize: '1.5rem' }}>{fraudRate.toFixed(4)}%</div>
          <div className="kpi-card-subtitle">Percentage of total transactions</div>
        </div>
      </div>

      {/* Key Insights Callout Block */}
      <div className="insights-section">
        <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
          Data-Driven Key Insights
        </h4>
        <div className="insights-grid">
          <div className="insight-card danger">
            <div className="insight-header">Strict Concentration</div>
            <div className="insight-text">
              Fraudulent behavior is strictly limited to <strong>TRANSFER</strong> and <strong>CASH_OUT</strong> types. CASH_IN, PAYMENT, and DEBIT categories represent safe zones.
            </div>
          </div>
          <div className="insight-card danger">
            <div className="insight-header">High-Value Concentration</div>
            <div className="insight-text">
              Transactions of type <strong>CASH_OUT</strong> exceeding <strong>$1M</strong> exhibit a high fraud rate of <strong>81.61%</strong>.
            </div>
          </div>
          <div className="insight-card warning">
            <div className="insight-header">Off-Hours Spikes</div>
            <div className="insight-text">
              Fraudulent cases show strong density spikes during early morning hours (2:00 AM - 6:00 AM), representing automated cashout scripts.
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="dashboard-layout" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Charts block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-card">
            <div className="card-header" style={{ padding: '0', marginBottom: '0.5rem' }}>
              <h3 className="card-title" style={{ fontSize: '0.9rem', fontWeight: '800' }}>Fraud Volume Impact vs Case Count by Type</h3>
            </div>
            <div style={{ display: 'flex', gap: '1rem', height: '240px' }}>
              <ResponsiveContainer width="50%" height="100%">
                <BarChart data={typeData.filter(t => t.fraudCount > 0)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="type" stroke="var(--text-muted)" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                    itemStyle={{ fontSize: '11px', color: 'var(--text-primary)' }}
                  />
                  <Bar dataKey="fraudCount" name="Fraud Cases" fill="var(--accent-primary)" radius={[2, 2, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="50%" height="100%">
                <BarChart data={typeData.filter(t => t.fraudAmount > 0)} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="type" stroke="var(--text-muted)" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" tick={{fontSize: 10}} tickFormatter={(v) => `$${(v / 1e9).toFixed(1)}B`} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                    formatter={(val: any) => formatVolume(val)}
                    itemStyle={{ fontSize: '11px', color: 'var(--text-primary)' }}
                  />
                  <Bar dataKey="fraudAmount" name="Fraud Value" fill="var(--accent-danger)" radius={[2, 2, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              <span>Figure 1A: Case Count Distribution</span>
              <span>Figure 1B: Financial Value Loss Impact</span>
            </div>
          </div>

          <div className="glass-card">
            <div className="card-header" style={{ padding: '0', marginBottom: '0.5rem' }}>
              <h3 className="card-title" style={{ fontSize: '0.9rem', fontWeight: '800' }}>24-Hour Fraud Case Trend Line</h3>
            </div>
            <div className="chart-container" style={{ height: '220px', marginTop: '0.5rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="hour" stroke="var(--text-muted)" tickFormatter={(t) => `${t}:00`} tick={{fontSize: 10}} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" tick={{fontSize: 10}} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                    itemStyle={{ fontSize: '11px', color: 'var(--text-primary)' }}
                  />
                  <Line type="monotone" dataKey="fraudCount" name="Fraud Cases" stroke="var(--accent-danger)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right side alerts list */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header" style={{ padding: '0', marginBottom: '1rem' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
              <ShieldAlert size={18} color="var(--accent-danger)" /> Investigation Alerts
            </h3>
            <span className="badge low" style={{ fontSize: '0.65rem' }}>Simulated Layer</span>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
            Investigation cases representing standard fraud behavior. Actions are simulated.
          </p>
          
          <div className="alerts-list" style={{ flex: 1, overflowY: 'auto' }}>
            {activeAlerts.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0', fontSize: '0.85rem' }}>
                All alerts approved/resolved.
              </div>
            ) : (
              activeAlerts.map(alert => (
                <div 
                  key={alert.id} 
                  className="alert-item"
                  onClick={() => setSelectedAlert(alert)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.25rem',
                    borderLeft: alert.status === 'Frozen' ? '3px solid var(--accent-primary)' : '1px solid var(--border-color)'
                  }}
                >
                  <div className="alert-content">
                    <div className="alert-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: '700' }}>
                      {alert.sender} &rarr; {alert.receiver}
                      {alert.status === 'Frozen' && (
                        <span className="badge medium" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', gap: '0.2rem' }}>
                          <Snowflake size={8} /> Frozen
                        </span>
                      )}
                    </div>
                    <div className="alert-desc" style={{ fontSize: '0.75rem', margin: '4px 0' }}>{alert.title}</div>
                    <div className="alert-time" style={{ fontSize: '0.65rem' }}><Clock size={10} /> Amount: {formatVolume(alert.amount)}</div>
                  </div>
                  <ChevronRight size={14} color="var(--text-muted)" className="alert-chevron" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Slide-out details drawer */}
      {selectedAlert && (
        <div className="drawer-backdrop" onClick={closeDrawer}>
          <div className="drawer" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '0.25rem 0 0 0.25rem' }}>
            <div className="drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={18} color="var(--accent-danger)" />
                <h3 style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)' }}>Simulated Audit Log</h3>
              </div>
              <button className="close-btn" onClick={closeDrawer}><X size={18} /></button>
            </div>

            <div className="drawer-body">
              <div>
                <span className={`badge ${selectedAlert.severity === 'critical' ? 'critical' : 'high'}`} style={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
                  {selectedAlert.severity} Severity
                </span>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '800', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
                  {selectedAlert.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {selectedAlert.desc}
                </p>
              </div>

              {/* Forensic Money Flow SVG */}
              <div>
                <h4 style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                  Simulated Funds Route
                </h4>
                <div className="flow-diagram">
                  <div className="flow-node">
                    <div className="flow-node-icon danger">{selectedAlert.sender}</div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
                      Sender
                    </span>
                  </div>

                  <div className="flow-arrow">
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-danger)' }}>
                      {formatVolume(selectedAlert.amount)}
                    </span>
                    <div className="flow-arrow-line danger"></div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {selectedAlert.type}
                    </span>
                  </div>

                  <div className="flow-node">
                    <div className="flow-node-icon">{selectedAlert.receiver}</div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
                      Recipient
                    </span>
                  </div>
                </div>
              </div>

              {/* Forensic Ledger Data Table */}
              <div>
                <h4 style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                  Simulated Ledger Auditing
                </h4>
                <table className="risk-matrix" style={{ fontSize: '0.8rem' }}>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: '600', width: '45%' }}>Sender Old Balance</td>
                      <td style={{ color: 'var(--text-secondary)' }}>${selectedAlert.senderOld.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: '600' }}>Sender New Balance</td>
                      <td style={{ color: 'var(--text-secondary)' }}>${selectedAlert.senderNew.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: '600' }}>Recipient Old Balance</td>
                      <td style={{ color: 'var(--text-secondary)' }}>${selectedAlert.receiverOld.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: '600' }}>Recipient New Balance</td>
                      <td style={{ color: 'var(--text-secondary)' }}>${selectedAlert.receiverNew.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: '600' }}>Time Category</td>
                      <td style={{ color: 'var(--text-secondary)' }}>Hour {selectedAlert.hour}:00</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: '600' }}>Status</td>
                      <td>
                        <span className={`badge ${selectedAlert.status === 'Frozen' ? 'medium' : 'critical'}`} style={{ fontSize: '0.7rem' }}>
                          {selectedAlert.status}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="drawer-footer">
              {selectedAlert.status !== 'Frozen' && (
                <button 
                  className="btn btn-outline" 
                  onClick={() => handleFreezeAccount(selectedAlert.id)}
                  style={{ flex: 1, justifyContent: 'center', borderColor: 'var(--accent-danger)', color: 'var(--accent-danger)' }}
                >
                  Freeze Account
                </button>
              )}
              <button 
                className="btn btn-primary" 
                onClick={() => handleApproveTransaction(selectedAlert.id)}
                style={{ flex: 1, justifyContent: 'center', backgroundColor: 'var(--accent-success)', boxShadow: 'none' }}
              >
                Approve Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
