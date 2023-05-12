import React from 'react';
import { useNavigationContext } from '@/contexts/NavigationContext';
import Tabs, { TabsType } from '@/components/Tabs';
import HelpIcon from '@/static/assets/help-icon.svg';
import './styles.styl';

export default function Sidebar({ tabs }) {
  const { showMenu } = useNavigationContext();

  return (
    <div className={`sidebar ${showMenu ? 'show-menu' : ''}`}>
      <Tabs tabs={tabs} />
      <div className='help'>
        <img alt='Help icon' src={HelpIcon} />
        <a
          href='https://62u3escv53t.typeform.com/to/kDRduIVX'
          rel='noreferrer'
          target='_blank'
        >
          Support
        </a>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  ...TabsType,
};
