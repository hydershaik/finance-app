import React, { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Upload from './components/Upload';
import Overview from './components/Overview';
import Transactions from './components/Transactions';
import Insights from './components/Insights';
import Investments from './components/Investments';
import { detectRecurring, isUnnecessary } from './utils/parser';
import { sampleTransactions } from './data/sampleData';

const DEFAULT_FILTERS = {
  category: 'all',
  type: 'all',
  source: 'all',
  search: '',
  dateFrom: '',
  dateTo: '',
};

export default function App() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const handleUpload = useCallback((txns) => {
    setAllTransactions(txns);
    setActiveTab('overview');
    setFilters(DEFAULT_FILTERS);
  }, []);

  const loadSample = useCallback(() => {
    const withRecurring = detectRecurring(sampleTransactions);
    setAllTransactions(withRecurring);
    setActiveTab('overview');
    setFilters(DEFAULT_FILTERS);
  }, []);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(t => {
      if (filters.category !== 'all' && t.category !== filters.category) return false;
      if (filters.type !== 'all' && t.type !== filters.type) return false;
      if (filters.source && filters.source !== 'all' && t.source !== filters.source) return false;
      if (filters.search && !t.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.dateFrom && t.date < filters.dateFrom) return false;
      if (filters.dateTo && t.date > filters.dateTo) return false;
      return true;
    });
  }, [allTransactions, filters]);

  const hasData = allTransactions.length > 0;

  return (
    <div className="app">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasData={hasData}
        txnCount={allTransactions.length}
      />
      <main className="main">
        {activeTab === 'upload' && (
          <Upload onUpload={handleUpload} onLoadSample={loadSample} />
        )}
        {activeTab === 'overview' && hasData && (
          <Overview
            transactions={filteredTransactions}
            filters={filters}
            setFilters={setFilters}
          />
        )}
        {activeTab === 'transactions' && hasData && (
          <Transactions
            transactions={filteredTransactions}
            filters={filters}
            setFilters={setFilters}
          />
        )}
        {activeTab === 'insights' && hasData && (
          <Insights transactions={allTransactions} />
        )}
        {activeTab === 'investments' && hasData && (
          <Investments transactions={allTransactions} />
        )}
      </main>
    </div>
  );
}
