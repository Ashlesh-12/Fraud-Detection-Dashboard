import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, DollarSign, Activity, AlertOctagon, Download, ShieldAlert, Clock, ChevronRight } from 'lucide-react';

export default function ExecutiveOverview() {
  const [kpis, setKpis] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/data/kpis.json')
      .then(res => res.json())
      .then(data => setKpis(data));
      
    fetch('/data/fraud_by_hour.json')
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: any, b: any) => a.hour - b.hour);
        setTrendData(sorted);
      });
  }, []);

  const formatCurrency = (val: number) => `$${(val / 1000000).toFixed(2)}M`;
  const formatNumber = (val: number) => new Intl.NumberFormat().format(val);

  if (!kpis) return <div className="page-title animate-fade-in">Loading Data...</div>;

  return (
    <div>
      <div className="page-header animate-fade-in">
        <div>
          <h1 className="page-title">Executive Overview</h1>
          <p className="page-subtitle">Real-time financial transaction and fraud monitoring.</p>
        </div>
        <button className="btn btn-primary">
          <Download size={16} /> Export Report
        </button>
      </div>
      
      <div className="kpi-grid">
        <div className="kpi-card animate-fade-in delay-1">
          <div className="kpi-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
            Total Transactions <Activity size={16} />
          </div>
          <div className="kpi-value">{formatNumber(kpis.totalTransactions)}</div>
        </div>
        
        <div className="kpi-card animate-fade-in delay-2">
          <div className="kpi-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
            Total Volume <DollarSign size={16} />
          </div>
          <div className="kpi-value">{formatCurrency(kpis.totalAmount)}</div>
        </div>
        
        <div className="kpi-card animate-fade-in delay-3">
          <div className="kpi-title" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-danger)' }}>
            Fraud Cases <AlertOctagon size={16} />
          </div>
          <div className="kpi-value danger">{formatNumber(kpis.fraudTransactions)}</div>
        </div>
        
        <div className="kpi-card animate-fade-in delay-3">
          <div className="kpi-title" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-danger)' }}>
            Fraud Rate <ArrowUpRight size={16} />
          </div>
          <div className="kpi-value danger">{kpis.fraudRate.toFixed(4)}%</div>
        </div>
      </div>

      <div className="dashboard-layout animate-fade-in delay-2">
        <div className="glass-card">
          <div className="card-header">
            <h3 className="card-title">24-Hour Fraud Detection Trend</h3>
          </div>
          <div className="chart-container" style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-danger)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent-danger)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="hour" stroke="var(--text-muted)" tickFormatter={(t) => `${t}:00`} tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}
                  labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
                  itemStyle={{ color: 'var(--text-primary)', fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="fraudCount" name="Fraudulent Transactions" stroke="var(--accent-danger)" strokeWidth={3} fillOpacity={1} fill="url(#colorFraud)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New Meaningful Feature: Live Alerts Feed */}
        <div className="glass-card alerts-feed">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} color="var(--accent-danger)" /> Live Threat Alerts
            </h3>
            <span className="badge critical">4 New</span>
          </div>
          
          <div className="alerts-list">
            <div className="alert-item">
              <div className="alert-icon critical"></div>
              <div className="alert-content">
                <div className="alert-title">Critical: Zero-Balance Transfer</div>
                <div className="alert-desc">Anomalous transfer of $450,200 detected.</div>
                <div className="alert-time"><Clock size={12} /> Just now</div>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" className="alert-chevron" />
            </div>
            
            <div className="alert-item">
              <div className="alert-icon critical"></div>
              <div className="alert-content">
                <div className="alert-title">Critical: Immediate Cash Out</div>
                <div className="alert-desc">Suspicious withdrawal matching inbound transfer.</div>
                <div className="alert-time"><Clock size={12} /> 2 mins ago</div>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" className="alert-chevron" />
            </div>

            <div className="alert-item">
              <div className="alert-icon high"></div>
              <div className="alert-content">
                <div className="alert-title">High: Velocity Spike</div>
                <div className="alert-desc">Account AC-883 initiated 12 rapid transfers.</div>
                <div className="alert-time"><Clock size={12} /> 15 mins ago</div>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" className="alert-chevron" />
            </div>

            <div className="alert-item">
              <div className="alert-icon warning"></div>
              <div className="alert-content">
                <div className="alert-title">Warning: Off-Hours Activity</div>
                <div className="alert-desc">Unusual login location detected during off-hours.</div>
                <div className="alert-time"><Clock size={12} /> 1 hour ago</div>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" className="alert-chevron" />
            </div>
          </div>
          
          <button className="btn btn-outline" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
            View All Alerts
          </button>
        </div>
      </div>
    </div>
  );
}
