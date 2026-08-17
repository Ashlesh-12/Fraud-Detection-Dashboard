import { useState } from 'react';
import { Search, AlertCircle, Eye, Snowflake } from 'lucide-react';

interface HighRiskAccount {
  accountId: string;
  patternType: 'Immediate Cash Out' | 'Zero Balance Transfer' | 'Off-Hours Activity' | 'Velocity Spike';
  severity: 'Critical' | 'High Risk' | 'Medium Risk';
  flaggedVolume: number;
  transactionsCount: number;
  maxAmount: number;
  status: 'Under Investigation' | 'Frozen' | 'Flagged';
  auditNotes: string;
}

export default function AccountAnalysis() {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [patternFilter, setPatternFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAuditAccount, setSelectedAuditAccount] = useState<HighRiskAccount | null>(null);

  // Hardcoded simulated profiles for demonstration
  const [accounts, setAccounts] = useState<HighRiskAccount[]>([
    {
      accountId: 'C-982181',
      patternType: 'Zero Balance Transfer',
      severity: 'Critical',
      flaggedVolume: 450200,
      transactionsCount: 1,
      maxAmount: 450200,
      status: 'Under Investigation',
      auditNotes: 'Simulated Case: Account opened <24h ago. Transferred full amount ($450,200) immediately on arrival from unverified source.'
    },
    {
      accountId: 'C-772922',
      patternType: 'Immediate Cash Out',
      severity: 'Critical',
      flaggedVolume: 185000,
      transactionsCount: 2,
      maxAmount: 185000,
      status: 'Under Investigation',
      auditNotes: 'Simulated Case: TRANSFER received at 3:12 AM and fully cashed out via CASH_OUT within 120 seconds.'
    },
    {
      accountId: 'AC-883',
      patternType: 'Velocity Spike',
      severity: 'High Risk',
      flaggedVolume: 890000,
      transactionsCount: 12,
      maxAmount: 120000,
      status: 'Under Investigation',
      auditNotes: 'Simulated Case: Velocity spike of 12 transactions initiated within 1-hour window. Sender balance drops to $310k.'
    },
    {
      accountId: 'C-556102',
      patternType: 'Off-Hours Activity',
      severity: 'High Risk',
      flaggedVolume: 15400,
      transactionsCount: 1,
      maxAmount: 15400,
      status: 'Flagged',
      auditNotes: 'Simulated Case: Transaction completed at 4:10 AM. Device fingerprint does not match historical login locations.'
    },
    {
      accountId: 'C-109282',
      patternType: 'Zero Balance Transfer',
      severity: 'Critical',
      flaggedVolume: 512000,
      transactionsCount: 1,
      maxAmount: 512000,
      status: 'Frozen',
      auditNotes: 'Simulated Case: Sender account balance remains $0. Auto-blocked by Risk Engine rules.'
    },
    {
      accountId: 'C-229202',
      patternType: 'Immediate Cash Out',
      severity: 'Critical',
      flaggedVolume: 320000,
      transactionsCount: 2,
      maxAmount: 320000,
      status: 'Frozen',
      auditNotes: 'Simulated Case: Blocked due to structural correlation with Zero-Balance transfer path.'
    },
    {
      accountId: 'C-883199',
      patternType: 'Off-Hours Activity',
      severity: 'Medium Risk',
      flaggedVolume: 45000,
      transactionsCount: 3,
      maxAmount: 22000,
      status: 'Flagged',
      auditNotes: 'Simulated Case: Multiple transfers completed between 2:00 AM and 5:00 AM.'
    },
    {
      accountId: 'C-129828',
      patternType: 'Velocity Spike',
      severity: 'High Risk',
      flaggedVolume: 670000,
      transactionsCount: 8,
      maxAmount: 95000,
      status: 'Under Investigation',
      auditNotes: 'Simulated Case: Spike in frequency and amount category. Account previously inactive.'
    }
  ]);

  const itemsPerPage = 5;

  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = acc.accountId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          acc.patternType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'all' || acc.severity === riskFilter;
    const matchesPattern = patternFilter === 'all' || acc.patternType === patternFilter;

    return matchesSearch && matchesRisk && matchesPattern;
  });

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRiskBadgeClass = (level: string) => {
    switch (level) {
      case 'Critical': return 'badge critical';
      case 'High Risk': return 'badge high';
      default: return 'badge medium';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Frozen': return 'badge critical';
      case 'Under Investigation': return 'badge high';
      default: return 'badge medium';
    }
  };

  const toggleFreezeAccount = (id: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.accountId === id) {
        const nextStatus = acc.status === 'Frozen' ? 'Under Investigation' : 'Frozen';
        return { ...acc, status: nextStatus };
      }
      return acc;
    }));
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.65rem', fontWeight: 800 }}>Account Analysis</h1>
          <p className="page-subtitle" style={{ fontSize: '0.85rem' }}>Behavioral profiling and ledger auditing of high-risk accounts</p>
        </div>
        <span className="badge low" style={{ height: 'fit-content', padding: '0.4rem 0.75rem', fontSize: '0.7rem' }}>
          Investigation Profiles — Demonstration Layer
        </span>
      </div>

      <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '0.25rem', marginBottom: '1.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <strong>Information:</strong> The accounts and ledgers displayed on this page are simulated demonstration profiles modeled after standard PaySim fraud patterns. They are used for illustrating decision-support tools.
      </div>

      {/* Explorer Dashboard */}
      <div className="glass-card" style={{ marginTop: '1rem' }}>
        <div className="card-header" style={{ padding: '0', marginBottom: '1.5rem' }}>
          <h3 className="card-title" style={{ fontSize: '0.9rem', fontWeight: '800' }}>High-Risk Accounts Explorer</h3>
        </div>

        {/* Filter Controls */}
        <div className="filter-bar" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ maxWidth: '300px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search account ID, pattern..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <select 
            value={riskFilter} 
            onChange={(e) => { setRiskFilter(e.target.value); setCurrentPage(1); }}
            style={{ padding: '0.4rem 0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
          >
            <option value="all">All Risk Levels</option>
            <option value="Critical">Critical</option>
            <option value="High Risk">High Risk</option>
            <option value="Medium Risk">Medium Risk</option>
          </select>

          <select 
            value={patternFilter} 
            onChange={(e) => { setPatternFilter(e.target.value); setCurrentPage(1); }}
            style={{ padding: '0.4rem 0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
          >
            <option value="all">All Patterns</option>
            <option value="Zero Balance Transfer">Zero Balance Transfer</option>
            <option value="Immediate Cash Out">Immediate Cash Out</option>
            <option value="Velocity Spike">Velocity Spike</option>
            <option value="Off-Hours Activity">Off-Hours Activity</option>
          </select>
        </div>

        {/* Table View */}
        <div className="table-container">
          <table className="risk-matrix">
            <thead>
              <tr>
                <th>Account ID</th>
                <th>Pattern Type</th>
                <th>Risk Severity</th>
                <th style={{ textAlign: 'right' }}>Flagged Volume</th>
                <th style={{ textAlign: 'right' }}>Trans. Count</th>
                <th style={{ textAlign: 'center' }}>Investigative Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                    No flagged accounts found matching the criteria.
                  </td>
                </tr>
              ) : (
                paginatedAccounts.map((row) => (
                  <tr key={row.accountId}>
                    <td style={{ fontWeight: '700' }}>{row.accountId}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{row.patternType}</td>
                    <td>
                      <span className={getRiskBadgeClass(row.severity)}>{row.severity}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '500' }}>
                      ${row.flaggedVolume.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                      {row.transactionsCount}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={getStatusBadgeClass(row.status)}>
                        {row.status === 'Frozen' && <Snowflake size={10} style={{ marginRight: '4px' }} />}
                        {row.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button 
                          className="close-btn" 
                          onClick={() => setSelectedAuditAccount(row)}
                          title="View Forensic Audit Notes"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="btn btn-outline" 
                          style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            borderRadius: '0.25rem',
                            color: row.status === 'Frozen' ? 'var(--accent-success)' : 'var(--accent-danger)',
                            borderColor: row.status === 'Frozen' ? 'var(--accent-success)' : 'var(--accent-danger)'
                          }}
                          onClick={() => toggleFreezeAccount(row.accountId)}
                        >
                          {row.status === 'Frozen' ? 'Unfreeze' : 'Freeze'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAccounts.length)} of {filteredAccounts.length} accounts
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-outline" 
                style={{ borderRadius: '0.25rem' }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              >
                Previous
              </button>
              <button 
                className="btn btn-outline" 
                style={{ borderRadius: '0.25rem' }}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Forensic Audit Note Modal/Overlay */}
      {selectedAuditAccount && (
        <div className="drawer-backdrop" onClick={() => setSelectedAuditAccount(null)}>
          <div 
            className="glass-card animate-fade-in" 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '500px',
              maxWidth: '90%',
              margin: 'auto',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '0.25rem'
            }}
          >
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0', marginBottom: '1rem' }}>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: '800' }}>
                <AlertCircle size={18} color="var(--accent-primary)" /> Forensic Ledger Audit
              </h3>
              <button className="close-btn" onClick={() => setSelectedAuditAccount(null)}><X size={16} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <span className="badge critical" style={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
                  {selectedAuditAccount.severity} Severity
                </span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
                  Account ID: {selectedAuditAccount.accountId}
                </h4>
              </div>

              <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '0.25rem', border: '1px solid var(--border-color)' }}>
                <h5 style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Audit Investigation Notes
                </h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  {selectedAuditAccount.auditNotes}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Pattern Classification:</span>
                  <span style={{ fontWeight: '600' }}>{selectedAuditAccount.patternType}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Max Transaction Value:</span>
                  <span style={{ fontWeight: '600' }}>${selectedAuditAccount.maxAmount.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Current System Status:</span>
                  <span style={{ fontWeight: '600' }}>{selectedAuditAccount.status}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  className="btn btn-outline" 
                  style={{ flex: 1, justifyContent: 'center', borderRadius: '0.25rem' }}
                  onClick={() => setSelectedAuditAccount(null)}
                >
                  Close Audit
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ 
                    flex: 1, 
                    justifyContent: 'center',
                    borderRadius: '0.25rem',
                    backgroundColor: selectedAuditAccount.status === 'Frozen' ? 'var(--accent-success)' : 'var(--accent-danger)' 
                  }}
                  onClick={() => {
                    toggleFreezeAccount(selectedAuditAccount.accountId);
                    setSelectedAuditAccount(null);
                  }}
                >
                  {selectedAuditAccount.status === 'Frozen' ? 'Unfreeze Account' : 'Freeze Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function X({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
