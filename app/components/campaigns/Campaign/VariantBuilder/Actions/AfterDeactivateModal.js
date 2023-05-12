import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import GenericModal from '@/components/GenericModal';
import CloseIcon from '@/static/assets/close-icon.svg';

export default function AfterDeactivateModal({ open, handleClose, redirect }) {
  useEffect(() => {
    if (open) {
      setTimeout(redirect, 5000);
    }
  }, [open, redirect]);

  return (
    <GenericModal open={open} handleClose={handleClose}>
      <div className='section modal-section centered'>
        <div className='header'>
          <button
            className='btn secondary close'
            onClick={handleClose}
            type='button'
          >
            <img src={CloseIcon} />
          </button>
        </div>
        <h2 className='heading-5'>Your reward was disabled</h2>
        <p className='base-1-semibold'>
          You’ll be automatically redirected to your Campaign Home in 5 seconds.
        </p>
        <button className='btn primary' onClick={redirect}>
          Return to the Campaign Home
        </button>
      </div>
    </GenericModal>
  );
}

AfterDeactivateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  redirect: PropTypes.func.isRequired,
};
