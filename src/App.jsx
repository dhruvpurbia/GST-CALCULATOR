import React, { useState, useEffect } from 'react';
import ThemeToggle from './components/ThemeToggle';
import Calculator from './components/Calculator';
import HistoryList from './components/HistoryList';
import FeatureCards from './components/FeatureCards';
import FAQAccordion from './components/FAQAccordion';
import Footer from './components/Footer';
import { Calculator as CalcIcon } from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // History state
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('gst_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Selected history calculation to load back into calculator
  const [selectedCalc, setSelectedCalc] = useState(null);

  // Sync theme to root HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleAddHistory = (item) => {
    setHistory((prev) => {
      // Avoid duplicate entries if the exact same calculation is run back-to-back
      if (prev.length > 0) {
        const last = prev[0];
        if (
          last.type === item.type &&
          Math.abs(last.amount - item.amount) < 0.01 &&
          last.rate === item.rate
        ) {
          return prev;
        }
      }
      const updated = [item, ...prev].slice(0, 10);
      localStorage.setItem('gst_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('gst_history');
  };

  const handleSelectCalculation = (item) => {
    setSelectedCalc(item);
  };

  return (
    <div className="app-container">
      {/* Visual Mesh Backgrounds */}
      <div className="bg-gradient-shapes">
        <div className="shape-1"></div>
        <div className="shape-2"></div>
      </div>

      {/* Navigation / Header */}
      <header>
        <div className="brand" onClick={() => window.location.reload()}>
          <CalcIcon className="brand-icon" />
          <span>GST Calculator Pro</span>
        </div>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </header>

      {/* Hero Header */}
      <section className="hero">
        <h1>India's Fast and Free GST Calculator</h1>
        <p>
          Calculate GST instantly with support for 3%, 5%, 12%, 18%, and 28% GST rates. 
          Generate downloadable PDF reports and access calculation logs offline.
        </p>
      </section>

      {/* Main Core Grid */}
      <main className="main-grid">
        <Calculator
          onAddHistory={handleAddHistory}
          theme={theme}
          selectedCalculation={selectedCalc}
        />
        <HistoryList
          history={history}
          onClearHistory={handleClearHistory}
          onSelectCalculation={handleSelectCalculation}
        />
      </main>

      {/* Supplemental Marketing & Information sections */}
      <FeatureCards />
      <FAQAccordion />

      {/* Footer credits */}
      <Footer />
    </div>
  );
}
