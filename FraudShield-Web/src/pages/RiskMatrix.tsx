import { useEffect, useState } from 'react';

export default function RiskMatrix() {
  const [riskData, setRiskData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/data/risk_matrix.json')
      .then(res => res.json())
      .then(data => setRiskData(data));
  }, []);

  const getMatrixCellClass = (rate: number) => {
    if (rate >= 80) return 'matrix-cell-critical';
    if (rate > 0.5) return 'matrix-cell-high';
    if (rate > 0) return 'matrix-cell-medium';
    return 'matrix-cell-low';
  };

  const getRiskBadgeClass = (level: string) => {
    switch(level) {
      case 'Critical': return 'badge critical';
      case 'High Risk': return 'badge high';
      case 'Medium Risk': return 'badge medium';
      default: return 'badge low';
    }
  };

  if (riskData.length === 0) return <div className="page-title">Loading PaySim Risk Grid...</div>;

  const activeRisks = riskData.filter(d => d.totalTransactions > 0).sort((a, b) => b.fraudRate - a.fraudRate);

  return (
    <div className="animate-fade-in">
      <h1 className="page-title" style={{ fontSize: '1.65rem', fontWeight: 800 }}>Fraud Risk Matrix</h1>
      <p className="page-subtitle" style={{ fontSize: '0.85rem' }}>Multi-dimensional risk assessment by transaction type and value category</p>
      
      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <div className="card-header" style={{ padding: '0', marginBottom: '1.5rem' }}>
          <h3 className="card-title" style={{ fontSize: '0.9rem', fontWeight: '800' }}>Risk Assessment Matrix</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.8rem', lineHeight: '1.6' }}>
          This Matrix analyzes the intersection of <strong>Transaction Type</strong> and <strong>Amount Category</strong> to identify high-risk segments based on historical PaySim data.
        </p>

        <div className="table-container">
          <table className="risk-matrix">
            <thead>
              <tr>
                <th>Transaction Type</th>
                <th>Amount Category</th>
                <th style={{ textAlign: 'right' }}>Total Transactions</th>
                <th style={{ textAlign: 'right' }}>Fraud Cases</th>
                <th style={{ textAlign: 'right' }}>Fraud Rate (%)</th>
                <th style={{ textAlign: 'center' }}>Assessment Level</th>
              </tr>
            </thead>
            <tbody>
              {activeRisks.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '700' }}>{row.type}</td>
                  <td style={{ fontWeight: '500' }}>{row.amountCategory}</td>
                  <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>{new Intl.NumberFormat().format(row.totalTransactions)}</td>
                  <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>{new Intl.NumberFormat().format(row.fraudCases)}</td>
                  <td 
                    className={getMatrixCellClass(row.fraudRate)} 
                    style={{ textAlign: 'right' }}
                  >
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
        
        {/* Footnote Disclaimers */}
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '0.25rem' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Risk Threshold & Classification Disclaimers
          </h4>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            * Risk level classification is based strictly on project-defined analytical thresholds (Critical if fraud rate &gt; 0.5%; High Risk if &gt; 0.1%; Medium Risk if &gt; 0%). 
            These are customized metrics for dataset segment indexing and do not represent absolute banking risk constraints.
          </p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginTop: '0.25rem' }}>
            * The high rate of <strong>81.61%</strong> for <strong>CASH_OUT / Very High</strong> ($1M+) transactions is a genuine pattern of the PaySim dataset, caused by compromise scenarios where funds are routed to cash out immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
