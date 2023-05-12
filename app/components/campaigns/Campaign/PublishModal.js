import React from 'react';
import PropTypes from 'prop-types';
import GenericModal from '@/components/GenericModal';
import CloseIcon from '@/static/assets/close-icon.svg';
import Success from '@/static/assets/success.png';

export default function PublishModal({ handleClose, open }) {
  return (
    <GenericModal open={open} handleClose={handleClose}>
      <div className='section modal-section centered'>
        <div className='header'>
          <button className='btn secondary close' onClick={handleClose}>
            <img src={CloseIcon} alt='close' />
          </button>
        </div>
        <img src={Success} />
        <div>
          <h2 className='title-1-semibold'>Success!</h2>
          <h2 className='heading-5'>Your new campaign was published</h2>
        </div>
      </div>
    </GenericModal>
  );
}

PublishModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
