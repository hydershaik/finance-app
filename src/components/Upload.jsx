import React, { useRef, useState } from 'react';
import { parseCsvFile, detectRecurring } from '../utils/parser';
import { parsePdfFile } from '../utils/pdfParser';

const ACCEPT = '.csv,.pdf';

function fileIcon(name) {
  return name.toLowerCase().endsWith('.pdf') ? '📄' : '📊';
}

function parseFile(file, source) {
  if (file.name.toLowerCase().endsWith('.pdf')) return parsePdfFile(file, source);
  return parseCsvFile(file, source);
}

export default function Upload({ onUpload, onLoadSample }) {
  const bankRef = useRef();
  const ccRef = useRef();
  const [bankFiles, setBankFiles] = useState([]);
  const [ccFiles, setCcFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState('');
  const [bankDrag, setBankDrag] = useState(false);
  const [ccDrag, setCcDrag] = useState(false);

  const handleFiles = (files, setFiles) => {
    const arr = Array.from(files).filter(f =>
      f.name.toLowerCase().endsWith('.csv') || f.name.toLowerCase().endsWith('.pdf')
    );
    if (!arr.length) { setError('Please upload CSV or PDF files only.'); return; }
    setError('');
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.name));
      return [...prev, ...arr.filter(f => !existing.has(f.name))];
    });
  };

  const removeFile = (name, setFiles) => {
    setFiles(prev => prev.filter(f => f.name !== name));
  };

  const handleProcess = async () => {
    const all = [
      ...bankFiles.map(f => ({ file: f, source: 'bank' })),
      ...ccFiles.map(f => ({ file: f, source: 'credit_card' })),
    ];
    if (!all.length) { setError('Please upload at least one file.'); return; }
    setLoading(true);
    setError('');

    const results = [];
    for (const { file, source } of all) {
      setLoadingMsg(`Parsing ${file.name}…`);
      try {
        const txns = await parseFile(file, source);
        results.push(...txns);
      } catch (e) {
        setError(`Failed to parse "${file.name}". Ensure it is a valid bank statement PDF or CSV.`);
        setLoading(false);
        setLoadingMsg('');
        return;
      }
    }

    setLoadingMsg('Detecting recurring payments…');
    const merged = detectRecurring(results);
    setLoading(false);
    setLoadingMsg('');
    onUpload(merged);
  };

  const dragProps = (setFiles, setDrag) => ({
    onDragOver: e => { e.preventDefault(); setDrag(true); },
    onDragLeave: () => setDrag(false),
    onDrop: e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files, setFiles); },
  });

  const totalFiles = bankFiles.length + ccFiles.length;

  return (
    <div className="upload-page">
      <div className="upload-hero">
        <h1>Your Money,<br />Fully Understood</h1>
        <p>Upload your bank and credit card statements (PDF or CSV) to get instant insights, spending analysis, and personalized financial advice.</p>
      </div>

      <div className="upload-grid">
        {/* Bank Statement */}
        <div
          className={`upload-zone${bankDrag ? ' drag-over' : ''}`}
          onClick={() => bankRef.current?.click()}
          {...dragProps(setBankFiles, setBankDrag)}
        >
          <div className="upload-zone-icon">🏦</div>
          <h3>Bank Statement</h3>
          <p>Drag & drop or click to upload<br />
            <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>PDF</span> or{' '}
            <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>CSV</span>
          </p>
          <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); bankRef.current?.click(); }}>
            Choose File
          </button>
          <input ref={bankRef} type="file" accept={ACCEPT} multiple
            onChange={e => handleFiles(e.target.files, setBankFiles)} />
          {bankFiles.length > 0 && (
            <div style={{ marginTop: 12, width: '100%' }}>
              {bankFiles.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--green)', marginTop: 5 }}>
                  <span>{fileIcon(f.name)}</span>
                  <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                  <button
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, padding: '0 2px' }}
                    onClick={e => { e.stopPropagation(); removeFile(f.name, setBankFiles); }}
                  >✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Credit Card Statement */}
        <div
          className={`upload-zone${ccDrag ? ' drag-over' : ''}`}
          onClick={() => ccRef.current?.click()}
          {...dragProps(setCcFiles, setCcDrag)}
        >
          <div className="upload-zone-icon">💳</div>
          <h3>Credit Card Statement</h3>
          <p>Drag & drop or click to upload<br />
            <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>PDF</span> or{' '}
            <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>CSV</span>
          </p>
          <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); ccRef.current?.click(); }}>
            Choose File
          </button>
          <input ref={ccRef} type="file" accept={ACCEPT} multiple
            onChange={e => handleFiles(e.target.files, setCcFiles)} />
          {ccFiles.length > 0 && (
            <div style={{ marginTop: 12, width: '100%' }}>
              {ccFiles.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--green)', marginTop: 5 }}>
                  <span>{fileIcon(f.name)}</span>
                  <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                  <button
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, padding: '0 2px' }}
                    onClick={e => { e.stopPropagation(); removeFile(f.name, setCcFiles); }}
                  >✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sample Data */}
        <div className="sample-card" onClick={onLoadSample}>
          <div className="sample-card-icon">✨</div>
          <h3>Try with Sample Data</h3>
          <p>Explore all features instantly with realistic sample transactions — no upload needed.</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={e => { e.stopPropagation(); onLoadSample(); }}>
            Load Sample Data →
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginTop: 16, color: 'var(--red)', fontSize: 14, background: 'rgba(239,68,68,0.1)', padding: '10px 16px', borderRadius: 8, maxWidth: 760 }}>
          ⚠️ {error}
        </div>
      )}

      {totalFiles > 0 && (
        <div style={{ marginTop: 20 }}>
          <button className="btn btn-primary" onClick={handleProcess} disabled={loading}>
            {loading ? `⏳ ${loadingMsg}` : `🚀 Analyze ${totalFiles} File${totalFiles > 1 ? 's' : ''}`}
          </button>
        </div>
      )}

      {/* Format info */}
      <div style={{ marginTop: 40, maxWidth: 680, textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          {[
            { icon: '📄', label: 'PDF Statements', desc: 'Chase, Bank of America, Wells Fargo, Citi, Capital One, Discover — text-based PDFs' },
            { icon: '📊', label: 'CSV Exports', desc: 'Downloaded from online banking — Date, Description, Amount columns' },
          ].map(f => (
            <div key={f.label} style={{
              background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10,
              padding: '12px 20px', fontSize: 13, textAlign: 'left', flex: '1', minWidth: 220,
            }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{f.label}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
          🔒 Your data is processed entirely in your browser. Nothing is sent to any server.
        </p>
      </div>
    </div>
  );
}
