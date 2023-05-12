import React from 'react';
import { Link, Route, Switch, useLocation } from 'react-router-dom';
import { useNavigationContext } from '@/contexts/NavigationContext';
import Avatar from '@/components/Avatar';
import BrandsLogo from '@/static/vtagz-brands-logo.png';
import PlatformLogo from '@/static/vtagz-platform-logo.png';
import './styles.styl';

export function LoggedOutHeader() {
  return (
    <div id='header'>
      <Link className='logo-wrapper' to='/'>
        <img src={BrandsLogo} />
      </Link>
      <p className='sign-in caption-1'>
        <Switch>
          <Route path='/signup'>
            Already a member?{' '}
            <Link to='/signin' className='caption-2-bold'>
              Sign in
            </Link>
          </Route>
          <Route>
            Not a member?{' '}
            <Link to='/signup' className='caption-2-bold'>
              Sign up
            </Link>
          </Route>
        </Switch>
      </p>
    </div>
  );
}

export default function Header() {
  const { setShowMenu, showMenu } = useNavigationContext();
  const { pathname } = useLocation();

  return (
    <div id='header'>
      <div
        className={showMenu ? 'show-menu' : ''}
        id='hamburger'
        onClick={() => setShowMenu((sm) => !sm)}
      />
      <Link className='logo-wrapper logged-in' to='/'>
        <img src={PlatformLogo} />
      </Link>
      <div className='header-actions'>
        <div className='header-buttons'>
          {pathname !== '/campaigns/create' && (
            <Link className='btn btn-primary' to='/campaigns/create'>
              + Create a campaign
            </Link>
          )}
          <Avatar />
        </div>
      </div>
    </div>
  );
}
