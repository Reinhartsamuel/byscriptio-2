'use client'
import { useEffect, useState } from 'react';

const breakpoints = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)',
};

const useBreakPointValue = () => {
  const [breakpoint, setBreakpoint] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false
  });

  useEffect(() => {
    const updateBreakpoint = () => {
      setBreakpoint({
        isMobile: window.matchMedia(breakpoints.mobile).matches,
        isTablet: window.matchMedia(breakpoints.tablet).matches,
        isDesktop: window.matchMedia(breakpoints.desktop).matches
      });
    };

    // Initial check
    updateBreakpoint();

    // Add event listener for window resize
    window.addEventListener('resize', updateBreakpoint);

    // Cleanup
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
};

export default useBreakPointValue;