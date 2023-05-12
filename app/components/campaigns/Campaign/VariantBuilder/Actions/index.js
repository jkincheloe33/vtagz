import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import useQueryParams from '@/hooks/useQueryParams';
import { deactivateVariant, publishVariant } from '@/features/variant/thunks';
import {
  reset,
  selectCreateDisabled,
  selectUpdateDisabled,
} from '@/features/variant/slice';
import ActionsCreate from './ActionsCreate';
import ActionsEdit from './ActionsEdit';
import AfterDeactivateModal from './AfterDeactivateModal';
import CreateModal from './CreateModal';
import DeactivateModal from './DeactivateModal';
import { ACTIONS } from './ActionsCreate';
import { useScrollContext } from '@/contexts/ScrollToTop';
import './actions.styl';

const MODALS = {
  NONE: false,
  DEACTIVATE: 'deactivate',
  PUBLISH: 'publish',
};

export default function Actions() {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { id } = useParams();
  const { campaignId } = useQueryParams();
  const {
    isEdit,
    original: { disabled },
  } = useSelector(({ variant }) => variant);
  const createDisabled = useSelector(selectCreateDisabled);
  const updateDisabled = useSelector(selectUpdateDisabled);
  const [showModal, setShowModal] = useState(MODALS.NONE);
  const [waitingFor, setWaitingFor] = useState(ACTIONS.NONE);
  const [hasSucceeded, setHasSucceeded] = useState(ACTIONS.NONE);
  const { scrollToTop } = useScrollContext();
  const savingParams = { campaignId, id: isEdit ? id : undefined };

  const showSuccessCheck = (action) => {
    setHasSucceeded(action);
    setTimeout(() => setHasSucceeded(ACTIONS.NONE), 2000);
  };

  const handleCloseAfterDeactivation = () => {
    // close modal that shows success message after deactivation
    setShowModal(MODALS.NONE);
    setHasSucceeded(ACTIONS.NONE);
    push(`/campaign/${campaignId}`);
  };

  const handleDeactivateCampaign = async () => {
    setWaitingFor(ACTIONS.DEACTIVATE);
    await dispatch(deactivateVariant(savingParams)).unwrap();
    // TODO: remove. this simulates a small delay so acceptance can check spinners
    await new Promise((resolve) => setTimeout(() => resolve(), 2000));
    setWaitingFor(ACTIONS.NONE);
    setHasSucceeded(ACTIONS.DEACTIVATE);
  };

  // we have two success actions depending on how the status of the campaign was when calling publish.
  // one opens a success modal, and the other shows a check in the button.
  const getHandlePublishCampaign =
    ({ withModal }) =>
    async () => {
      setWaitingFor(ACTIONS.PUBLISH);
      await dispatch(publishVariant(savingParams)).unwrap();
      // TODO: remove. this simulates a small delay so acceptance can check spinners
      await new Promise((resolve) => setTimeout(() => resolve(), 2000));
      setWaitingFor(ACTIONS.NONE);
      if (withModal) {
        setShowModal(MODALS.PUBLISH);
      } else {
        showSuccessCheck(ACTIONS.PUBLISH);
      }
    };

  return (
    <>
      <div className='builder-footer'>
        <button className='btn' onClick={() => push(`/campaign/${campaignId}`)}>
          Cancel
        </button>
        {isEdit && !disabled && (
          <ActionsEdit
            updateDisabled={updateDisabled}
            publish={getHandlePublishCampaign({ withModal: false })}
            deactivate={() => setShowModal(MODALS.DEACTIVATE)}
            waitingFor={waitingFor}
            hasSucceeded={hasSucceeded}
          />
        )}
        {!isEdit && (
          <ActionsCreate
            createDisabled={createDisabled}
            publish={getHandlePublishCampaign({ withModal: true })}
            waitingFor={waitingFor}
            hasSucceeded={hasSucceeded}
          />
        )}
      </div>
      {createPortal(
        <>
          <CreateModal
            createAnother={() => {
              dispatch(reset());
              setShowModal(MODALS.NONE);
              scrollToTop();
            }}
            handleClose={() => push(`/campaign/${campaignId}`)}
            open={showModal === MODALS.PUBLISH}
          />
          <DeactivateModal
            open={
              showModal === MODALS.DEACTIVATE &&
              hasSucceeded !== ACTIONS.DEACTIVATE
            }
            handleClose={() => setShowModal(MODALS.NONE)}
            deactivate={handleDeactivateCampaign}
            waitingFor={waitingFor}
          />
          <AfterDeactivateModal
            open={
              showModal === MODALS.DEACTIVATE &&
              hasSucceeded === ACTIONS.DEACTIVATE
            }
            handleClose={handleCloseAfterDeactivation}
            redirect={() => push(`/campaign/${campaignId}`)}
          />
        </>,
        document.body
      )}
    </>
  );
}

Actions.propTypes = {
  campaignId: PropTypes.number,
};
