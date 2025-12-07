import React from 'react';
import '../styles/components/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="brand-text">
            MPL <span className="brand-highlight">ID</span>
          </span>
          <span className="brand-tagline">
            Mobile Legends Professional League Indonesia
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;