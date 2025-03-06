import React from 'react';
import Navbar from '../Main/Navbar';
import Footer from '../Main/Footer';
import '../Main/Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
