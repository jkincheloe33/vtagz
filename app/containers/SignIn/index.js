import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VtagzIncludesLayout from '@/components/VtagzIncludesLayout';
import { setClearError } from '@/features/user/slice';
import { login } from '@/features/login/thunks';
import { isEmail } from '@/utils';
import CheckIcon from '@/static/assets/check.svg';
import EmailIcon from '@/static/assets/email.svg';
import LockIcon from '@/static/assets/lock.svg';
import './styles.styl';

export default function SignIn() {
  const dispatch = useDispatch();
  const { error } = useSelector(({ user }) => user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isEmailValid = isEmail(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    // remove error on umount
    return () => dispatch(setClearError());
  }, [dispatch]);

  return (
    <VtagzIncludesLayout>
      <form id='sign-in' onSubmit={handleSubmit}>
        <h1 className='heading-2'>Sign in</h1>
        <p>to access your VTAGZ Brands account</p>
        <div className='input-icon'>
          <img src={EmailIcon} />
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Your email'
          />
          {isEmailValid && <img className='checkmark' src={CheckIcon} />}
        </div>
        <div className='input-icon'>
          <img src={LockIcon} />
          <input
            type='password'
            id='password'
            name='password'
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error?.message && (
          <p className='error'>
            You have entered an invalid email or password.
          </p>
        )}
        <button
          className='btn primary'
          disabled={!isEmailValid || password.length < 8}
          type='submit'
        >
          Sign in
        </button>
        <p className='captcha-copy'>
          This site is protected by reCAPTCHA and the Google Privacy Policy.
        </p>
      </form>
    </VtagzIncludesLayout>
  );
}
