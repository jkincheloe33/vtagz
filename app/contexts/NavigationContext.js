import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const NavigationContext = createContext({})

export const NavigationProvider = ({ children }) => {
  const [showMenu, setShowMenu] = useState(false);

  return <NavigationContext.Provider value={{ setShowMenu, showMenu }}>{children}</NavigationContext.Provider>
}

NavigationProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
}

export const useNavigationContext = () => useContext(NavigationContext)