import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useQueryParams from '@/hooks/useQueryParams';
import GenericModal from '@/components/GenericModal';
import CloseIcon from '@/static/assets/close-icon.svg';
import Success from '@/static/assets/success.png';

export default function CreateModal({ createAnother, handleClose, open }) {
  const { campaignId } = useQueryParams();

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
          <h2 className='heading-5'>Your new reward was created</h2>
          <p className='base-1-semibold'>
            Create another reward, or go to the Campaign Home to start sharing
            your new campaign.
          </p>
        </div>
        <div className='actions'>
          <Link to={`/campaign/${campaignId}`} className='btn secondary'>
            Go to the Campaign Home
          </Link>
          <button className='btn primary' onClick={createAnother} type='button'>
            Create another reward
          </button>
        </div>
      </div>
    </GenericModal>
  );
}

CreateModal.propTypes = {
  createAnother: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
