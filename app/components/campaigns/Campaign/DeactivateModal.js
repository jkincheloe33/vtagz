import React from 'react';
import PropTypes from 'prop-types';
import GenericModal from '@/components/GenericModal';
import ButtonWithStates from '@/components/ButtonWithStates';
import CloseIcon from '@/static/assets/close-icon.svg';

export default function DeactivateModal({
  actions,
  deactivate,
  handleClose,
  open,
  waitingFor,
}) {
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
        <h2 className='heading-5'>
          Confirm that you’d like to deactivate this campaign?
        </h2>
        <p className='base-1-semibold'>
          Deactivated campaigns prevent any additional users from engaging with
          your campaign. Your campaign can be reactivated at any time.
        </p>
        <ButtonWithStates
          className='btn destructive'
          onClick={deactivate}
          loading={
            waitingFor === actions.DEACTIVATE || waitingFor !== actions.NONE
          }
          textLoading='Deactivating this campaign'
        >
          Deactivate this campaign
        </ButtonWithStates>
      </div>
    </GenericModal>
  );
}

DeactivateModal.propTypes = {
  actions: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  deactivate: PropTypes.func.isRequired,
  waitingFor: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
    .isRequired,
};
