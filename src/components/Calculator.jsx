import React, { useState, useEffect } from 'react';
import { Copy, Download, RotateCcw, HelpCircle, Check, AlertCircle, Printer } from 'lucide-react';

export default function Calculator({ onAddHistory, theme, selectedCalculation }) {
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'remove'
  const [amountText, setAmountText] = useState('');
  const [gstRate, setGstRate] = useState(18); // 3, 5, 12, 18, 28
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [calculations, setCalculations] = useState(null);

  // Load selected calculation from history
  useEffect(() => {
    if (selectedCalculation) {
      setAmountText(String(selectedCalculation.amount));
      setGstRate(selectedCalculation.rate);
      setActiveTab(selectedCalculation.type);
    }
  }, [selectedCalculation]);

  // Quick rate percentages
  const rates = [3, 5, 12, 18, 28];

  // Perform calculation
  useEffect(() => {
    // Clear calculations if input is empty
    if (!amountText.trim()) {
      setCalculations(null);
      setError('');
      return;
    }

    const parsedVal = parseFloat(amountText);

    // Validate Input
    if (isNaN(parsedVal)) {
      setError('Please enter a valid numeric amount.');
      setCalculations(null);
      return;
    }

    if (parsedVal < 0) {
      setError('Amount cannot be negative.');
      setCalculations(null);
      return;
    }

    setError('');

    let originalAmt = 0;
    let gstAmt = 0;
    let finalAmt = 0;

    if (activeTab === 'add') {
      originalAmt = parsedVal;
      gstAmt = originalAmt * (gstRate / 100);
      finalAmt = originalAmt + gstAmt;
    } else {
      finalAmt = parsedVal;
      originalAmt = finalAmt / (1 + gstRate / 100);
      gstAmt = finalAmt - originalAmt;
    }

    const cgst = gstAmt / 2;
    const sgst = gstAmt / 2;

    const newCalcs = {
      original: originalAmt,
      gst: gstAmt,
      cgst: cgst,
      sgst: sgst,
      final: finalAmt,
      rate: gstRate,
      type: activeTab,
    };

    setCalculations(newCalcs);
  }, [amountText, gstRate, activeTab]);

  // Log to history on blur or when they choose an action (copy/download)
  const logToHistory = (customCalcs = calculations) => {
    if (!customCalcs) return;
    onAddHistory({
      type: customCalcs.type,
      amount: customCalcs.type === 'add' ? customCalcs.original : customCalcs.final,
      rate: customCalcs.rate,
      gst: customCalcs.gst,
      result: customCalcs.type === 'add' ? customCalcs.final : customCalcs.original,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });
  };

  const handleBlur = () => {
    if (calculations) {
      logToHistory();
    }
  };

  const handleReset = () => {
    setAmountText('');
    setGstRate(18);
    setError('');
    setCalculations(null);
  };

  const handleCopy = async () => {
    if (!calculations) return;

    // Log to history on click
    logToHistory();

    const text = `GST Calculator Pro Summary:
-----------------------------
Type: ${calculations.type === 'add' ? 'Add GST (Inclusive)' : 'Remove GST (Exclusive)'}
Original Amount: ₹${calculations.original.toFixed(2)}
GST Rate: ${calculations.rate}%
GST Amount: ₹${calculations.gst.toFixed(2)} (CGST: ₹${calculations.cgst.toFixed(2)}, SGST: ₹${calculations.sgst.toFixed(2)})
Final Amount: ₹${calculations.final.toFixed(2)}
-----------------------------
Generated via GST Calculator Pro`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleDownloadPDF = () => {
    if (!calculations) return;

    // Log to history on click
    logToHistory();

    const isAdd = calculations.type === 'add';
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const fmt = (n) => '\u20b9 ' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const receiptNo = 'GST-' + Date.now().toString().slice(-8);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>GST Receipt - ${receiptNo}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', Arial, sans-serif;
      background: #f1f5f9;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      padding: 30px 20px;
    }
    .receipt {
      background: #ffffff;
      width: 680px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.12);
    }
    /* ---- HEADER ---- */
    .header {
      background: linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%);
      color: #fff;
      padding: 32px 36px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .header-left h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 4px;
    }
    .header-left p {
      font-size: 12px;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 500;
    }
    .header-right {
      text-align: right;
    }
    .header-right .receipt-no {
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .header-right .site {
      margin-top: 8px;
      font-size: 11px;
      opacity: 0.75;
    }
    /* ---- META INFO ---- */
    .meta {
      background: #f8fafc;
      padding: 18px 36px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e2e8f0;
    }
    .meta-item label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      font-weight: 600;
      display: block;
      margin-bottom: 3px;
    }
    .meta-item span {
      font-size: 13px;
      font-weight: 600;
      color: #334155;
    }
    /* ---- BODY ---- */
    .body { padding: 28px 36px; }
    .section-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 700;
      color: #94a3b8;
      margin-bottom: 14px;
    }
    /* ---- TABLE ---- */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    thead tr {
      background: #1e40af;
      color: #fff;
    }
    thead th {
      padding: 12px 16px;
      font-size: 12px;
      font-weight: 600;
      text-align: left;
      letter-spacing: 0.5px;
    }
    thead th:last-child, tbody td:last-child { text-align: right; }
    tbody tr { border-bottom: 1px solid #f1f5f9; }
    tbody tr:hover { background: #f8fafc; }
    tbody td {
      padding: 13px 16px;
      font-size: 14px;
      color: #334155;
    }
    tbody td .label { font-weight: 600; color: #1e293b; }
    tbody td .sub  { font-size: 11px; color: #94a3b8; margin-top: 2px; }
    .row-total {
      background: linear-gradient(90deg, #eff6ff, #f0fdf4) !important;
      border-top: 2px solid #2563eb !important;
      border-bottom: 2px solid #2563eb !important;
    }
    .row-total td { font-size: 15px !important; font-weight: 700 !important; color: #1e40af !important; }
    /* ---- SUMMARY BOX ---- */
    .summary-box {
      background: linear-gradient(135deg, #eff6ff, #f0f9ff);
      border: 1.5px solid #bfdbfe;
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .summary-box .final-label {
      font-size: 13px;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 4px;
    }
    .summary-box .final-amount {
      font-family: 'Outfit', sans-serif;
      font-size: 34px;
      font-weight: 800;
      color: #1e40af;
      letter-spacing: -1px;
    }
    .summary-box .badge {
      background: #1e40af;
      color: #fff;
      border-radius: 50px;
      padding: 8px 20px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    /* ---- NOTES ---- */
    .notes {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      border-radius: 6px;
      padding: 12px 16px;
      font-size: 12px;
      color: #78350f;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    /* ---- FOOTER ---- */
    .footer {
      background: #0f172a;
      color: #cbd5e1;
      padding: 20px 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-left p { font-size: 12px; line-height: 1.7; }
    .footer-left strong { color: #fff; font-size: 13px; }
    .footer-left a { color: #60a5fa; text-decoration: none; }
    .hero-btn {
      background: linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6);
      color: #fff;
      padding: 10px 20px;
      border-radius: 50px;
      font-size: 12px;
      font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
    }
    /* ---- PRINT OVERRIDES ---- */
    @media print {
      body { background: #fff; padding: 0; }
      .receipt { box-shadow: none; border-radius: 0; width: 100%; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="receipt">

    <!-- HEADER -->
    <div class="header">
      <div class="header-left">
        <h1>&#x1F9FE; GST Calculator Pro</h1>
        <p>Official GST Calculation Receipt</p>
      </div>
      <div class="header-right">
        <div class="receipt-no">${receiptNo}</div>
        <div class="site">digitalheroesco.com</div>
      </div>
    </div>

    <!-- META -->
    <div class="meta">
      <div class="meta-item"><label>Date</label><span>${dateStr}</span></div>
      <div class="meta-item"><label>Time</label><span>${timeStr}</span></div>
      <div class="meta-item"><label>GST Rate</label><span>${calculations.rate}%</span></div>
      <div class="meta-item"><label>Mode</label><span>${isAdd ? 'Add GST' : 'Remove GST'}</span></div>
    </div>

    <!-- BODY -->
    <div class="body">
      <div class="section-title">Calculation Breakdown</div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align:center">Rate</th>
            <th>Amount (INR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><div class="label">Base / Original Price</div><div class="sub">Pre-tax amount</div></td>
            <td style="text-align:center">—</td>
            <td>${fmt(calculations.original)}</td>
          </tr>
          <tr>
            <td><div class="label">CGST (Central GST)</div><div class="sub">Central Government Tax</div></td>
            <td style="text-align:center">${(calculations.rate / 2).toFixed(1)}%</td>
            <td>${fmt(calculations.cgst)}</td>
          </tr>
          <tr>
            <td><div class="label">SGST (State GST)</div><div class="sub">State Government Tax</div></td>
            <td style="text-align:center">${(calculations.rate / 2).toFixed(1)}%</td>
            <td>${fmt(calculations.sgst)}</td>
          </tr>
          <tr>
            <td><div class="label">Total GST Amount</div><div class="sub">CGST + SGST combined</div></td>
            <td style="text-align:center">${calculations.rate}%</td>
            <td>${fmt(calculations.gst)}</td>
          </tr>
          <tr class="row-total">
            <td><div class="label">&#9733; Final Amount (Incl. GST)</div></td>
            <td style="text-align:center">${calculations.rate}%</td>
            <td>${fmt(calculations.final)}</td>
          </tr>
        </tbody>
      </table>

      <!-- FINAL AMOUNT BOX -->
      <div class="summary-box">
        <div>
          <div class="final-label">Net Payable Amount</div>
          <div class="final-amount">${fmt(calculations.final)}</div>
        </div>
        <div class="badge">GST ${calculations.rate}% Applied</div>
      </div>

      <!-- NOTES -->
      <div class="notes">
        &#9432; <strong>Note:</strong> CGST &amp; SGST are each 50% of total GST (applicable for intra-state transactions).
        For inter-state transactions, IGST = ${fmt(calculations.gst)} at ${calculations.rate}% applies.
        This receipt is for informational purposes only.
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <div class="footer-left">
        <p><strong>Dhruv Purbia</strong></p>
        <p><a href="mailto:purbiadhruv8@gmail.com">purbiadhruv8@gmail.com</a></p>
        <p style="margin-top:4px; font-size:11px; opacity:0.6;">Generated by GST Calculator Pro &bull; ${receiptNo}</p>
      </div>
      <a href="https://digitalheroesco.com" class="hero-btn">Built for Digital Heroes &#x2197;</a>
    </div>

  </div>

  <script>
    // Auto-trigger print dialog (Save as PDF or Print)
    window.onload = function() {
      setTimeout(function() { window.print(); }, 600);
    };
  <\/script>
</body>
</html>`;

    // Open in a new window and print
    const printWindow = window.open('', '_blank', 'width=760,height=900,scrollbars=yes');
    if (!printWindow) {
      alert('Please allow pop-ups for this site to download the PDF receipt.');
      return;
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="glass-card">
      {/* Switch mode tabs */}
      <div className="tabs">
        <button
          onClick={() => setActiveTab('add')}
          className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
        >
          Add GST
        </button>
        <button
          onClick={() => setActiveTab('remove')}
          className={`tab-btn ${activeTab === 'remove' ? 'active' : ''}`}
        >
          Remove GST
        </button>
      </div>

      {/* Input section */}
      <div className="form-group">
        <label htmlFor="amount">
          {activeTab === 'add' ? 'Original Amount (Net Price)' : 'Total Amount (Gross Price incl. GST)'}
        </label>
        <div className="input-container">
          <span className="input-prefix">₹</span>
          <input
            id="amount"
            type="text"
            className={`glass-input ${error ? 'error-state' : ''}`}
            placeholder={activeTab === 'add' ? 'e.g. 1000' : 'e.g. 1180'}
            value={amountText}
            onChange={(e) => setAmountText(e.target.value)}
            onBlur={handleBlur}
          />
        </div>
        {error && (
          <div className="error-msg">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Quick rate options */}
      <div className="form-group">
        <label>Select GST Rate</label>
        <div className="quick-rates">
          {rates.map((rate) => (
            <button
              key={rate}
              onClick={() => setGstRate(rate)}
              className={`rate-btn ${gstRate === rate ? 'active' : ''}`}
            >
              {rate}%
            </button>
          ))}
        </div>
      </div>

      {/* Custom rate select dropdown */}
      <div className="form-group">
        <label htmlFor="custom-rate">Custom GST Rate (%)</label>
        <div className="select-wrapper">
          <select
            id="custom-rate"
            value={gstRate}
            onChange={(e) => setGstRate(Number(e.target.value))}
          >
            {rates.includes(gstRate) ? null : <option value={gstRate}>{gstRate}% (Custom)</option>}
            <option value={3}>3% (Gold, Diamonds)</option>
            <option value={5}>5% (Household items, Food)</option>
            <option value={12}>12% (Computers, Processed foods)</option>
            <option value={18}>18% (Services, Electronics)</option>
            <option value={28}>28% (Luxury goods, Cars)</option>
          </select>
          <HelpCircle className="select-arrow" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="actions-grid">
        <button onClick={handleReset} className="btn btn-secondary btn-full">
          <RotateCcw size={16} />
          Reset Calculator
        </button>
      </div>

      {/* Results Display */}
      {calculations && (
        <div className="results-card">
          <div className="result-row">
            <span className="result-label">Base/Original Price:</span>
            <span className="result-value">₹{calculations.original.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="result-row">
            <span className="result-label">
              CGST <small style={{ color: 'var(--text-muted)' }}>(Central - {calculations.rate / 2}%)</small>:
            </span>
            <span className="result-value">₹{calculations.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="result-row">
            <span className="result-label">
              SGST <small style={{ color: 'var(--text-muted)' }}>(State - {calculations.rate / 2}%)</small>:
            </span>
            <span className="result-value">₹{calculations.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Total GST Tax ({calculations.rate}%):</span>
            <span className="result-value">₹{calculations.gst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="result-row" style={{ borderBottom: 'none', marginTop: '0.5rem' }}>
            <span className="result-label" style={{ fontWeight: '700', color: 'var(--secondary)' }}>Net Final Price:</span>
            <span className="result-value highlight">₹{calculations.final.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          <div className="result-actions">
            <button onClick={handleCopy} className="btn btn-secondary btn-action">
              {copied ? <Check size={16} style={{ color: 'var(--success)' }} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Summary'}
            </button>
            <button onClick={handleDownloadPDF} className="btn btn-primary btn-action">
              <Download size={16} />
              PDF Report
            </button>
          </div>
        </div>
      )}

      {/* Copy Toast notifications */}
      {copied && (
        <div className="toast">
          <Check size={18} style={{ color: '#34d399' }} />
          <span>Summary copied to clipboard!</span>
        </div>
      )}
    </div>
  );
}
