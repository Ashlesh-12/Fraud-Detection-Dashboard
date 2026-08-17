import { useState, useEffect } from 'react';
import { AlertOctagon, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';

interface RiskFactor {
  id: string;
  name: string;
  condition: string;
  weightLabel: string;
  description: string;
  triggered: boolean;
  severity: 'danger' | 'warning' | 'success';
}

export default function Sandbox() {
  // Form State
  const [type, setType] = useState<string>('TRANSFER');
  const [amount, setAmount] = useState<string>('450000');
  const [oldOrig, setOldOrig] = useState<string>('450000');
  const [newOrig, setNewOrig] = useState<string>('0');
  const [oldDest, setOldDest] = useState<string>('0');
  const [newDest, setNewDest] = useState<string>('0');
  const [hour, setHour] = useState<number>(3);

  // Result State
  const [score, setScore] = useState<number>(0);
  const [riskLevel, setRiskLevel] = useState<string>('Low Risk');
  const [factors, setFactors] = useState<RiskFactor[]>([]);

  useEffect(() => {
    calculateRisk();
  }, [type, amount, oldOrig, newOrig, oldDest, newDest, hour]);

  const calculateRisk = () => {
    const amt = parseFloat(amount) || 0;
    const origOld = parseFloat(oldOrig) || 0;
    const origNew = parseFloat(newOrig) || 0;
    const destOld = parseFloat(oldDest) || 0;
    const destNew = parseFloat(newDest) || 0;

    // In Paysim, fraud ONLY happens in TRANSFER and CASH_OUT
    const canBeFraud = type === 'TRANSFER' || type === 'CASH_OUT';

    if (!canBeFraud) {
      setScore(0);
      setRiskLevel('Low Risk');
      setFactors([
        {
          id: 'type_safe',
          name: 'Low-Risk Transaction Type',
          condition: `Type != TRANSFER or CASH_OUT`,
          weightLabel: 'Automatic Safe Zone',
          description: `Transaction type ${type} has zero historical fraud cases in the PaySim dataset.`,
          triggered: true,
          severity: 'success',
        },
      ]);
      return;
    }

    const calculatedFactors: RiskFactor[] = [];
    let calculatedScore = 0;

    // Rule 1: Zero Balance Source Transfer
    const isZeroBalanceOrig = origOld === 0 && amt > 0;
    calculatedFactors.push({
      id: 'zero_balance_orig',
      name: 'Zero-Balance Sender Account',
      condition: 'oldbalanceOrg == 0 && amount > 0',
      weightLabel: 'Project weight: +45%',
      description: 'The source account has an initial balance of $0 but is attempting to transfer funds.',
      triggered: isZeroBalanceOrig,
      severity: 'danger',
    });
    if (isZeroBalanceOrig) calculatedScore += 45;

    // Rule 2: Balance Drain
    const isBalanceDrained = origOld > 0 && origNew === 0 && amt > 0;
    calculatedFactors.push({
      id: 'balance_drained',
      name: 'Full Account Liquidation',
      condition: 'oldbalanceOrg > 0 && newbalanceOrig == 0',
      weightLabel: 'Project weight: +15%',
      description: 'The transaction drains the source account balance completely to $0.',
      triggered: isBalanceDrained,
      severity: 'warning',
    });
    if (isBalanceDrained) calculatedScore += 15;

    // Rule 3: Extreme Amount Value
    const isExtremeAmount = amt >= 1000000;
    calculatedFactors.push({
      id: 'extreme_amount',
      name: 'Ultra High Value Transfer',
      condition: 'amount >= $1,000,000',
      weightLabel: 'Project weight: +25%',
      description: 'The transaction amount is greater than or equal to $1,000,000.',
      triggered: isExtremeAmount,
      severity: 'danger',
    });
    if (isExtremeAmount) calculatedScore += 25;

    // Rule 4: Off-Hours Transaction
    const isOffHours = hour >= 2 && hour <= 6;
    calculatedFactors.push({
      id: 'off_hours',
      name: 'Anomalous Time-Window',
      condition: '2:00 AM <= Hour <= 6:00 AM',
      weightLabel: 'Project weight: +15%',
      description: 'Transaction initiated during high-risk off-hours (2:00 AM - 6:00 AM).',
      triggered: isOffHours,
      severity: 'warning',
    });
    if (isOffHours) calculatedScore += 15;

    // Rule 5: Destination Balance Inconsistency
    const isDestInconsistent = destOld === 0 && destNew === 0 && amt > 0;
    calculatedFactors.push({
      id: 'dest_inconsistent',
      name: 'Instant Fund Routing (Shell Account)',
      condition: 'oldbalanceDest == 0 && newbalanceDest == 0',
      weightLabel: 'Project weight: +20%',
      description: 'The destination account balance remains at $0 after receiving the transfer, indicating immediate cash out.',
      triggered: isDestInconsistent,
      severity: 'danger',
    });
    if (isDestInconsistent) calculatedScore += 20;

    // Cap score at 100
    calculatedScore = Math.min(calculatedScore, 100);
    setScore(calculatedScore);

    // Determine Risk Level (Project defined)
    if (calculatedScore >= 80) {
      setRiskLevel('Critical (Auto-Blocked)');
    } else if (calculatedScore >= 50) {
      setRiskLevel('High Risk');
    } else if (calculatedScore >= 20) {
      setRiskLevel('Medium Risk');
    } else {
      setRiskLevel('Low Risk');
    }

    setFactors(calculatedFactors);
  };

  const getScoreColorClass = () => {
    if (score >= 80) return 'critical';
    if (score >= 50) return 'high';
    if (score >= 20) return 'medium';
    return 'low';
  };

  const autofillPattern = (pattern: string) => {
    if (pattern === 'cashout') {
      setType('CASH_OUT');
      setAmount('250000');
      setOldOrig('250000');
      setNewOrig('0');
      setOldDest('0');
      setNewDest('0');
      setHour(3);
    } else if (pattern === 'highval') {
      setType('TRANSFER');
      setAmount('1500000');
      setOldOrig('3000000');
      setNewOrig('1500000');
      setOldDest('45000');
      setNewDest('1545000');
      setHour(14);
    } else if (pattern === 'legit') {
      setType('PAYMENT');
      setAmount('85');
      setOldOrig('1200');
      setNewOrig('1115');
      setOldDest('0');
      setNewDest('0');
      setHour(12);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.65rem', fontWeight: 800 }}>Rule-Based Fraud Risk Simulation</h1>
          <p className="page-subtitle" style={{ fontSize: '0.85rem' }}>Simulate transactions against our Business Intelligence risk detection rules</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', height: 'fit-content' }}>
          <button className="btn btn-outline" style={{ borderRadius: '0.25rem' }} onClick={() => autofillPattern('legit')}>
            Autofill Legit
          </button>
          <button className="btn btn-outline" style={{ borderRadius: '0.25rem' }} onClick={() => autofillPattern('cashout')}>
            Autofill Cashout Scheme
          </button>
          <button className="btn btn-outline" style={{ borderRadius: '0.25rem' }} onClick={() => autofillPattern('highval')}>
            Autofill High Value
          </button>
        </div>
      </div>

      <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '0.25rem', marginBottom: '1.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <strong>Information:</strong> This sandbox demonstrates rule-based risk scoring using patterns observed in the PaySim dataset. It is not a trained machine-learning model. Rule weights represent project-defined analytical indices.
      </div>

      <div className="sandbox-grid">
        {/* Form Panel */}
        <div className="glass-card">
          <div className="card-header" style={{ marginBottom: '1.5rem', padding: '0' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '800' }}>
              <Sparkles size={18} color="var(--accent-primary)" /> Transaction Parameters
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Transaction Type</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="TRANSFER">TRANSFER</option>
                <option value="CASH_OUT">CASH_OUT</option>
                <option value="PAYMENT">PAYMENT</option>
                <option value="DEBIT">DEBIT</option>
                <option value="CASH_IN">CASH_IN</option>
              </select>
            </div>

            <div className="form-group">
              <label>Transaction Value ($)</label>
              <input
                type="number"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 50000"
              />
            </div>
          </div>

          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', margin: '1rem 0 0.5rem 0', letterSpacing: '0.05em' }}>
            Source Account (Sender)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Old Balance ($)</label>
              <input
                type="number"
                className="form-input"
                value={oldOrig}
                onChange={(e) => setOldOrig(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>New Balance ($)</label>
              <input
                type="number"
                className="form-input"
                value={newOrig}
                onChange={(e) => setNewOrig(e.target.value)}
              />
            </div>
          </div>

          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', margin: '1rem 0 0.5rem 0', letterSpacing: '0.05em' }}>
            Destination Account (Recipient)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Old Balance ($)</label>
              <input
                type="number"
                className="form-input"
                value={oldDest}
                onChange={(e) => setOldDest(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>New Balance ($)</label>
              <input
                type="number"
                className="form-input"
                value={newDest}
                onChange={(e) => setNewDest(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label>Time of Day (Hour: {hour}:00)</label>
            <input
              type="range"
              min="0"
              max="23"
              className="form-input"
              style={{ padding: '0.25rem' }}
              value={hour}
              onChange={(e) => setHour(parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Results Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <div className="card-header" style={{ marginBottom: '1rem', padding: '0' }}>
              <h3 className="card-title" style={{ fontSize: '0.9rem', fontWeight: '800' }}>Risk Assessment Summary</h3>
            </div>

            <div className="risk-meter-container" style={{ borderRadius: '0.25rem' }}>
              <div className={`risk-percentage-circle ${getScoreColorClass()}`} style={{ borderRadius: '50%' }}>
                <span>{score}%</span>
                <span style={{ fontSize: '0.6rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>
                  Risk Score
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                {score >= 50 ? (
                  <ShieldAlert size={18} color="var(--accent-danger)" />
                ) : (
                  <ShieldCheck size={18} color="var(--accent-success)" />
                )}
                <h4 style={{ fontWeight: '800', fontSize: '1.05rem' }}>{riskLevel}</h4>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem', lineHeight: '1.4' }}>
                {score >= 80
                  ? 'Critical Risk index. Block recommended based on Zero-Balance transfer flags.'
                  : score >= 50
                  ? 'High Risk index. Recommend auditing due to account drain and value parameters.'
                  : score >= 20
                  ? 'Medium Risk index. Warning flags active; investigate off-hours velocity markers.'
                  : 'Low Risk index. Transaction passes normal analytical guidelines.'}
              </p>
            </div>

            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
              Rule Verification Log
            </h4>
            <div className="factors-list">
              {factors.map((factor) => (
                <div
                  key={factor.id}
                  className={`factor-item ${
                    factor.triggered
                      ? factor.severity === 'danger'
                        ? 'danger'
                        : factor.severity === 'warning'
                        ? 'warning'
                        : 'success'
                      : ''
                  }`}
                  style={{ opacity: factor.triggered ? 1 : 0.45, borderRadius: '0.25rem' }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{factor.name}</span>
                      <span style={{ fontSize: '0.65rem', color: factor.triggered ? 'inherit' : 'var(--text-muted)' }}>
                        {factor.weightLabel}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Condition: <code>{factor.condition}</code>
                    </div>
                    {factor.triggered && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', fontStyle: 'italic' }}>
                        {factor.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {type !== 'TRANSFER' && type !== 'CASH_OUT' && (
            <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-primary)', padding: '1rem 1.25rem', borderRadius: '0.25rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <AlertOctagon size={18} color="var(--accent-primary)" style={{ marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.25rem' }}>Business Intelligence Note</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    In the PaySim dataset (6.36 million records), fraud is exclusively concentrated in <strong>TRANSFER</strong> and <strong>CASH_OUT</strong> transactions. 
                    Other transaction types (CASH_IN, DEBIT, PAYMENT) are historically safe zones.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
