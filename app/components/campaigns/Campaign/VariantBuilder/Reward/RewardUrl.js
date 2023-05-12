import React from 'react';
import { useSelector } from 'react-redux';
import RadioButton from '@/components/RadioButton';
import FileUpload from '@/components/FileUpload';
import { REWARD_TYPES } from '@/features/variant/helpers/reward';
import useSharedRewardHandlers from './useSharedRewardHandlers';

export default function RewardUrl() {
  const reward = useSelector((store) => store.variant.form.reward);
  const {
    handleFileChange,
    handleFileRemove,
    handleTypeChange,
    handleCodeChange,
  } = useSharedRewardHandlers(REWARD_TYPES.URL);

  return (
    <div className='sub-layout'>
      <div className='sub-section'>
        <p className='builder-label base-2'>Select a type of URL to use</p>
        <RadioButton
          id='url-generic'
          name='url-type'
          onChange={handleTypeChange}
          value='generic'
          checked={reward.options?.type === 'generic'}
          label='Generic, multi-use'
          badge='beta'
        />
        <RadioButton
          id='url-unique'
          name='url-type'
          onChange={handleTypeChange}
          value='unique'
          checked={reward.options?.type === 'unique'}
          label='Unique, single-use'
        />
      </div>

      {reward.options?.type === 'generic' ? (
        <>
          <div className='sub-section'>
            <label className='builder-label base-2' htmlFor='url'>
              URL
            </label>
            <input
              type='text'
              id='url'
              name='url'
              value={reward.options?.code || ''}
              onChange={handleCodeChange}
              placeholder='Enter your URL'
            />
          </div>
        </>
      ) : (
        <FileUpload
          id='url-unique-upload'
          label='URLs file'
          onChange={handleFileChange}
          onRemove={handleFileRemove}
        />
      )}
    </div>
  );
}
