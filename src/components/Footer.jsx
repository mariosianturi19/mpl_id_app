import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-text">
            © 2024 MPL Indonesia. All rights reserved.
          </p>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy</a>
            <span className="footer-divider">•</span>
            <a href="#" className="footer-link">Terms</a>
            <span className="footer-divider">•</span>
            <a href="#" className="footer-link">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
