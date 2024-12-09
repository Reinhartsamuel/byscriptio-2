'use client';
import PropTypes from 'prop-types';
import React from 'react';
//  ${open ? 'visible bg-gray-900 bg-opacity-90' : 'invisible'}
const Drawer = ({ drawerOpen, children, toggleDrawer }) => {
  return (
    <>
      {drawerOpen && (
        <div className='absolute -z-200 top-0 left-0 w-screen h-screen bg-gray-900 bg-opacity-90' onClick={toggleDrawer} />
      )}
      <div
        className={`fixed top-0 z-10 left-0 w-full md:w-1/3 lg:w-xl h-full bg-white dark:bg-black shadow-lg
    transition-transform transform ${
      drawerOpen ? 'translate-x-0' : '-translate-x-full'
    }`}
      >
        {children}
      </div>
    </>
  );
};

export default Drawer;

Drawer.propTypes = {
  drawerOpen: PropTypes.bool,
  toggleDrawer: PropTypes.func,
  children: PropTypes.node,
};
