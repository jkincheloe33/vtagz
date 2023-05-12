import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setQuantity } from '@/features/variant/slice';
import SectionHeader from '@/components/SectionHeader';
import Switch from '@/components/Switch';
import './fallbacks.styl';

export default function Fallbacks() {
  const [quantityWarning, setQuantityWarning] = useState('');
  const dispatch = useDispatch();
  const { errors } = useSelector(({ variant }) => variant);
  const { quantity } = useSelector(({ variant }) => variant.form);
  const { fallbackQuantity, fallbackTier, fallbackVisible } = quantity || {};
  const { fallbackQuantity: quantityError, fallbackTier: tierError } =
    errors.quantity || {};

  const handleQuantityChange = (value) => {
    setQuantityWarning(
      value < 100 && value > 0
        ? 'This quantity looks low, double check this is the correct value.'
        : ''
    );
    dispatch(
      setQuantity({
        fallbackVisible: true,
        fallbackQuantity: value < 0 ? 0 : value,
        fallbackTier,
      })
    );
  };

  const handleTierChange = (value) => {
    dispatch(
      setQuantity({
        fallbackVisible: true,
        fallbackQuantity,
        fallbackTier: value < 0 ? 0 : value,
      })
    );
  };

  return (
    <div id='fallbacks' className='section'>
      <SectionHeader badge='Admin only' title='Fallbacks' />
      <Switch
        label='Use fallback tiers for this reward'
        onChange={(bool) =>
          dispatch(
            setQuantity({
              fallbackVisible: bool,
              fallbackQuantity: null,
              fallbackTier: null,
            })
          )
        }
        status={!!fallbackVisible}
      />
      {fallbackVisible && (
        <div className='extended-section'>
          <div className='label-tip'>
            <label className='builder-label base-2'>Quantity</label>
          </div>
          {(quantityError || quantityWarning) && (
            <p className='error'>{quantityError ?? quantityWarning}</p>
          )}
          <input
            className='builder-input'
            min='0'
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
            placeholder='Enter a fallback quantity'
            type='number'
            value={fallbackQuantity ?? ''}
          />
          <div className='label-tip'>
            <label className='builder-label base-2'>Tier</label>
          </div>
          {tierError && <p className='error'>{tierError}</p>}
          <input
            className='builder-input'
            min='0'
            onChange={(e) => handleTierChange(Number(e.target.value))}
            placeholder='Enter a fallback tier'
            type='number'
            value={fallbackTier ?? ''}
          />
        </div>
      )}
    </div>
  );
}
