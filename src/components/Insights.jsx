import React, { useMemo } from 'react';
import { computeSummary, getRecurringPayments, getFlaggedTransactions, generateTips } from '../utils/analysis';
import { CATEGORY_CONFIG, fmt } from '../utils/parser';

function getColor(cat) { return CATEGORY_CONFIG[cat]?.color || '#64748b'; }
function getIcon(cat) { return CATEGORY_CONFIG[cat]?.icon || '📦'; }

function HealthScore({ score }) {
  const color = score >= 70 ? 'var(--green)' : score >= 40 ? 'var(--amber)' : 'var(--red)';
  const label = score >= 70 ? 'Excellent' : score >= 55 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Work';
  const size = 140;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div style={{ marginTop: -size/2 - 10, textAlign: 'center', position: 'relative', top: -80 }}>
        <div style={{ fontSize: 36, fontWeight: 800, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>/ 100</div>
      </div>
      <div style={{ marginTop: -40 }}>
        <span style={{
          background: color === 'var(--green)' ? 'rgba(16,185,129,0.12)' : color === 'var(--amber)' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
          color,
          padding: '4px 14px',
          borderRadius: 20,
          fontSize: 14,
          fontWeight: 700,
        }}>{label}</span>
      </div>
    </div>
  );
}

function computeHealthScore(summary) {
  let score = 50;
  if (summary.savingsRate >= 30) score += 25;
  else if (summary.savingsRate >= 20) score += 15;
  else if (summary.savingsRate >= 10) score += 5;
  else score -= 15;

  if (summary.income > 0 && summary.expenses / summary.income < 0.5) score += 15;
  else if (summary.income > 0 && summary.expenses / summary.income < 0.7) score += 8;
  else if (summary.income > 0 && summary.expenses / summary.income > 0.9) score -= 10;

  return Math.min(100, Math.max(0, score));
}

export default function Insights({ transactions }) {
  const summary = useMemo(() => computeSummary(transactions), [transactions]);
  const recurring = useMemo(() => getRecurringPayments(transactions), [transactions]);
  const flagged = useMemo(() => getFlaggedTransactions(transactions), [transactions]);
  const tips = useMemo(() => generateTips(transactions, summary), [transactions, summary]);
  const healthScore = useMemo(() => computeHealthScore(summary), [summary]);

  const subscriptions = recurring.filter(r =>
    r.category === 'Subscriptions' || ['netflix','spotify','youtube','hotstar','notion','figma','amazon prime'].some(k => r.name.toLowerCase().includes(k))
  );

  return (
    <div className="tab-content">
      <div className="grid-2 mb-24">
        {/* Financial Health Score */}
        <div className="card">
          <div className="section-title">Financial Health Score</div>
          <div className="section-sub">Based on savings rate, expense ratio & spending habits</div>
          <HealthScore score={healthScore} />
          <div style={{ marginTop: 8 }}>
            {[
              { label: 'Savings Rate', val: `${summary.savingsRate.toFixed(1)}%`, ok: summary.savingsRate >= 20 },
              { label: 'Expense Ratio', val: summary.income > 0 ? `${((summary.expenses / summary.income) * 100).toFixed(1)}%` : 'N/A', ok: summary.income > 0 && summary.expenses / summary.income < 0.8 },
              { label: 'Monthly Balance', val: fmt(summary.savings), ok: summary.savings > 0 },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: item.ok ? 'var(--green)' : 'var(--red)' }}>
                  {item.ok ? '✓ ' : '✗ '}{item.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <div className="section-title">Spending Overview</div>
          <div className="section-sub">Key metrics at a glance</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
            {[
              { label: 'Total Income', val: fmt(summary.income), color: 'var(--green)', icon: '💰' },
              { label: 'Total Expenses', val: fmt(summary.expenses), color: 'var(--red)', icon: '💸' },
              { label: 'Net Savings', val: fmt(Math.abs(summary.savings)), color: summary.savings >= 0 ? 'var(--primary-light)' : 'var(--red)', icon: '🏦' },
              { label: 'Recurring Cost', val: fmt(recurring.reduce((s, r) => s + r.monthlyEstimate, 0)), color: 'var(--cyan)', icon: '↻' },
              { label: 'Flagged Items', val: `${flagged.length} transactions`, color: 'var(--amber)', icon: '⚠️' },
              { label: 'Subscriptions', val: fmt(subscriptions.reduce((s, r) => s + r.monthlyEstimate, 0)) + '/mo', color: 'var(--secondary)', icon: '📱' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'var(--surface)',
                borderRadius: 10, padding: '14px 16px',
                border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: s.color, marginTop: 2 }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Tips */}
      <div className="mb-24">
        <div className="section-title">💡 Personalized Financial Tips</div>
        <div className="section-sub">Smart recommendations based on your spending patterns</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tips.map((tip, i) => (
            <div key={i} className="insight-card">
              <div className={`insight-icon ${tip.type}`}>
                <span style={{ fontSize: 20 }}>{tip.icon}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div className="insight-title" style={{
                  color: tip.type === 'danger' ? 'var(--red)' : tip.type === 'warning' ? 'var(--amber)' : tip.type === 'success' ? 'var(--green)' : 'var(--primary-light)'
                }}>{tip.title}</div>
                <div className="insight-desc">{tip.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2 mb-24">
        {/* Recurring Payments */}
        <div className="card">
          <div className="section-title">↻ Recurring Payments</div>
          <div className="section-sub">
            {recurring.length} recurring items · {fmt(recurring.reduce((s, r) => s + r.monthlyEstimate, 0))}/month
          </div>
          {recurring.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <div className="empty-state-icon">✓</div>
              <p>No recurring payments detected</p>
            </div>
          ) : (
            <div className="scroll-panel">
              {recurring.map((r, i) => (
                <div key={i} className="recurring-item">
                  <div className="recurring-dot" style={{ background: getColor(r.category) }} />
                  <div style={{ flex: 1 }}>
                    <div className="recurring-name">{r.name}</div>
                    <div className="recurring-freq">
                      <span className="tag tag-recurring">↻ {r.occurrences}× detected</span>
                      {' '}
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{getIcon(r.category)} {r.category}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="recurring-amount">{fmt(r.avgAmount)}</div>
                    <div className="recurring-total">{fmt(r.yearlyEstimate)}/yr</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Flagged Transactions */}
        <div className="card">
          <div className="section-title">⚠️ Transactions to Review</div>
          <div className="section-sub">
            {flagged.length} items flagged · {fmt(flagged.reduce((s, t) => s + t.amount, 0))} total
          </div>
          {flagged.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <div className="empty-state-icon">✅</div>
              <p>No unnecessary transactions found!</p>
            </div>
          ) : (
            <div className="scroll-panel">
              {flagged.map(t => (
                <div key={t.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', borderRadius: 8,
                  border: '1px solid rgba(239,68,68,0.15)',
                  background: 'rgba(239,68,68,0.04)',
                  marginBottom: 8,
                }}>
                  <span style={{ fontSize: 18 }}>{getIcon(t.category)}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.description}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {new Date(t.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                      {' · '}{t.category}
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--red)' }}>-{fmt(t.amount)}</div>
                </div>
              ))}
              {flagged.length > 0 && (
                <div style={{
                  marginTop: 12, padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)',
                  fontSize: 13, color: 'var(--amber)',
                }}>
                  💡 Redirecting these {fmt(flagged.reduce((s, t) => s + t.amount, 0))} to investments
                  could grow to {fmt(flagged.reduce((s, t) => s + t.amount, 0) * 1.12 * 5)} in 5 years at 12% returns.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Subscription Audit */}
      {subscriptions.length > 0 && (
        <div className="card mb-24">
          <div className="section-title">📱 Subscription Audit</div>
          <div className="section-sub">
            Monthly subscription cost: {fmt(subscriptions.reduce((s, r) => s + r.monthlyEstimate, 0))} · Annual: {fmt(subscriptions.reduce((s, r) => s + r.yearlyEstimate, 0))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginTop: 8 }}>
            {subscriptions.map((s, i) => (
              <div key={i} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{s.name.slice(0, 28)}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--secondary)' }}>{fmt(s.monthlyEstimate)}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {fmt(s.yearlyEstimate)}/year · {s.occurrences}× charged
                </div>
                <div style={{
                  marginTop: 8, fontSize: 11, color: 'var(--amber)',
                  background: 'rgba(245,158,11,0.08)', padding: '4px 8px', borderRadius: 4,
                }}>
                  ⚠ Review if actively used
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
