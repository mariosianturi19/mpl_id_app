import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/components/Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'TEAMS' },
    { path: '/standings', label: 'STANDINGS' },
    { path: '/mvp', label: 'MVP' },
    { path: '/teams', label: 'EDIT TEAMS' },
    { path: '/profile', label: 'PROFILE' },
  ];

  // Fungsi untuk cek apakah path aktif (termasuk sub-path)
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/teams') return location.pathname === '/teams' || location.pathname === '/create' || location.pathname.startsWith('/team/edit/');
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="navbar-desktop">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <img 
              src="https://id-mpl.com/images/s14/logo/LOGO_MPL-ID-NEW-2024-400.webp" 
              alt="MPL ID" 
              className="navbar-logo"
            />
          </Link>
          
          <ul className="navbar-menu">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
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
            <span className="mobile-nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Navbar;