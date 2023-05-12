import React, { createRef, useEffect, useRef, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useNavigationContext } from '@/contexts/NavigationContext';
import DiamondIcon from '@/static/assets/diamond-icon.svg';
import DivideIcon from '@/static/assets/divide-icon.svg';
import GearIcon from '@/static/assets/gear-icon.svg'
import HomeIcon from '@/static/assets/home-icon.svg';
import './styles.styl';

const icons = {
  diamond: DiamondIcon,
  divide: DivideIcon,
  gear: GearIcon,
  home: HomeIcon,
}

export default function Tabs({ tabs }) {
  const [active, setActive] = useState(0)
  const [height, setHeight] = useState(0);
  const { setShowMenu } = useNavigationContext();
  const { location } = useHistory();
  // create array of refs equal to the length of users
  const { current } = useRef(tabs.map(() => createRef()));
  // need to assign pathnames to index to set the active state on route changes
  const tabPaths = tabs.reduce((acc, tab, i) => ({ ...acc, [tab.to]: i }), {});

  useEffect(() => {
    // only get the root pathname of a page
    setActive(tabPaths[`/${location.pathname.split('/')[1]}`])
  }, [location.pathname, tabPaths])

  useEffect(() => {
    // check the last ref has mounted
    if (current?.[tabs.length - 1]?.current) {
      // all rows are the same height, so get the height of the first row
      const rowHeight = current[0].current.getBoundingClientRect().height;
      setHeight(rowHeight);
    }
  }, [current, tabs.length]);

  return (
    <div className='tabs-wrapper'>
      {tabs.map(({ icon, title, to }, i) => (
        <NavLink className='tab-row' key={`title-${i}`} onClick={() => setShowMenu(false)} ref={current?.[i]} to={to}>
          <img alt='' src={icons[icon]} />
          <p className={active === i ? 'active' : ''}>{title}</p>
        </NavLink>
      ))}
      <div
        className='tab-background'
        style={{
          height: `${height}px`,
          transform: `translateY(${active * 100}%)`
        }}
      />
    </div>
  )
}

export const TabsType = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.oneOf(Object.keys(icons)).isRequired,
    title: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
  })),
}

Tabs.propTypes = TabsType;
