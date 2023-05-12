import React from 'react';
import PropTypes from 'prop-types';
import './pro-button.styl';

export default function ProButton({ icon, onClick, specialText, text }) {
  return (
    <div className='pro-button' onClick={onClick}>
      <div className='pro-icon'>
        <img alt={`${text} icon`} src={icon} />
      </div>
      <div>
        <p>{text}</p>
        <span className={`pro-detail ${specialText.status ?? ''}`}>
          {specialText.text}
        </span>
      </div>
    </div>
  );
}

ProButton.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  specialText: PropTypes.shape({
    status: PropTypes.oneOf(['draft', 'active', 'inactive']),
    text: PropTypes.string.isRequired,
  }).isRequired,
  text: PropTypes.string.isRequired,
};
