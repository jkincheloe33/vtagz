import React from 'react';
import PropTypes from 'prop-types';
import GenericModal from '@/components/GenericModal';
import ButtonWithStates from '@/components/ButtonWithStates';
import CloseIcon from '@/static/assets/close-icon.svg';
import { ACTIONS } from './ActionsCreate';

export default function DeactivateModal({
  open,
  handleClose,
  deactivate,
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
          Confirm that you’d like to disable this reward?
        </h2>
        <p className='base-1-semibold'>
          Disabling rewards prevent any additional users from receiving this
          reward. Your reward can be reactivated at any time.
        </p>
        <ButtonWithStates
          className='btn destructive'
          onClick={deactivate}
          loading={
            waitingFor === ACTIONS.DEACTIVATE || waitingFor !== ACTIONS.NONE
          }
          textLoading='Disabling this reward'
        >
          Disable this reward
        </ButtonWithStates>
      </div>
    </GenericModal>
  );
}

DeactivateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  deactivate: PropTypes.func.isRequired,
  waitingFor: PropTypes.oneOf(Object.values(ACTIONS)).isRequired,
};
