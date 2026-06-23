import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className="btn btn-secondary"
      style={{
        padding: '0.6rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
      }}
      aria-label="Toggle Theme"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
    >
      {theme === 'light' ? (
        <Moon className="brand-icon" style={{ strokeWidth: 2, width: '1.25rem', height: '1.25rem' }} />
      ) : (
        <Sun className="brand-icon" style={{ strokeWidth: 2, width: '1.25rem', height: '1.25rem', stroke: 'var(--primary)' }} />
      )}
    </button>
  );
}
