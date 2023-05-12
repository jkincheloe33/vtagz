import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHidden } from '@/features/product/slice';
import SectionHeader from '@/components/SectionHeader';
import Switch from '@/components/Switch';

export default function Controls() {
  const dispatch = useDispatch();
  const { hidden } = useSelector(({ product }) => product.form);

  return (
    <div id='controls' className='section'>
      <SectionHeader badge='Admin only' title='Controls' />
      <Switch
        label='Hide this campaign in the marketplace of offers'
        onChange={(bool) => dispatch(setHidden(bool))}
        status={!!hidden}
      />
    </div>
  );
}
