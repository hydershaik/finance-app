import React, { useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line, AreaChart, Area,
} from 'recharts';
import { computeSummary, categoryBreakdown, monthlyTrend } from '../utils/analysis';
import { CATEGORY_CONFIG, fmt } from '../utils/parser';

const OTHER_COLOR = '#64748b';
const MONTH_LABELS = { '01':'Jan','02':'Feb','03':'Mar','04':'Apr','05':'May','06':'Jun','07':'Jul','08':'Aug','09':'Sep','10':'Oct','11':'Nov','12':'Dec' };

function getColor(cat) {
  return CATEGORY_CONFIG[cat]?.color || OTHER_COLOR;
}

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="custom-tooltip">
      <div className="label">{d.name}</div>
      <div className="value" style={{ color: d.payload.fill }}>{fmt(d.value)}</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{d.payload.pct?.toFixed(1)}% of expenses</div>
    </div>
  );
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="label">{MONTH_LABELS[label?.split('-')[1]] || label} {label?.split('-')[0]}</div>
      {payload.map(p => (
        <div key={p.name} style={{ fontSize: 13, fontWeight: 600, color: p.color, marginTop: 3 }}>
          {p.name}: {fmt(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function Overview({ transactions, filters, setFilters }) {
  const summary = useMemo(() => computeSummary(transactions), [transactions]);
  const catData = useMemo(() => {
    const bd = categoryBreakdown(transactions);
    const total = bd.reduce((s, d) => s + d.value, 0);
    return bd.map(d => ({ ...d, pct: total > 0 ? (d.value / total) * 100 : 0, fill: getColor(d.name) }));
  }, [transactions]);
  const trend = useMemo(() => monthlyTrend(transactions), [transactions]);

  const topExpenses = catData.slice(0, 5);

  return (
    <div className="tab-content">
      {/* Quick filters */}
      <div className="filters-bar mb-20">
        <div className="filter-group">
          <span className="filter-label">Type</span>
          <select className="filter-select" value={filters.type}
            onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
            <option value="all">All Transactions</option>
            <option value="credit">Income Only</option>
            <option value="debit">Expenses Only</option>
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">Category</span>
          <select className="filter-select" value={filters.category}
            onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
            <option value="all">All Categories</option>
            {Object.keys(CATEGORY_CONFIG).map(c => (
              <option key={c} value={c}>{CATEGORY_CONFIG[c].icon} {c}</option>
            ))}
            <option value="Other">📦 Other</option>
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">From</span>
          <input type="date" className="filter-input" value={filters.dateFrom}
            onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))} />
        </div>
        <div className="filter-group">
          <span className="filter-label">To</span>
          <input type="date" className="filter-input" value={filters.dateTo}
            onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))} />
        </div>
        <button className="filter-clear" onClick={() => setFilters({ category: 'all', type: 'all', search: '', dateFrom: '', dateTo: '' })}>
          Clear Filters
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid-4 mb-24">
        <div className="summary-card income">
          <div className="summary-icon">💰</div>
          <div className="summary-label">Total Income</div>
          <div className="summary-value income">{fmt(summary.income)}</div>
          <div className="summary-sub">{transactions.filter(t => t.type === 'credit').length} transactions</div>
        </div>
        <div className="summary-card expense">
          <div className="summary-icon">💸</div>
          <div className="summary-label">Total Expenses</div>
          <div className="summary-value expense">{fmt(summary.expenses)}</div>
          <div className="summary-sub">{transactions.filter(t => t.type === 'debit').length} transactions</div>
        </div>
        <div className="summary-card savings">
          <div className="summary-icon">🏦</div>
          <div className="summary-label">Net Savings</div>
          <div className="summary-value savings" style={{ color: summary.savings >= 0 ? 'var(--primary-light)' : 'var(--red)' }}>
            {fmt(Math.abs(summary.savings))}
          </div>
          <div className="summary-sub" style={{ color: summary.savings >= 0 ? 'var(--green)' : 'var(--red)' }}>
            {summary.savings >= 0 ? '▲ Surplus' : '▼ Deficit'}
          </div>
        </div>
        <div className="summary-card rate">
          <div className="summary-icon">📊</div>
          <div className="summary-label">Savings Rate</div>
          <div className="summary-value rate">{summary.savingsRate.toFixed(1)}%</div>
          <div className="summary-sub">
            {summary.savingsRate >= 20 ? '✅ On Track' : summary.savingsRate >= 10 ? '⚠️ Improve' : '🔴 Too Low'}
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid-2 mb-24">
        {/* Expense Pie */}
        <div className="chart-container">
          <div className="chart-title">Expense Breakdown</div>
          <div className="chart-sub">Where your money is going</div>
          {catData.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📊</div><p>No expense data</p></div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={catData} cx="50%" cy="50%" innerRadius={70} outerRadius={110}
                    paddingAngle={2} dataKey="value" stroke="none">
                    {catData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="legend">
                {catData.map(d => (
                  <div key={d.name} className="legend-item">
                    <div className="legend-dot" style={{ background: d.fill }} />
                    {d.name} <span style={{ fontWeight: 600 }}>({d.pct.toFixed(0)}%)</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Category bars */}
        <div className="chart-container">
          <div className="chart-title">Expense Ratio by Category</div>
          <div className="chart-sub">Top spending categories with relative proportion</div>
          {topExpenses.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📊</div><p>No data</p></div>
          ) : (
            <div style={{ marginTop: 8 }}>
              {topExpenses.map(d => (
                <div key={d.name} style={{ marginBottom: 16 }}>
                  <div className="flex justify-between mb-4">
                    <span style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{CATEGORY_CONFIG[d.name]?.icon || '📦'}</span>
                      {d.name}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: d.fill }}>{fmt(d.value)}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${d.pct}%`, background: d.fill }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{d.pct.toFixed(1)}% of total expenses</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Monthly Trend */}
      {trend.length > 1 && (
        <div className="chart-container mb-24">
          <div className="chart-title">Monthly Income vs Expenses</div>
          <div className="chart-sub">Track your financial trend over time</div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--green)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--green)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--red)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--red)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                tickFormatter={v => `${MONTH_LABELS[v.split('-')[1]]} ${v.split('-')[0]}`}
                axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                tickFormatter={v => `$${(v/1000).toFixed(0)}K`}
                axisLine={false} tickLine={false} />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend wrapperStyle={{ fontSize: 13, color: 'var(--text-dim)' }} />
              <Area type="monotone" dataKey="income" name="Income" stroke="var(--green)" fill="url(#incGrad)" strokeWidth={2} dot={{ fill: 'var(--green)', r: 4 }} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="var(--red)" fill="url(#expGrad)" strokeWidth={2} dot={{ fill: 'var(--red)', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Spend Bar */}
      {catData.length > 0 && (
        <div className="chart-container">
          <div className="chart-title">Category Spending Overview</div>
          <div className="chart-sub">Spending amount per category</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={catData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                angle={-30} textAnchor="end" interval={0}
                axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                tickFormatter={v => `$${(v/1000).toFixed(0)}K`}
                axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v, n) => [fmt(v), n]}
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 8, fontSize: 13 }}
                labelStyle={{ color: 'var(--text)' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {catData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
