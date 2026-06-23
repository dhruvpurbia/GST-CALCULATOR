import React from 'react';
import { Zap, CheckCircle2, Gift, Smartphone } from 'lucide-react';

export default function FeatureCards() {
  const features = [
    {
      icon: <Zap size={24} />,
      title: 'Instant Calculation',
      description: 'Compute complex GST additions and exclusions in real time as you type, with zero lag.',
    },
    {
      icon: <CheckCircle2 size={24} />,
      title: 'Accurate Results',
      description: 'Perfect precision calculations aligned with CGST, SGST, and IGST breakdowns.',
    },
    {
      icon: <Gift size={24} />,
      title: 'Free to Use',
      description: 'Fully featured calculator with PDF downloads and history logging. No subscriptions, ever.',
    },
    {
      icon: <Smartphone size={24} />,
      title: 'Mobile Friendly',
      description: 'A responsive layout built to look great and work perfectly across all devices and screen sizes.',
    },
  ];

  return (
    <section className="features-section">
      <h2>Why Choose GST Calculator Pro?</h2>
      <div className="features-grid">
        {features.map((feature, idx) => (
          <div key={idx} className="glass-card feature-card">
            <div className="feature-icon-wrapper">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
