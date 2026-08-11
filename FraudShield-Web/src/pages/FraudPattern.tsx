import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function FraudPattern() {
  const [typeData, setTypeData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/data/fraud_by_type.json')
      .then(res => res.json())
      .then(data => setTypeData(data));
  }, []);

  if (typeData.length === 0) return <div className="page-title animate-fade-in">Loading Data...</div>;

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">Fraud Pattern Intelligence</h1>
      <p className="page-subtitle">Analyze fraudulent activity across different transaction types.</p>
      
      <div className="charts-grid">
        <div className="glass-card">
          <div className="card-header">
            <h3 className="card-title">Fraud Cases by Transaction Type</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData.filter((d: any) => d.fraudCount > 0)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="type" stroke="var(--text-muted)" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}
                  cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                  itemStyle={{ color: 'var(--text-primary)', fontWeight: 500 }}
                />
                <Bar dataKey="fraudCount" name="Fraud Cases" radius={[4, 4, 0, 0]} maxBarSize={60}>
                  {typeData.filter((d: any) => d.fraudCount > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.type === 'TRANSFER' ? 'var(--accent-danger)' : 'var(--accent-warning)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-header">
            <h3 className="card-title">Fraud Rate by Transaction Type (%)</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData.filter((d: any) => d.fraudRate > 0)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="type" stroke="var(--text-muted)" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}
                  cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                  itemStyle={{ color: 'var(--text-primary)', fontWeight: 500 }}
                />
                <Bar dataKey="fraudRate" name="Fraud Rate %" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
