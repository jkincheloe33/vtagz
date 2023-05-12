import React from 'react';
import PropTypes from 'prop-types';
import SpinnerIcon from '@/components/icons/SpinnerIcon';
import CheckIcon from '@/components/icons/CheckIcon';
import './styles.styl';

export default function ButtonWithStates({
  loading,
  textLoading,
  children,
  success,
  textSuccess,
  className,
  icon,
  iconPosition = 'right',
  ...props
}) {
  const text = loading
    ? textLoading || children
    : success
    ? textSuccess || children
    : children;
  return (
    <button {...props} className={`${className} btn-with-states`}>
      {iconPosition === 'right' && text}
      {!loading && !success && <span className='icon'>{icon}</span>}
      {loading && (
        <span className={'spinner-icon'}>
          <SpinnerIcon />
        </span>
      )}
      {success && (
        <span className='icon'>
          <CheckIcon />
        </span>
      )}
      {iconPosition === 'left' && text}
    </button>
  );
}

ButtonWithStates.propTypes = {
  loading: PropTypes.bool.isRequired,
  success: PropTypes.bool,
  textLoading: PropTypes.string,
  textSuccess: PropTypes.string,
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
};
