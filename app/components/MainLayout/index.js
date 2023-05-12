import React from 'react';
import PropTypes from 'prop-types';
import { useNavigationContext } from '@/contexts/NavigationContext';
import { useScrollContext } from '@/contexts/ScrollToTop';
import './styles.styl';

export default function MainLayout({ children, hasFooter = false }) {
  const { showMenu } = useNavigationContext();
  const { ref } = useScrollContext();

  return (
    <div
      className={`main-layout ${showMenu ? 'show-menu' : ''} ${
        hasFooter ? 'has-footer' : ''
      }`}
    >
      <div className='content-container' ref={ref}>
        {children}
      </div>
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node,
  hasFooter: PropTypes.bool,
};
