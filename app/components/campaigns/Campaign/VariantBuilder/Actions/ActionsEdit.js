import React from 'react';
import PropTypes from 'prop-types';
import ButtonWithStates from '@/components/ButtonWithStates';
import { ACTIONS } from './ActionsCreate';

// action controls for editing variants
export default function ActionsEdit({
  publish,
  deactivate,
  updateDisabled,
  waitingFor,
  hasSucceeded,
}) {
  return (
    <>
      <ButtonWithStates
        className='btn danger'
        onClick={deactivate}
        disabled={waitingFor !== ACTIONS.NONE}
        textLoading='Disabling'
        loading={waitingFor === ACTIONS.DEACTIVATE}
      >
        Disable
      </ButtonWithStates>
      <ButtonWithStates
        className='btn secondary'
        onClick={publish}
        disabled={updateDisabled || waitingFor !== ACTIONS.NONE}
        textLoading='Saving changes'
        loading={waitingFor === ACTIONS.PUBLISH}
        textSuccess={'Changes saved'}
        success={hasSucceeded === ACTIONS.PUBLISH}
      >
        Save changes
      </ButtonWithStates>
    </>
  );
}

ActionsEdit.propTypes = {
  publish: PropTypes.func.isRequired,
  deactivate: PropTypes.func.isRequired,
  updateDisabled: PropTypes.bool.isRequired,
  waitingFor: PropTypes.oneOf(Object.values(ACTIONS)).isRequired,
  hasSucceeded: PropTypes.oneOf(Object.values(ACTIONS)).isRequired,
};
