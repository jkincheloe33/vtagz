import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { createProduct, modifyProduct } from '@/features/product/thunks';
import {
  selectCreateDisabled,
  selectUpdateDisabled,
} from '@/features/product/slice';
import { STATUS } from '@/features/products/slice';
import CreateModal from './CreateModal';
import ButtonWithStates from '@/components/ButtonWithStates';
import './styles.styl';

const ACTIONS = {
  NONE: false,
  CREATE: 'create',
  DRAFT: 'draft',
};

export default function CreateSave({ campaignId }) {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const {
    error,
    isEdit,
    original: { status },
  } = useSelector(({ product }) => product);
  const createDisabled = useSelector(selectCreateDisabled);
  const updateDisabled = useSelector(selectUpdateDisabled);
  const [idOnCreate, setIdOnCreate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [waitingFor, setWaitingFor] = useState(ACTIONS.NONE);
  const [hasSucceeded, setHasSucceeded] = useState(ACTIONS.NONE);

  const handleCreateProduct = async () => {
    setWaitingFor(ACTIONS.CREATE);
    const { id } = await dispatch(createProduct()).unwrap();
    setIdOnCreate(id);
    setWaitingFor(ACTIONS.NONE);
    setShowModal(true);
  };

  const handleModifyProduct = async () => {
    setWaitingFor(ACTIONS.DRAFT);
    await dispatch(modifyProduct({ id: campaignId })).unwrap();
    setWaitingFor(ACTIONS.NONE);
    setHasSucceeded(ACTIONS.DRAFT);
    // set hasSucceeded back to false in case user makes more edits
    setTimeout(() => setHasSucceeded(ACTIONS.NONE), 1000);
  };

  useEffect(() => {
    if (error) {
      toast.warn(error);
      // set waiting for back to false but wait 1/2 second so user can't immediately hit create/save again
      setTimeout(() => setWaitingFor(ACTIONS.NONE), 500);
    }
  }, [error]);

  return (
    <>
      <div className='builder-footer'>
        {isEdit && status !== STATUS.INACTIVE && (
          <>
            <button
              className='btn'
              onClick={() => push(`/campaign/${campaignId}`)}
            >
              Cancel
            </button>
            <ButtonWithStates
              className='btn secondary'
              onClick={handleModifyProduct}
              disabled={updateDisabled || waitingFor !== ACTIONS.NONE}
              textLoading='Saving your changes'
              loading={waitingFor === ACTIONS.DRAFT}
              textSuccess='Changes saved'
              success={hasSucceeded === ACTIONS.DRAFT}
            >
              Save changes
            </ButtonWithStates>
          </>
        )}
        {!isEdit && (
          <>
            <button className='btn' onClick={() => push('/campaigns')}>
              Cancel
            </button>
            <ButtonWithStates
              className='btn primary'
              disabled={createDisabled || waitingFor !== ACTIONS.NONE}
              loading={waitingFor === ACTIONS.CREATE}
              onClick={handleCreateProduct}
              textLoading='Creating your campaign'
            >
              Create campaign
            </ButtonWithStates>
          </>
        )}
      </div>
      {createPortal(
        <CreateModal
          campaignId={idOnCreate}
          handleClose={() => push(`/campaign/${idOnCreate}`)}
          open={showModal}
        />,
        document.body
      )}
    </>
  );
}

CreateSave.propTypes = {
  campaignId: PropTypes.number,
};
