import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setClearError, setEmail } from '@/features/user/slice';
import { isEmail } from '@/utils';
import CheckIcon from '@/static/assets/check.svg';
import EmailIcon from '@/static/assets/email.svg';
import LockIcon from '@/static/assets/lock.svg';
import './styles.styl';

export default function SignUp({ onSuccess }) {
  const dispatch = useDispatch();
  const email = useSelector((store) => store.user.email);
  const [brandName, setBrandName] = useState('');
  const [password, setPassword] = useState('');

  const isEmailValid = isEmail(email);
  const submitDisabled =
    !isEmailValid || brandName.length < 3 || password.length < 8;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess({ brandName, email, password });
  };

  useEffect(() => {
    // remove error on umount
    return () => dispatch(setClearError());
  }, [dispatch]);

  return (
    <form id='sign-up' onSubmit={handleSubmit}>
      <h1 className='heading-2'>Sign up</h1>
      <p>to start turning your views into transactions.</p>
      <div className='label-tip'>
        <label htmlFor='brandName'>Brand name</label>
      </div>
      <div className='input-icon'>
        <input
          type='text'
          id='brandName'
          name='brandName'
          value={brandName ?? ''}
          onChange={(e) => setBrandName(e.target.value)}
        />
      </div>
      <label className='signup-label' htmlFor='email'>
        Email
      </label>
      <div className='input-icon'>
        <img src={EmailIcon} />
        <input
          id='email'
          name='email'
          type='email'
          value={email ?? ''}
          onChange={(e) => dispatch(setEmail(e.target.value))}
          placeholder='Your email'
        />
        {isEmailValid && <img className='checkmark' src={CheckIcon} />}
      </div>
      <label className='signup-label' htmlFor='password'>
        Password
      </label>
      <div className='input-icon'>
        <img src={LockIcon} />
        <input
          type='password'
          id='password'
          name='password'
          placeholder='Password'
          value={password ?? ''}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <p className='caption-1 password'>
        Your password must contain at least 8 characters.
      </p>
      <button className='btn primary' disabled={submitDisabled} type='submit'>
        Continue
      </button>
      <p className='captcha-copy'>
        This site is protected by reCAPTCHA and the Google Privacy Policy.
      </p>
    </form>
  );
}

SignUp.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};
