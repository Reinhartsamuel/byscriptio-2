import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/ui/Navbar';
import PropTypes from 'prop-types';
import React from 'react';

export default function AnnouncementLayout({ children }) {
  return (
    <>
      <div className='w-full'>
          <section>
            <Navbar />
            {children}
          </section>
          <Footer />
      </div>
    </>
  );
}

AnnouncementLayout.propTypes = {
  children: PropTypes.node,
};
