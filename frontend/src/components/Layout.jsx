import React from 'react';
import Sidebar from './layout/Sidebar';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content animate-in">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
