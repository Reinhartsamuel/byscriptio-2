'use client'
import { useMediaQuery } from 'react-responsive';

const breakpoints = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)',
};

const useBreakPointValue = () => {
  const isMobile = useMediaQuery({ query: breakpoints.mobile });
  const isTablet = useMediaQuery({ query: breakpoints.tablet });
  const isDesktop = useMediaQuery({ query: breakpoints.desktop });

  return { isMobile, isTablet, isDesktop };
};

export default useBreakPointValue;