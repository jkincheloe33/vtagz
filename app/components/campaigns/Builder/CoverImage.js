import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setImageUrl } from '@/features/product/slice';
import DragDrop from '@/components/DragDrop';
import SectionHeader from '@/components/SectionHeader';

export default function CoverImage() {
  const dispatch = useDispatch();
  const { imageUrl } = useSelector((store) => store.product.form);

  function onRemoveCover() {
    dispatch(setImageUrl(''));
  }

  const onUploadCover = useCallback(
    (urls) => dispatch(setImageUrl(urls[0])),
    [dispatch]
  );
  return (
    <div className='section'>
      <SectionHeader title='Image' />
      <label className='builder-label base-2'>Cover image</label>
      <DragDrop
        imageUrls={imageUrl ? [imageUrl] : []}
        maxFiles={1}
        onRemove={onRemoveCover}
        onUpload={onUploadCover}
      />
    </div>
  );
}
