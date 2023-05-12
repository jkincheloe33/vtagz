import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import useHandleClickOut from '@/hooks/useHandleClickOut';
import './styles.styl';

export default function GenericModal({ children, handleClose, open = false }) {
  const ref = useRef(null);

  useHandleClickOut(ref, () => {
    open && handleClose();
  });

  // prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
  }, [open]);

  return (
    <div className={`generic-modal ${open ? 'open' : ''}`}>
      <div className='generic-modal-child-container' ref={ref}>
        {children}
      </div>
    </div>
  );
}

GenericModal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
