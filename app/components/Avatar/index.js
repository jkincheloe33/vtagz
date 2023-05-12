import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { generateHSL } from '@/utils';
import './styles.styl';

export default function Avatar({ showDetails = false }) {
  const { email, fullName, id } = useSelector(({ user }) => user);
  const { push } = useHistory();

  // TODO: update use of email to fullName once we add it
  // if 2nd char of email is a period, take 1st and 3rd char and capitalize both letters
  // otherwise, take first 2 chars and capitalize only the 1st char
  const periodSecond = email?.indexOf('.') === 1;
  // remove all special characters
  const lettersOnly = email.replace(/[^a-zA-Z]/g, '');
  const initials = lettersOnly.substring(0, 2);

  return (
    <div
      className={`avatar ${showDetails ? 'show-details' : ''}`}
      onClick={() => push('/settings')}
      style={{ backgroundColor: generateHSL(id) }}
    >
      <p className={`avatar-initials ${periodSecond ? 'uppercase' : ''}`}>
        {initials}
      </p>
      {showDetails && (
        <>
          <div className='avatar-details'>
            <p className='name'>{fullName}</p>
            <p className='type'>Admin</p>
          </div>
          <div className='arrows' />
        </>
      )}
    </div>
  );
}

Avatar.propTypes = {
  showDetails: PropTypes.bool,
};
