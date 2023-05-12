import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import { selectProductById, STATUS } from '@/features/products/slice';
import { deactivateProduct, publishProduct } from '@/features/product/thunks';
import ButtonWithStates from '@/components/ButtonWithStates';
import AfterDeactivateModal from './AfterDeactivageModal';
import DeactivateModal from './DeactivateModal';
import PublishModal from './PublishModal';
import './heading.styl';

export const ACTIONS = {
  NONE: false,
  DEACTIVATE: 'deactivate',
  PUBLISH: 'publish',
};

const MODALS = {
  NONE: false,
  DEACTIVATE: 'deactivate',
  PUBLISH: 'publish',
};

export default function Heading() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { metadata, status, name } = useSelector((store) =>
    selectProductById(store, id)
  );
  const [hasSucceeded, setHasSucceeded] = useState(ACTIONS.NONE);
  const [showModal, setShowModal] = useState(MODALS.NONE);
  const [waitingFor, setWaitingFor] = useState(ACTIONS.NONE);

  const handleCloseAfterDeactivation = () => {
    // close modal that shows success message after deactivation
    setShowModal(MODALS.NONE);
    setHasSucceeded(ACTIONS.NONE);
  };

  const handleDeactivateProduct = async () => {
    setWaitingFor(ACTIONS.DEACTIVATE);
    await dispatch(deactivateProduct({ id: Number(id) })).unwrap();
    setWaitingFor(ACTIONS.NONE);
    setHasSucceeded(ACTIONS.DEACTIVATE);
  };

  const handlePublishProduct = async () => {
    setWaitingFor(ACTIONS.PUBLISH);
    await dispatch(publishProduct({ id: Number(id) })).unwrap();
    setWaitingFor(ACTIONS.NONE);
    setShowModal(MODALS.PUBLISH);
  };

  return (
    ACTIONS && (
      <>
        <div id='heading'>
          <h1>{name}</h1>
          {status === STATUS.DRAFT && (
            <ButtonWithStates
              className='btn primary'
              disabled={
                waitingFor !== ACTIONS.NONE || !metadata.variants?.length
              }
              loading={waitingFor === ACTIONS.PUBLISH}
              onClick={handlePublishProduct}
              textLoading='Publishing campaign'
            >
              Publish campaign
            </ButtonWithStates>
          )}
          {status === STATUS.ACTIVE && (
            <ButtonWithStates
              className='btn danger'
              disabled={waitingFor !== ACTIONS.NONE}
              loading={waitingFor === ACTIONS.DEACTIVATE}
              onClick={handleDeactivateProduct}
              textLoading='Deactivating'
            >
              Deactivate
            </ButtonWithStates>
          )}
        </div>
        {createPortal(
          <>
            <PublishModal
              handleClose={() => setShowModal(MODALS.NONE)}
              open={showModal === MODALS.PUBLISH}
            />
            <DeactivateModal
              actions={ACTIONS}
              deactivate={handleDeactivateProduct}
              handleClose={() => setShowModal(MODALS.NONE)}
              open={
                showModal === MODALS.DEACTIVATE &&
                hasSucceeded !== ACTIONS.DEACTIVATE
              }
              waitingFor={waitingFor}
            />
            <AfterDeactivateModal
              handleClose={handleCloseAfterDeactivation}
              open={
                showModal === MODALS.DEACTIVATE &&
                hasSucceeded === ACTIONS.DEACTIVATE
              }
            />
          </>,
          document.body
        )}
      </>
    )
  );
}
