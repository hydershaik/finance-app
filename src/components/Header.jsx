import React from 'react';

const TABS = [
  { id: 'upload', label: '⬆ Upload' },
  { id: 'overview', label: '📊 Overview', requiresData: true },
  { id: 'transactions', label: '📋 Transactions', requiresData: true },
  { id: 'insights', label: '💡 Insights', requiresData: true },
  { id: 'investments', label: '📈 Investments', requiresData: true },
];

export default function Header({ activeTab, setActiveTab, hasData, txnCount }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <div className="logo-icon">💹</div>
          FinanceIQ
        </div>
        <nav className="nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`nav-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              disabled={tab.requiresData && !hasData}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          {hasData && (
            <span className="badge">{txnCount} transactions</span>
          )}
        </div>
      </div>
    </header>
  );
}
