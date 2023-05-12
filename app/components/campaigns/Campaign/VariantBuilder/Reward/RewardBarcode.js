import React from 'react';
import { useSelector } from 'react-redux';
import RadioButton from '@/components/RadioButton';
import FileUpload from '@/components/FileUpload';
import { REWARD_TYPES } from '@/features/variant/helpers/reward';
import useSharedRewardHandlers from './useSharedRewardHandlers';

export default function RewardBarcode() {
  const reward = useSelector((store) => store.variant.form.reward);
  const {
    handleFileChange,
    handleFileRemove,
    handleTypeChange,
    handleCodeChange,
  } = useSharedRewardHandlers(REWARD_TYPES.BARCODE);

  return (
    <div className='sub-layout'>
      <div className='sub-section'>
        <p className='builder-label base-2'>Select a type of barcode to use</p>
        <RadioButton
          id='barcode-generic'
          name='barcode-type'
          onChange={handleTypeChange}
          value='generic'
          checked={reward.options?.type === 'generic'}
          label='Generic, multi-use'
        />
        <RadioButton
          id='barcode-unique'
          name='barcode-type'
          onChange={handleTypeChange}
          value='unique'
          checked={reward.options?.type === 'unique'}
          label='Unique, single-use'
          badge='beta'
        />
      </div>

      {reward.options?.type === 'generic' ? (
        <>
          <div className='sub-section'>
            <label className='builder-label base-2' htmlFor='barcode'>
              Barcode
            </label>
            <input
              type='text'
              id='barcode'
              name='barcode'
              value={reward.options?.code || ''}
              onChange={handleCodeChange}
              placeholder='Enter your barcode in Code128 format'
            />
          </div>
        </>
      ) : (
        <FileUpload
          id='barcode-unique-upload'
          label='Barcodes file'
          onChange={handleFileChange}
          onRemove={handleFileRemove}
        />
      )}
    </div>
  );
}
