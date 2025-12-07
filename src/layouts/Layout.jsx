import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/layouts/Layout.css';

const Layout = () => {
  return (
    <div className="app-layout">
      {/* Background Ambient Lights untuk efek modern */}
      <div className="ambient-background">
        <div className="light-orb orb-1"></div>
        <div className="light-orb orb-2"></div>
      </div>

      <Navbar />
      
      <main className="main-content">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;