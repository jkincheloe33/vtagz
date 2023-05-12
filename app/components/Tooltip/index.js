import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import useHandleClickOut from '@/hooks/useHandleClickOut';
import TooltipIcon from '@/static/assets/tooltip-icon.svg';
import './tooltip.styl';

export default function Tooltip({ message }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useHandleClickOut(ref, () => {
    open && setOpen(false);
  });

  // adjust position of tooltip message
  useEffect(() => {
    if (ref?.current) {
      // accounts for position offset (e.g. left: 24px)
      const offset = 24;
      const innerWidth = window.innerWidth;
      const { width, x } = ref.current.getBoundingClientRect();
      // if true, the message is overflowing off the screen and we need to update left/right values
      const isNegative = innerWidth - (width + x + offset) < 0;
      ref.current.style.left = isNegative ? 'auto' : `${offset}px`;
      ref.current.style.right = isNegative ? `${offset}px` : 'auto';
    }
  }, []);

  return (
    <div className='custom-tooltip'>
      <img
        alt='Information icon'
        onClick={() => setOpen((open) => !open)}
        src={TooltipIcon}
      />
      <p className={`tooltip-message ${open ? 'open' : ''}`} ref={ref}>
        {message}
      </p>
    </div>
  );
}

Tooltip.propTypes = {
  message: PropTypes.string.isRequired,
};
