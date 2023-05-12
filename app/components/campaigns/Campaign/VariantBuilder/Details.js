import React from 'react';
import { useSelector } from 'react-redux';
import useQueryParams from '@/hooks/useQueryParams';
import { selectProductById } from '@/features/products/slice';
import SectionHeader from '@/components/SectionHeader';
import './details.styl';

export default function Details() {
  const { campaignId } = useQueryParams();
  const { brand } = useSelector(({ user }) => user);
  const campaign =
    useSelector((store) => selectProductById(store, campaignId)) || {};
  const { imageUrl, name } = campaign || {};

  return (
    <div id='details' className='section'>
      <SectionHeader color='blue' title='Campaign' />
      <img alt={`${brand.name} campaign image`} src={imageUrl} />
      <h3 className='title-1-semibold'>{name}</h3>
      <p>
        by <span>{brand.name}</span>
      </p>
    </div>
  );
}
