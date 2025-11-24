import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Teams', icon: '🏆' },
    { path: '/create', label: 'Create Team', icon: '➕' },
    { path: '/standings', label: 'Standings', icon: '📊' },
    { path: '/mvp', label: 'MVP', icon: '🏅' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="navbar-desktop">
        <div className="navbar-container">
          <div className="navbar-brand">
            <span className="brand-icon">🎮</span>
            <h1>MPL Indonesia</h1>
          </div>
          <ul className="navbar-menu">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="navbar-mobile">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <span className="mobile-nav-icon">{item.icon}</span>
            <span className="mobile-nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Navbar;
