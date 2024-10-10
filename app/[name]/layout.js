'use client';

import Navbar from '../components/ui/Navbar';
import PropTypes from 'prop-types';
import React from 'react';

export default function DashboardLayout({ children }) {
  return (
    <>
      <section>
        <Navbar />
        {children}
      </section>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
