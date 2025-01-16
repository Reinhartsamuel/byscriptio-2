import { cn } from '@/lib/util';
import PropTypes from 'prop-types';
import React from 'react';

const Tooltip = ({ children, text, className }) => {
    return (
        <div className={cn("relative inline-block group", className)}>
            <div className="cursor-pointer">
                {children}
            </div>
            <div className="absolute bottom-full mb-2 w-[20rem] lg:w-[50rem] p-2 text-sm text-white bg-gray-600 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {text}
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-5px] w-0 h-0 border-l-5 border-r-5 border-t-5 border-transparent border-b-gray-800"></div>
            </div>
        </div>
    );
};

export default Tooltip;

Tooltip.propTypes = {
    children: PropTypes.node,
    text: PropTypes.string,
    className: PropTypes.string
}