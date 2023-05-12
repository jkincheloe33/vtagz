import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import './styles.styl'

const Loading = ({ dimmed, contain, message = '' }) => {
  const classes = clsx({
    loading: true,
    'loading-overlay': !contain,
    'loading-dimmed': dimmed,
  });
  return (
    <div className={classes}>
      {message && <span className='loading-message'>{message}</span>}
      <Loading.Spinner white={dimmed} />
    </div>
  );
};

const Spinner = ({ white }) => {
  return (
    <div className='spinner-button'>
      <div className={white ? 'dot1' : 'black-dot1'} />
      <div className={white ? 'dot2' : 'black-dot2'} />
    </div>
  );
};

Loading.Spinner = Spinner;

Loading.propTypes = {
  dimmed: PropTypes.bool,
  contain: PropTypes.bool,
  message: PropTypes.string,
};
Spinner.propTypes = {
  white: PropTypes.bool,
};

export default Loading;
