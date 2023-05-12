import React from 'react';
import PropTypes from 'prop-types';
import './radio-button.styl';

export default function RadioButton({
  name,
  id,
  value,
  onChange,
  checked,
  label,
  badge,
}) {
  return (
    <div className='radio-button'>
      <label htmlFor={id} className='builder-label base-1-semibold'>
        <input
          type='radio'
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          checked={checked}
        />
        <span className={`radio-control ${checked ? 'checked' : ''}`} />
        {label} {badge && <span className='badge caption-2-bold'>{badge}</span>}
      </label>
    </div>
  );
}

RadioButton.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  badge: PropTypes.string,
};
