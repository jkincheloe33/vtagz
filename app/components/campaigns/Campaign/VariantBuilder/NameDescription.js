import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDescription, setTitle } from '@/features/variant/slice';
import SectionHeader from '@/components/SectionHeader';
import QuillEditor from '@/components/QuillEditor';

export default function NameDescription() {
  const dispatch = useDispatch();
  const { description, title } = useSelector(({ variant }) => variant.form);

  return (
    <div id='name-description' className='section'>
      <SectionHeader title='Name & description' />
      <label className='builder-label base-2'>Reward name</label>
      <input
        className='builder-input'
        onChange={(e) => dispatch(setTitle(e.target.value))}
        placeholder='Give your reward a name'
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
