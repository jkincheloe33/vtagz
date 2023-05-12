import React from 'react';
import PropTypes from 'prop-types';
import GenericModal from '@/components/GenericModal';
import CloseIcon from '@/static/assets/close-icon.svg';

export default function AfterDeactivateModal({ handleClose, open }) {
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
        <h2 className='heading-5'>Your campaign was deactivated</h2>
        <p className='base-1-semibold'>
          You can reactivate this campaign at anytime.
        </p>
      </div>
    </GenericModal>
  );
}

AfterDeactivateModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
