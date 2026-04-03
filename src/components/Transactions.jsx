import React, { useState, useMemo } from 'react';
import { CATEGORY_CONFIG, fmt } from '../utils/parser';

const PAGE_SIZE = 15;
const OTHER_COLOR = '#64748b';

function getColor(cat) { return CATEGORY_CONFIG[cat]?.color || OTHER_COLOR; }
function getBg(cat) { return CATEGORY_CONFIG[cat]?.bg || 'rgba(100,116,139,0.15)'; }
function getIcon(cat) { return CATEGORY_CONFIG[cat]?.icon || '📦'; }

export default function Transactions({ transactions, filters, setFilters }) {
  const [sort, setSort] = useState({ key: 'date', dir: -1 });
  const [page, setPage] = useState(1);

  const handleSort = key => {
    setSort(s => s.key === key ? { key, dir: -s.dir } : { key, dir: -1 });
    setPage(1);
  };

  const sorted = useMemo(() => {
    return [...transactions].sort((a, b) => {
      let av = a[sort.key], bv = b[sort.key];
      if (sort.key === 'date') { av = new Date(av); bv = new Date(bv); }
      if (sort.key === 'amount') { av = Number(av); bv = Number(bv); }
      return av < bv ? -sort.dir : av > bv ? sort.dir : 0;
    });
  }, [transactions, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const SortIcon = ({ k }) => {
    if (sort.key !== k) return <span style={{ color: 'var(--border-light)' }}> ↕</span>;
    return <span style={{ color: 'var(--primary-light)' }}>{sort.dir === 1 ? ' ↑' : ' ↓'}</span>;
  };

  const categories = ['all', ...Object.keys(CATEGORY_CONFIG), 'Other'];

  return (
    <div className="tab-content">
      {/* Filters */}
      <div className="filters-bar mb-16">
        <div className="filter-group">
          <span className="filter-label">Search</span>
          <input
            type="text"
            className="filter-input"
            placeholder="Search description..."
            value={filters.search}
            onChange={e => { setFilters(f => ({ ...f, search: e.target.value })); setPage(1); }}
          />
        </div>
        <div className="filter-group">
          <span className="filter-label">Category</span>
          <select className="filter-select" value={filters.category}
            onChange={e => { setFilters(f => ({ ...f, category: e.target.value })); setPage(1); }}>
            {categories.map(c => (
              <option key={c} value={c}>{c === 'all' ? 'All Categories' : `${getIcon(c)} ${c}`}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">Type</span>
          <select className="filter-select" value={filters.type}
            onChange={e => { setFilters(f => ({ ...f, type: e.target.value })); setPage(1); }}>
            <option value="all">All</option>
            <option value="credit">💰 Income</option>
            <option value="debit">💸 Expenses</option>
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">Source</span>
          <select className="filter-select" value={filters.source || 'all'}
            onChange={e => { setFilters(f => ({ ...f, source: e.target.value })); setPage(1); }}>
            <option value="all">All Sources</option>
            <option value="bank">🏦 Bank</option>
            <option value="credit_card">💳 Credit Card</option>
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">From</span>
          <input type="date" className="filter-input" value={filters.dateFrom}
            onChange={e => { setFilters(f => ({ ...f, dateFrom: e.target.value })); setPage(1); }} />
        </div>
        <div className="filter-group">
          <span className="filter-label">To</span>
          <input type="date" className="filter-input" value={filters.dateTo}
            onChange={e => { setFilters(f => ({ ...f, dateTo: e.target.value })); setPage(1); }} />
        </div>
        <button className="filter-clear"
          onClick={() => { setFilters({ category: 'all', type: 'all', search: '', dateFrom: '', dateTo: '', source: 'all' }); setPage(1); }}>
          ✕ Clear
        </button>
      </div>

      {/* Stats Row */}
      <div className="flex gap-16 mb-16" style={{ flexWrap: 'wrap' }}>
        {[
          { label: 'Showing', val: `${sorted.length} transactions`, color: 'var(--text-dim)' },
          { label: 'Income', val: fmt(transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)), color: 'var(--green)' },
          { label: 'Expenses', val: fmt(transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)), color: 'var(--red)' },
          { label: 'Recurring', val: `${transactions.filter(t => t.isRecurring).length} items`, color: 'var(--cyan)' },
          { label: 'Flagged', val: `${transactions.filter(t => t.isUnnecessary).length} items`, color: 'var(--red)' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '8px 16px', fontSize: 13,
          }}>
            <span style={{ color: 'var(--text-muted)' }}>{s.label}: </span>
            <span style={{ fontWeight: 700, color: s.color }}>{s.val}</span>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className={sort.key === 'date' ? 'sorted' : ''} onClick={() => handleSort('date')}>
                Date <SortIcon k="date" />
              </th>
              <th>Description</th>
              <th className={sort.key === 'category' ? 'sorted' : ''} onClick={() => handleSort('category')}>
                Category <SortIcon k="category" />
              </th>
              <th className={sort.key === 'amount' ? 'sorted' : ''} onClick={() => handleSort('amount')} style={{ textAlign: 'right' }}>
                Amount <SortIcon k="amount" />
              </th>
              <th>Source</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state" style={{ padding: '40px 0' }}>
                    <div className="empty-state-icon">🔍</div>
                    <h3>No transactions found</h3>
                    <p>Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : paginated.map(t => (
              <tr key={t.id}>
                <td style={{ color: 'var(--text-dim)', fontSize: 13, whiteSpace: 'nowrap' }}>
                  {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="desc-cell">
                  <div className="desc-main">{t.description}</div>
                </td>
                <td>
                  <span className="category-badge"
                    style={{ background: getBg(t.category), color: getColor(t.category) }}>
                    {getIcon(t.category)} {t.category}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className={t.type === 'credit' ? 'amount-credit' : 'amount-debit'}>
                    {t.type === 'credit' ? '+' : '-'}{fmt(t.amount)}
                  </span>
                </td>
                <td>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 8px',
                    borderRadius: 4,
                    background: t.source === 'bank' ? 'rgba(99,102,241,0.12)' : 'rgba(236,72,153,0.12)',
                    color: t.source === 'bank' ? 'var(--primary-light)' : 'var(--pink)',
                  }}>
                    {t.source === 'bank' ? '🏦 Bank' : '💳 CC'}
                  </span>
                </td>
                <td>
                  <div className="flex gap-8" style={{ flexWrap: 'wrap', minWidth: 80 }}>
                    {t.isRecurring && <span className="tag tag-recurring">↻ Recurring</span>}
                    {t.isUnnecessary && <span className="tag tag-flagged">⚠ Review</span>}
                    {t.category === 'Investments' && <span className="tag tag-investment">📈 Invest</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="pagination-info">
          Page {page} of {totalPages} · {sorted.length} total
        </div>
        <div className="pagination-btns">
          <button className="page-btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
          <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const start = Math.max(1, Math.min(page - 2, totalPages - 4));
            const p = start + i;
            if (p > totalPages) return null;
            return (
              <button key={p} className={`page-btn${p === page ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>
            );
          })}
          <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
          <button className="page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
        </div>
      </div>
    </div>
  );
}
