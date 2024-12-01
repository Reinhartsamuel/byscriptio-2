'use client';

import Navbar from '../components/ui/Navbar';
import PropTypes from 'prop-types';
import React from 'react';
import Footer from '../components/Footer';

export default function DashboardLayout({ children }) {
  return (
    <>
      <section>
        <Navbar />
        {children}
        <Footer />
      </section>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
