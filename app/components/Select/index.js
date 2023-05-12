import React, { useMemo, useState, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import useHandleClickOut from '@/hooks/useHandleClickOut';
import './select.styl';

// a custom select component. Shows a badge at the right of an option if a status property is present in the options list
export default function Select({
  options,
  id,
  name,
  onChange,
  value,
  placeholder,
  prefix,
}) {
  const optionsRef = useRef();
  const selectRef = useRef();
  const [showOptions, setShowOptions] = useState(false);
  const [position, setPosition] = useState('bottom');

  useHandleClickOut(selectRef, () => {
    setShowOptions(false);
  });

  const valueToOption = useMemo(() => {
    return options.reduce((result, option) => {
      result[option.value] = option;
      return result;
    }, {});
  }, [options]);

  // show the options box on top or bottom, dependant on screen position.
  useLayoutEffect(() => {
    if (showOptions && optionsRef.current) {
      const bottom = optionsRef.current.getBoundingClientRect().bottom;
      const top = optionsRef.current.getBoundingClientRect().top;
      const clientHeight =
        document.getElementsByTagName('html')[0].clientHeight;

      if (position === 'bottom' && bottom > clientHeight) {
        setPosition('top');
      } else if (position === 'top' && top < 0) {
        setPosition('bottom');
      }
    }
  }, [showOptions, position]);

  const getHandleOptionChange = (value) => () => {
    onChange(value);
    setShowOptions(false);
  };

  const showOptionsBox = () => {
    setShowOptions((so) => !so);
  };

  return (
    <div className={`select ${position}`} ref={selectRef}>
      <button
        className={`select-box base-2 ${showOptions ? 'active' : ''}`}
        onClick={showOptionsBox}
        type='button'
      >
        {prefix}
        {valueToOption[value]?.label || placeholder}
        {valueToOption[value]?.status && (
          <span className='badge caption-2-bold'>
            {valueToOption[value].status}
          </span>
        )}
      </button>
      {showOptions && (
        <div className='options-box' ref={optionsRef}>
          {options.map(({ label, value, status }) => (
            <button
              key={label}
              onClick={getHandleOptionChange(value)}
              type='button'
              className='base-2'
            >
              {label}
              {status && <span className='badge caption-2-bold'>{status}</span>}
            </button>
          ))}
        </div>
      )}
      <select
        id={id}
        name={name}
        defaultValue={value}
        onFocus={(e) => {
          e.preventDefault();
          setShowOptions(true);
        }}
      >
        {options.map(({ label, value }) => (
          <option key={label} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
      status: PropTypes.string,
    })
  ).isRequired,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  prefix: PropTypes.string,
};
