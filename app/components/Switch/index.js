import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import Tooltip from '@/components/Tooltip';
import './styles.styl';

// basic switch button with an optional label
function Switch({ label, status, onChange, tooltip }) {
  const id = uuidv4();

  return (
    <div className='switch'>
      {label && (
        <div className='tooltip-label'>
          <label htmlFor={`switch-${id}`} className='switch-label base-2'>
            {label}
          </label>
          {tooltip && <Tooltip message={tooltip} />}
        </div>
      )}
      <div
        className={`switch-bar ${status ? 'active' : ''}`}
        onClick={() => onChange(!status)}
      >
        <div className='switch-handle' />
      </div>
      <input
        type='checkbox'
        name={`switch-${id}`}
        id={`switch-${id}`}
        value={status}
        hidden
        onClick={() => onChange(!status)}
      />
    </div>
  );
}

Switch.propTypes = {
  label: PropTypes.string,
  status: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  tooltip: PropTypes.string,
};

export default memo(Switch);
