import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQAccordion() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'What is GST (Goods and Services Tax)?',
      answer: (
        <>
          <p>
            The <strong>Goods and Services Tax (GST)</strong> is a comprehensive, multi-stage, destination-based indirect tax 
            levied on the supply of goods and services in India.
          </p>
          <p>
            Introduced on July 1, 2017, it subsumed most of the previous indirect taxes (like VAT, excise duty, service tax, octroi, 
            and luxury tax) into a single, unified tax structure to create a common national market.
          </p>
        </>
      ),
    },
    {
      question: 'How do you calculate GST?',
      answer: (
        <>
          <p>GST calculations depend on whether you are adding tax to a base amount or removing it from a total price:</p>
          <p><strong>1. To Add GST (Inclusive of Tax):</strong></p>
          <ul>
            <li><code>GST Amount = Original Amount × (GST Rate / 100)</code></li>
            <li><code>Total Amount = Original Amount + GST Amount</code></li>
          </ul>
          <p><strong>2. To Remove GST (Exclusive of Tax):</strong></p>
          <ul>
            <li><code>Original Amount = Total Amount / (1 + GST Rate / 100)</code></li>
            <li><code>GST Amount = Total Amount - Original Amount</code></li>
          </ul>
        </>
      ),
    },
    {
      question: 'What is the difference between CGST, SGST, and IGST?',
      answer: (
        <>
          <p>Under the GST regime, three types of taxes are levied based on the transaction location:</p>
          <ul>
            <li>
              <strong>CGST (Central Goods and Services Tax):</strong> Levied by the Central Government on transactions happening 
              within a single state (intra-state transaction).
            </li>
            <li>
              <strong>SGST (State Goods and Services Tax):</strong> Levied by the State Government on transactions happening 
              within a single state (intra-state transaction). Note: It is equal to the CGST rate.
            </li>
            <li>
              <strong>IGST (Integrated Goods and Services Tax):</strong> Levied by the Central Government on transactions between 
              two different states (inter-state transactions).
            </li>
          </ul>
          <p>
            For example, on an intra-state supply of services with 18% GST, 9% is CGST and 9% is SGST. For an inter-state supply of 
            the same services, a full 18% IGST is collected.
          </p>
        </>
      ),
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="accordion">
        {faqs.map((faq, idx) => {
          const isOpen = activeIndex === idx;
          return (
            <div key={idx} className={`accordion-item ${isOpen ? 'open' : ''}`}>
              <button
                className="accordion-trigger"
                onClick={() => toggleAccordion(idx)}
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <ChevronDown className="accordion-chevron" />
              </button>
              <div
                className="accordion-content"
                style={{
                  maxHeight: isOpen ? '500px' : '0px',
                }}
              >
                <div className="accordion-content-inner">{faq.answer}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
