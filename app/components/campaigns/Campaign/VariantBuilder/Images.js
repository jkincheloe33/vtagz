import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setImages } from '@/features/variant/slice';
import DragDrop from '@/components/DragDrop';
import SectionHeader from '@/components/SectionHeader';

export default function Images() {
  const dispatch = useDispatch();
  const { images } = useSelector(({ variant }) => variant.form);

  function onRemove(url) {
    dispatch(setImages(images.filter((u) => u !== url)));
  }

  const onUpload = (urls) => {
    dispatch(setImages([...(images ?? []), ...urls]));
  };

  return (
    <div id='images' className='section'>
      <SectionHeader title='Image' />
      <label className='builder-label base-2'>Reward images</label>
      <DragDrop imageUrls={images} onRemove={onRemove} onUpload={onUpload} />
    </div>
  );
}
