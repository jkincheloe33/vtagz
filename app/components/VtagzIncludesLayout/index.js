import React from 'react';
import PropTypes from 'prop-types';
import VtagzIncludesImage from '@/static/assets/sign-up-vtagz-includes.png';
import './styles.styl';

export default function VtagzIncludesLayout({ children }) {
  return (
    <div id='vtagz-includes-layout'>
      <div className='vtagz-includes'>
        <img src={VtagzIncludesImage} width={244} />
        <h2 className='heading-4'>VTAGZ includes</h2>
        <ul>
          <li>Cashback campaigns </li>
          <li>Automated SMS marketing</li>
          <li>Consumer insights</li>
          <li>Loyalty programs</li>
        </ul>
      </div>
      <div className='content'>{children}</div>
    </div>
  );
}

VtagzIncludesLayout.propTypes = {
  children: PropTypes.node,
};
