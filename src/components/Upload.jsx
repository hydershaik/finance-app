import React, { useRef, useState } from 'react';
import { parseCsvFile, detectRecurring } from '../utils/parser';

export default function Upload({ onUpload, onLoadSample }) {
  const bankRef = useRef();
  const ccRef = useRef();
  const [bankFiles, setBankFiles] = useState([]);
  const [ccFiles, setCcFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bankDrag, setBankDrag] = useState(false);
  const [ccDrag, setCcDrag] = useState(false);

  const handleFiles = async (files, source, setFiles) => {
    const arr = Array.from(files).filter(f => f.name.endsWith('.csv'));
    if (!arr.length) { setError('Please upload CSV files only.'); return; }
    setFiles(prev => [...prev, ...arr]);
  };

  const handleProcess = async () => {
    const all = [
      ...bankFiles.map(f => ({ file: f, source: 'bank' })),
      ...ccFiles.map(f => ({ file: f, source: 'credit_card' })),
    ];
    if (!all.length) { setError('Please upload at least one file.'); return; }
    setLoading(true);
    setError('');
    try {
      const results = await Promise.all(all.map(({ file, source }) => parseCsvFile(file, source)));
      const merged = detectRecurring(results.flat());
      onUpload(merged);
    } catch (e) {
      setError('Failed to parse file. Please ensure it is a valid CSV.');
    }
    setLoading(false);
  };

  const dragProps = (onDrop, setDrag) => ({
    onDragOver: e => { e.preventDefault(); setDrag(true); },
    onDragLeave: () => setDrag(false),
    onDrop: e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files, null, onDrop); },
  });

  return (
    <div className="upload-page">
      <div className="upload-hero">
        <h1>Your Money,<br />Fully Understood</h1>
        <p>Upload your bank and credit card statements to get instant insights, spending analysis, and personalized financial advice.</p>
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
          <p>Drag & drop or click to upload your bank statement CSV</p>
          <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); bankRef.current?.click(); }}>
            Choose File
          </button>
          <input ref={bankRef} type="file" accept=".csv" multiple
            onChange={e => handleFiles(e.target.files, 'bank', setBankFiles)} />
          {bankFiles.length > 0 && (
            <div style={{ marginTop: 12 }}>
              {bankFiles.map((f, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--green)', marginTop: 4 }}>
                  ✓ {f.name}
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
          <p>Drag & drop or click to upload your credit card statement CSV</p>
          <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); ccRef.current?.click(); }}>
            Choose File
          </button>
          <input ref={ccRef} type="file" accept=".csv" multiple
            onChange={e => handleFiles(e.target.files, 'credit_card', setCcFiles)} />
          {ccFiles.length > 0 && (
            <div style={{ marginTop: 12 }}>
              {ccFiles.map((f, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--green)', marginTop: 4 }}>
                  ✓ {f.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sample Data */}
        <div className="sample-card" onClick={onLoadSample}>
          <div className="sample-card-icon">✨</div>
          <h3>Try with Sample Data</h3>
          <p>Explore all features with realistic sample transactions — no upload needed. See charts, insights, and investment recommendations instantly.</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={e => { e.stopPropagation(); onLoadSample(); }}>
            Load Sample Data →
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginTop: 16, color: 'var(--red)', fontSize: 14, background: 'rgba(239,68,68,0.1)', padding: '10px 16px', borderRadius: 8 }}>
          ⚠️ {error}
        </div>
      )}

      {(bankFiles.length > 0 || ccFiles.length > 0) && (
        <div style={{ marginTop: 20 }}>
          <button className="btn btn-primary" onClick={handleProcess} disabled={loading}>
            {loading ? '⏳ Processing...' : `🚀 Analyze ${bankFiles.length + ccFiles.length} File(s)`}
          </button>
        </div>
      )}

      <div style={{ marginTop: 40, maxWidth: 600, textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text-dim)' }}>Supported CSV formats:</strong> Most Indian bank exports work automatically.
          Columns detected: Date, Description/Narration, Amount/Debit/Credit. Your data stays in your browser — nothing is uploaded to any server.
        </p>
      </div>
    </div>
  );
}
