export default function AccountAnalysis() {
  return (
    <div className="animate-fade-in">
      <h1 className="page-title">Account Analysis & Suspicious Activity</h1>
      <p className="page-subtitle">Behavioral profiling of high-risk sender and receiver patterns.</p>
      
      <div className="glass-card animate-fade-in delay-1">
        <div className="card-header">
          <h3 className="card-title">High-Risk Account Behaviors</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '0.875rem' }}>
          Due to data privacy and performance optimizations, individual account numbers have been aggregated. 
          However, our behavioral analysis models flagged the following transaction patterns as highly suspicious:
        </p>
        
        <div className="table-container">
          <table className="risk-matrix">
            <thead>
              <tr>
                <th>Pattern Type</th>
                <th>Description</th>
                <th>Risk Severity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: '500' }}>Immediate Cash Out</td>
                <td style={{ color: 'var(--text-secondary)' }}>A TRANSFER is received and immediately followed by a CASH_OUT of the exact same amount.</td>
                <td><span className="badge critical">Critical</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: '500' }}>Zero Balance Transfer</td>
                <td style={{ color: 'var(--text-secondary)' }}>An account with zero prior history suddenly transfers an amount &gt; $100k.</td>
                <td><span className="badge critical">Critical</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: '500' }}>Off-Hours Activity</td>
                <td style={{ color: 'var(--text-secondary)' }}>Large volume transactions occurring between 2:00 AM and 6:00 AM.</td>
                <td><span className="badge high">High Risk</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: '500' }}>Velocity Spike</td>
                <td style={{ color: 'var(--text-secondary)' }}>Account executes more than 5 high-value transfers in a 1-hour window.</td>
                <td><span className="badge high">High Risk</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
