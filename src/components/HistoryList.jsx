import React from 'react';
import { Trash2, History, ArrowUpRight, ArrowDownRight, ClipboardCopy } from 'lucide-react';

export default function HistoryList({ history, onClearHistory, onSelectCalculation }) {
  return (
    <div className="glass-card history-section">
      <div className="history-header">
        <h3>
          <History className="brand-icon" style={{ width: '1.25rem', height: '1.25rem' }} />
          Recent Calculations
        </h3>
        {history.length > 0 && (
          <button onClick={onClearHistory} className="btn-clear" title="Clear all history">
            <Trash2 size={14} />
            Clear
          </button>
        )}
      </div>

      <div className="history-scroll">
        {history.length === 0 ? (
          <div className="history-empty">
            <History className="history-empty-icon" />
            <p style={{ fontWeight: 500 }}>No history yet</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Your calculations will be saved here automatically for quick access.
            </p>
          </div>
        ) : (
          history.map((item, idx) => (
            <div
              key={idx}
              className="history-item"
              onClick={() => onSelectCalculation(item)}
              title="Click to load into calculator"
            >
              <div className="history-item-top">
                <span className={`history-badge ${item.type === 'add' ? 'badge-add' : 'badge-remove'}`}>
                  {item.type === 'add' ? 'Added GST' : 'Removed GST'}
                </span>
                <span className="history-time">{item.timestamp}</span>
              </div>

              <div className="history-details">
                <div className="history-detail-col">
                  <span className="detail-lbl">Amount</span>
                  <span className="detail-val">₹{Math.round(item.amount)}</span>
                </div>
                <div className="history-detail-col">
                  <span className="detail-lbl">Rate</span>
                  <span className="detail-val">{item.rate}%</span>
                </div>
                <div className="history-detail-col">
                  <span className="detail-lbl">Result</span>
                  <span className="detail-val" style={{ color: 'var(--primary)' }}>
                    ₹{Math.round(item.result)}
                  </span>
                </div>
              </div>

              {/* Floating restore overlay icon */}
              <div
                style={{
                  position: 'absolute',
                  right: '10px',
                  bottom: '10px',
                  opacity: 0.15,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {item.type === 'add' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
