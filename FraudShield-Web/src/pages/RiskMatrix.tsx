import { useEffect, useState } from 'react';

export default function RiskMatrix() {
  const [riskData, setRiskData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/data/risk_matrix.json')
      .then(res => res.json())
      .then(data => setRiskData(data));
  }, []);

  const getRiskBadgeClass = (level: string) => {
    switch(level) {
      case 'Critical': return 'badge critical';
      case 'High Risk': return 'badge high';
      case 'Medium Risk': return 'badge medium';
      default: return 'badge low';
    }
  };

  if (riskData.length === 0) return <div className="page-title animate-fade-in">Loading Risk Matrix...</div>;

  const activeRisks = riskData.filter(d => d.totalTransactions > 0).sort((a, b) => b.fraudRate - a.fraudRate);

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">Fraud Risk Matrix</h1>
      <p className="page-subtitle">Multi-dimensional risk assessment by transaction type and value.</p>
      
      <div className="glass-card animate-fade-in delay-1">
        <div className="card-header">
          <h3 className="card-title">Risk Assessment Grid</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem', lineHeight: '1.6' }}>
          This proprietary Risk Matrix analyzes the intersection of <strong>Transaction Type</strong> and <strong>Amount Category</strong> to identify the most dangerous combinations based on actual fraud rates.
        </p>

        <div className="table-container">
          <table className="risk-matrix">
            <thead>
              <tr>
                <th>Transaction Type</th>
                <th>Amount Category</th>
                <th style={{ textAlign: 'right' }}>Total Trans.</th>
                <th style={{ textAlign: 'right' }}>Fraud Cases</th>
                <th style={{ textAlign: 'right' }}>Fraud Rate</th>
                <th style={{ textAlign: 'center' }}>Assessment</th>
              </tr>
            </thead>
            <tbody>
              {activeRisks.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '500' }}>{row.type}</td>
                  <td>{row.amountCategory}</td>
                  <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>{new Intl.NumberFormat().format(row.totalTransactions)}</td>
                  <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>{new Intl.NumberFormat().format(row.fraudCases)}</td>
                  <td style={{ textAlign: 'right', fontWeight: '600', color: row.fraudRate > 0.5 ? 'var(--accent-danger)' : 'var(--text-primary)' }}>
                    {row.fraudRate.toFixed(4)}%
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={getRiskBadgeClass(row.riskLevel)}>{row.riskLevel}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
