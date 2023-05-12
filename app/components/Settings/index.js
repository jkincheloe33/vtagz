import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/login/thunks';
import SectionHeader from '@/components/SectionHeader';
import './settings.styl';

export default function Settings() {
  const dispatch = useDispatch();
  const { brand, email } = useSelector(({ user }) => user);

  return (
    <>
      <h1>Settings</h1>
      <div id='settings' className='section'>
        <button className='btn tab'>Basics</button>
        <div className='settings-details'>
          <div className='settings-section'>
            <SectionHeader title='Profile information' />
            <label className='builder-label'>Email</label>
            <input className='builder-input' disabled placeholder={email} />
            <button
              className='btn secondary'
              onClick={() => dispatch(logout())}
            >
              Sign out
            </button>
          </div>
          <div className='settings-section'>
            <SectionHeader color='purple' title='Your brand' />
            <label className='builder-label'>Name</label>
            <input
              className='builder-input'
              disabled
              placeholder={brand?.name}
            />
            <label className='builder-label'>Industry</label>
            <input
              className='builder-input no-spacing'
              disabled
              placeholder={brand?.industry}
            />
          </div>
          <div className='settings-section'>
            <SectionHeader color='blue' title='Need help?' />
            <a
              className='btn btn-primary'
              href='https://62u3escv53t.typeform.com/to/kDRduIVX'
              rel='noreferrer'
              target='_blank'
            >
              Contact the VTAGZ team
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
