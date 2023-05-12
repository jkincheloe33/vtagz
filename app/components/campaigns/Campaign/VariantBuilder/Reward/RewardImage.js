import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DragDrop from '@/components/DragDrop';
import { setReward } from '@/features/variant/slice';

export default function RewardImage() {
  const dispatch = useDispatch();
  const reward = useSelector((store) => store.variant.form.reward);

  function onRemoveImage() {
    dispatch(setReward({ options: { code: '' } }));
  }

  const onUploadImage = useCallback(
    (urls) => dispatch(setReward({ options: { code: urls[0] } })),
    [dispatch]
  );

  return (
    <div className='sub-section'>
      <div className='tooltip-label'>
        <label className='builder-label base-2'>Upload</label>
      </div>
      <DragDrop
        imageUrls={reward.options?.code ? [reward.options?.code] : []}
        maxFiles={1}
        onRemove={onRemoveImage}
        onUpload={onUploadImage}
      />
    </div>
  );
}
