import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import GenericModal from '@/components/GenericModal';
import CloseIcon from '@/static/assets/close-icon.svg';
import Success from '@/static/assets/success.png';

export default function CreateModal({ campaignId, handleClose, open }) {
  return (
    <GenericModal open={open} handleClose={handleClose}>
      <div className='section modal-section centered'>
        <div className='header'>
          <Link className='btn secondary close' to='/campaigns'>
            <img src={CloseIcon} alt='close' />
          </Link>
        </div>
        <img src={Success} />
        <div>
          <h2 className='title-1-semibold'>Success!</h2>
          <h2 className='heading-5'>Your new campaign was created</h2>
          <p className='base-1-semibold'>
            Take the next step by creating your first reward for this campaign.
          </p>
        </div>
        <div className='actions'>
          <Link to={`/campaign/${campaignId}`} className='btn secondary'>
            Open the Campaign Home
          </Link>
          <Link
            className='btn primary'
            to={`/variant/create/?campaignId=${campaignId}`}
          >
            Create a reward
          </Link>
        </div>
      </div>
    </GenericModal>
  );
}

CreateModal.propTypes = {
  campaignId: PropTypes.number,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
