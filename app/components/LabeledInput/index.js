import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import './styles.styl';

// shows a small label inside the input element and above the placeholder/value
export default function LabeledInput({ label, placeholder, value, onChange }) {
  const id = uuidv4();

  return (
    <div className='labeled-input'>
      <label htmlFor={`labeled-input-${id}`} className='caption-2-medium'>
        {label}
      </label>
      <input
        type='text'
        placeholder={placeholder}
        name={`labeled-input-${id}`}
        id={`labeled-input-${id}`}
        className='base-1-semibold'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

LabeledInput.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
