import PropTypes from "prop-types";
import Footer from "../components/Footer";
import Navbar from "../components/ui/Navbar";
import React from 'react';


export default function BacktestLayout({ children }) {
  return (
    <div className='w-full'>
    <section>
      <Navbar />
      {children}
    </section>
    <Footer />
</div>
  )
}

BacktestLayout.propTypes = {
  children: PropTypes.node.isRequired
};