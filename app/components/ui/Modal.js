import { IoMdClose } from 'react-icons/io';
import PropTypes from 'prop-types';
import React from 'react';
export default function Modal({ open, onClose, children, size = '2xl' }) {
  return (
    // backdrop
    <div
      onClick={onClose}
      className={`
        fixed z-100 inset-0 flex justify-center items-center transition-colors
        ${open ? 'visible bg-gray-900 bg-opacity-90' : 'invisible'}
      `}
    >
      {/* modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          z-10
          bg-gray-800 rounded-xl shadow p-6 transition-ease-in-out duration-100 overflow-scroll max-h-screen
          ${open ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}
         w-${size}
        `}
      >
        <button
          onClick={onClose}
          className='absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-gray-600 hover:bg-gray-50 hover:text-gray-600'
        >
          <IoMdClose />
        </button>
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.any,
  children: PropTypes.any,
  size: PropTypes.string,
};
