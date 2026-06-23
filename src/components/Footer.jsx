import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer>
      {/* Mandatory Button */}
      <div>
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-hero"
          title="Visit Digital Heroes Co"
        >
          Built for Digital Heroes
          <ArrowUpRight className="btn-hero-icon" />
        </a>
      </div>

      {/* Developer details */}
      <div className="footer-credits">
        <p style={{ fontWeight: 600, color: 'var(--secondary)', marginBottom: '0.25rem' }}>
          Dhruv Purbia
        </p>
        <p>
          <a href="mailto:purbiadhruv8@gmail.com">purbiadhruv8@gmail.com</a>
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
          &copy; {new Date().getFullYear()} GST Calculator Pro. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
