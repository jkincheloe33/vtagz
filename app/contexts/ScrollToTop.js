import React, { useEffect, createContext, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router';

const ScrollCtx = createContext({});

export default function ScrollToTopProvider({ children }) {
  const location = useLocation();
  const ref = useRef();

  const scrollToTop = () => {
    window.scrollTo(0, 0);
    // account for main layout container
    if (ref.current) {
      ref.current?.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    scrollToTop();
  }, [location]);

  return (
    <ScrollCtx.Provider value={{ ref, scrollToTop }}>
      {children}
    </ScrollCtx.Provider>
  );
}

ScrollToTopProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export const useScrollContext = () => useContext(ScrollCtx);
