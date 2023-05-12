import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDescription, setName, setTitle } from '@/features/product/slice';
import SectionHeader from '@/components/SectionHeader';
import QuillEditor from '@/components/QuillEditor';
import './name-description.styl';

export default function NameDescription() {
  const dispatch = useDispatch();
  const { description, name, title } = useSelector(
    ({ product }) => product.form
  );

  return (
    <div className='section'>
      <SectionHeader title='Name & description' />
      <label className='builder-label base-2'>Campaign name</label>
      <input
        className='builder-input'
        onChange={(e) => dispatch(setName(e.target.value))}
        placeholder='Give your campaign a name'
        value={name ?? ''}
      />
      <label className='builder-label base-2'>Display name</label>
      <input
        className='builder-input'
        onChange={(e) => dispatch(setTitle(e.target.value))}
        placeholder='The name consumers will see'
        value={title ?? ''}
      />
      <label className='builder-label base-2'>Description</label>
      <QuillEditor
        onChange={(value, _, source) => {
          source === 'user' && dispatch(setDescription(value));
        }}
        placeholder='Enter a description'
        value={description}
      />
    </div>
  );
}
