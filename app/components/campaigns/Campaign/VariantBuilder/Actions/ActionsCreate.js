import React from 'react';
import PropTypes from 'prop-types';
import ButtonWithStates from '@/components/ButtonWithStates';

export const ACTIONS = {
  NONE: false,
  DEACTIVATE: 'deactivate',
  PUBLISH: 'publish',
};

// action controls for create
export default function ActionsCreate({ publish, createDisabled, waitingFor }) {
  return (
    <ButtonWithStates
      className='btn primary'
      onClick={publish}
      disabled={createDisabled || waitingFor !== ACTIONS.NONE}
      textLoading='Creating'
      loading={waitingFor === ACTIONS.PUBLISH}
    >
      Create reward
    </ButtonWithStates>
  );
}

ActionsCreate.propTypes = {
  publish: PropTypes.func.isRequired,
  createDisabled: PropTypes.bool.isRequired,
  waitingFor: PropTypes.oneOf(Object.values(ACTIONS)).isRequired,
};
