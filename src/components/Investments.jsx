import React, { useMemo } from 'react';
import { computeSummary } from '../utils/analysis';
import { INVESTMENT_IDEAS } from '../utils/analysis';
import { fmt } from '../utils/parser';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip,
} from 'recharts';

function SIPCalculator({ monthlyAmount }) {
  const scenarios = [
    { years: 3, rate: 12, label: '3 Years' },
    { years: 5, rate: 12, label: '5 Years' },
    { years: 10, rate: 12, label: '10 Years' },
    { years: 20, rate: 12, label: '20 Years' },
  ];
  const calc = (monthly, years, rate) => {
    const r = rate / 100 / 12;
    const n = years * 12;
    return monthly * (((1 + r) ** n - 1) / r) * (1 + r);
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 12 }}>
      {scenarios.map(s => {
        const future = calc(monthlyAmount, s.years, s.rate);
        const invested = monthlyAmount * s.years * 12;
        const gain = future - invested;
        return (
          <div key={s.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '14px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--green)' }}>{fmt(Math.round(future))}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              Invested: {fmt(invested)} · Gain: {fmt(Math.round(gain))}
            </div>
            <div className="progress-bar" style={{ marginTop: 8 }}>
              <div className="progress-fill" style={{
                width: `${Math.min(100, (invested / future) * 100)}%`,
                background: 'linear-gradient(90deg, var(--primary), var(--green))',
              }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              {((gain / invested) * 100).toFixed(0)}% returns at {s.rate}% p.a.
            </div>
          </div>
        );
      })}
    </div>
  );
}

const PORTFOLIO_ADVICE = [
  { subject: 'Emergency Fund', A: 30, fullMark: 100 },
  { subject: 'Equity MF', A: 40, fullMark: 100 },
  { subject: 'Debt/FD', A: 20, fullMark: 100 },
  { subject: 'Gold', A: 5, fullMark: 100 },
  { subject: 'Int\'l Equity', A: 5, fullMark: 100 },
];

export default function Investments({ transactions }) {
  const summary = useMemo(() => computeSummary(transactions), [transactions]);
  const currentInvestments = useMemo(() =>
    transactions.filter(t => t.category === 'Investments' && t.type === 'debit'),
    [transactions]
  );
  const currentInvTotal = currentInvestments.reduce((s, t) => s + t.amount, 0);
  const suggestedMonthly = Math.max(1000, summary.savings * 0.6);

  return (
    <div className="tab-content">
      {/* Header */}
      <div className="card mb-24" style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(99,102,241,0.08))',
        border: '1px solid rgba(16,185,129,0.2)',
      }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
              Current Monthly Investment
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: currentInvTotal > 0 ? 'var(--green)' : 'var(--red)' }}>
              {fmt(currentInvTotal)}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              {summary.income > 0 ? `${((currentInvTotal / summary.income) * 100).toFixed(1)}% of income` : '—'}
              {' · '}Recommended: {fmt(summary.income * 0.2)}/mo (20%)
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Investment Rate Progress</div>
            <div className="progress-bar" style={{ height: 10 }}>
              <div className="progress-fill" style={{
                width: `${Math.min(100, summary.income > 0 ? (currentInvTotal / (summary.income * 0.2)) * 100 : 0)}%`,
                background: 'linear-gradient(90deg, var(--primary), var(--green))',
              }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
              {summary.income > 0 ? `${Math.min(100, ((currentInvTotal / (summary.income * 0.2)) * 100).toFixed(0))}% of 20% target` : '—'}
              {currentInvTotal < summary.income * 0.2 && summary.income > 0 &&
                ` · Increase by ${fmt(summary.income * 0.2 - currentInvTotal)}/mo`
              }
            </div>
          </div>
          {summary.savings > 0 && (
            <div style={{
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: 10, padding: '12px 16px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600, marginBottom: 4 }}>Investable Surplus</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--green)' }}>{fmt(summary.savings)}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>this month</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid-2 mb-24">
        {/* SIP Calculator */}
        <div className="card">
          <div className="section-title">📊 SIP Growth Projector</div>
          <div className="section-sub">
            Investing {fmt(suggestedMonthly)}/month at 12% p.a. (Nifty 50 historical avg)
          </div>
          <SIPCalculator monthlyAmount={suggestedMonthly} />
          <div style={{
            marginTop: 12, padding: '10px 14px', borderRadius: 8,
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)',
            fontSize: 13, color: 'var(--primary-light)',
          }}>
            💡 Starting early matters more than the amount. Every month you delay costs you future wealth.
          </div>
        </div>

        {/* Ideal Portfolio */}
        <div className="card">
          <div className="section-title">🎯 Recommended Portfolio Allocation</div>
          <div className="section-sub">Balanced allocation for long-term wealth creation</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={PORTFOLIO_ADVICE}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Radar name="Allocation" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.25} />
              <Tooltip
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 8, fontSize: 13 }}
                formatter={v => [`${v}%`, 'Allocation']}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {[
              { label: 'Emergency Fund', pct: 30, color: 'var(--cyan)' },
              { label: 'Equity MF', pct: 40, color: 'var(--primary)' },
              { label: 'Debt/FD', pct: 20, color: 'var(--amber)' },
              { label: 'Gold', pct: 5, color: '#FFD700' },
              { label: "Int'l Equity", pct: 5, color: 'var(--green)' },
            ].map(a => (
              <div key={a.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color }} />
                <span style={{ color: 'var(--text-dim)' }}>{a.label}</span>
                <span style={{ fontWeight: 700, color: a.color }}>{a.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Investment Ideas */}
      <div className="mb-24">
        <div className="section-title">💼 Investment Opportunities</div>
        <div className="section-sub">Curated options based on your financial profile</div>
        <div className="grid-3">
          {INVESTMENT_IDEAS.map((inv, i) => (
            <div key={i} className="invest-card">
              <div className="invest-header">
                <div className="invest-icon">{inv.icon}</div>
                <div>
                  <div className="invest-name">{inv.name}</div>
                  <div className="invest-type">{inv.type}</div>
                </div>
              </div>
              <div className="invest-returns">{inv.returns}</div>
              <div className="invest-desc">{inv.desc}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <span className={`invest-risk risk-${inv.risk}`}>
                  {inv.risk === 'low' ? '🛡️ Low Risk' : inv.risk === 'medium' ? '⚡ Medium Risk' : '🔥 High Risk'}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Min: {fmt(inv.minAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Saving */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.06))', border: '1px solid rgba(99,102,241,0.15)' }}>
        <div className="section-title">🧾 Tax Saving Opportunities (Section 80C)</div>
        <div className="section-sub">Reduce your taxable income by up to ₹1,50,000</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginTop: 12 }}>
          {[
            { name: 'ELSS Mutual Fund', limit: 150000, current: currentInvestments.filter(t => t.description.toLowerCase().includes('elss')).reduce((s, t) => s + t.amount, 0), icon: '📊' },
            { name: 'PPF', limit: 150000, current: 0, icon: '🏛️' },
            { name: 'Life Insurance (LIC)', limit: 150000, current: currentInvestments.filter(t => t.description.toLowerCase().includes('lic')).reduce((s, t) => s + t.amount * 12, 0), icon: '🛡️' },
            { name: 'EPF (Employee PF)', limit: 150000, current: 0, icon: '💼' },
          ].map(s => (
            <div key={s.name} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px' }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{s.name}</div>
              <div className="progress-bar" style={{ marginBottom: 6 }}>
                <div className="progress-fill" style={{
                  width: `${Math.min(100, (s.current / s.limit) * 100)}%`,
                  background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {fmt(s.current)} / {fmt(s.limit)} limit
              </div>
              {s.current < s.limit && (
                <div style={{ fontSize: 11, color: 'var(--amber)', marginTop: 4 }}>
                  Invest {fmt(s.limit - s.current)} more to maximize
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
