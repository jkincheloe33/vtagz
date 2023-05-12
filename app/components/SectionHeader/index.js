import React from 'react';
import PropTypes from 'prop-types';
import './styles.styl';

export default function SectionHeader({ color = 'green', title, badge }) {
  return (
    <div className='section-header'>
      <div className={`section-color ${color}`} />
      <h2 className='section-title title-1-semibold'>{title}</h2>
      {badge && <span className='section-badge caption-2-bold'>{badge}</span>}
    </div>
  );
}

SectionHeader.propTypes = {
  color: PropTypes.oneOf(['blue', 'green', 'purple', 'yellow']),
  title: PropTypes.string.isRequired,
  badge: PropTypes.string,
};
