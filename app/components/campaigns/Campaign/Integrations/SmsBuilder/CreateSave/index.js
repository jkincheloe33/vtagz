import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useQueryParams from '@/hooks/useQueryParams';
import {
  selectCreateDisabled,
  selectUpdateDisabled,
  STATUS,
} from '@/features/sms/slice';
import { createSms, deactivateSms, modifySms } from '@/features/sms/thunks';
import ButtonWithStates from '@/components/ButtonWithStates';
import './create-save.styl';

const ACTIONS = {
  NONE: false,
  ACTIVATE: 'activate',
  DEACTIVATE: 'deactivate',
  SAVE: 'save',
};

export default function CreateSave() {
  const [hasSucceeded, setHasSucceeded] = useState(ACTIONS.NONE);
  const [waitingFor, setWaitingFor] = useState(ACTIONS.NONE);
  const { campaignId } = useQueryParams();
  const { push } = useHistory();
  const dispatch = useDispatch();
  const createDisabled = useSelector(selectCreateDisabled);
  const updateDisabled = useSelector(selectUpdateDisabled);
  const { id, isEdit, status } = useSelector(({ sms }) => sms);
  const { brand } = useSelector(({ user }) => user);

  const handleActivate = async () => {
    setWaitingFor(ACTIONS.ACTIVATE);
    if (status) {
      await dispatch(
        modifySms({
          id,
          active: true,
          brandId: brand.id,
          productId: Number(campaignId),
        })
      ).unwrap();
    } else {
      await dispatch(
        createSms({
          active: true,
          brandId: brand.id,
          productId: Number(campaignId),
        })
      ).unwrap();
    }
    setWaitingFor(ACTIONS.NONE);
    push(`/campaign/${campaignId}`);
  };

  const handleDeactivate = async () => {
    setWaitingFor(ACTIONS.DEACTIVATE);
    await dispatch(deactivateSms({ id })).unwrap();
    setWaitingFor(ACTIONS.NONE);
    setHasSucceeded(ACTIONS.DEACTIVATE);
    // set hasSucceeded back to false in case user makes more edits
    setTimeout(() => setHasSucceeded(ACTIONS.NONE), 1000);
    push(`/campaign/${campaignId}`);
  };

  const handleSaveChanges = async () => {
    setWaitingFor(ACTIONS.SAVE);
    if (status) {
      await dispatch(
        modifySms({
          id,
          brandId: brand.id,
          productId: Number(campaignId),
        })
      ).unwrap();
    } else {
      await dispatch(
        createSms({
          brandId: brand.id,
          productId: Number(campaignId),
        })
      ).unwrap();
    }
    setWaitingFor(ACTIONS.NONE);
    setHasSucceeded(ACTIONS.SAVE);
    // set hasSucceeded back to false in case user makes more edits
    setTimeout(() => setHasSucceeded(ACTIONS.NONE), 1000);
  };

  return (
    <div id='sms-footer' className='builder-footer'>
      <button className='btn' onClick={() => push(`/campaign/${campaignId}`)}>
        Cancel
      </button>
      <div id='action-buttons'>
        <ButtonWithStates
          className='btn secondary'
          disabled={
            (isEdit ? updateDisabled : createDisabled) ||
            waitingFor !== ACTIONS.NONE
          }
          loading={waitingFor === ACTIONS.SAVE}
          onClick={handleSaveChanges}
          success={hasSucceeded === ACTIONS.SAVE}
          textLoading='Saving changes'
          textSuccess='Changes saved'
        >
          Save changes
        </ButtonWithStates>
        {status === STATUS.ACTIVE ? (
          <ButtonWithStates
            className='btn danger'
            disabled={waitingFor !== ACTIONS.NONE}
            loading={waitingFor === ACTIONS.DEACTIVATE}
            onClick={handleDeactivate}
            success={hasSucceeded === ACTIONS.DEACTIVATE}
            textLoading='Deactivating'
            textSuccess='Deactivated'
          >
            Deactivate
          </ButtonWithStates>
        ) : (
          <ButtonWithStates
            className='btn primary'
            disabled={createDisabled || waitingFor !== ACTIONS.NONE}
            loading={waitingFor === ACTIONS.ACTIVATE}
            onClick={handleActivate}
            textLoading='Activating'
          >
            Activate
          </ButtonWithStates>
        )}
      </div>
    </div>
  );
}
