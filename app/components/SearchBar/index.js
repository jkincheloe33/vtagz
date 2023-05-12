import React from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@/static/assets/search-icon.svg';
import './styles.styl';

export default function SearchBar({ placeholder, value, onChange }) {
  return (
    <form id='search-bar-form'>
      <img alt='search icon' src={SearchIcon} />
      <input placeholder={placeholder} value={value} onChange={onChange} />
    </form>
  );
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
