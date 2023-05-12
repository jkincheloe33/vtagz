import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import RadioButton from '@/components/RadioButton';
import FileUpload from '@/components/FileUpload';
import { setReward } from '@/features/variant/slice';
import { REWARD_TYPES } from '@/features/variant/helpers/reward';
import useSharedRewardHandlers from './useSharedRewardHandlers';

export default function RewardShopify() {
  const dispatch = useDispatch();
  const reward = useSelector((store) => store.variant.form.reward);
  const {
    handleFileChange,
    handleFileRemove,
    handleTypeChange,
    handleCodeChange,
  } = useSharedRewardHandlers(REWARD_TYPES.SHOPIFY);

  return (
    <div className='sub-layout'>
      <div className='sub-section'>
        <p className='builder-label base-2'>
          Select a type of Shopify code to use
        </p>
        <RadioButton
          id='shopify-generic'
          name='shopify-code'
          onChange={handleTypeChange}
          value='generic'
          checked={reward.options?.type === 'generic'}
          label='Generic, multi-use (e.g. VTAGZ30)'
        />
        <RadioButton
          id='shopify-unique'
          name='shopify-code'
          onChange={handleTypeChange}
          value='unique'
          checked={reward.options?.type === 'unique'}
          label='Unique, single-use'
          badge='Beta'
        />
      </div>

      {reward.options?.type === 'generic' ? (
        <>
          <div className='sub-section'>
            <label className='builder-label base-2' htmlFor='discount-code'>
              Discount code
            </label>
            <input
              type='text'
              id='discount-code'
              name='discount-code'
              value={reward.options?.code || ''}
              onChange={handleCodeChange}
              placeholder='Enter your discount code (e.g. VTAGZ30)'
            />
          </div>
        </>
      ) : (
        <FileUpload
          id='shopify-unique-upload'
          label='Discount codes file'
          onChange={handleFileChange}
          onRemove={handleFileRemove}
        />
      )}
      <div className='sub-section'>
        <label className='builder-label base-2' htmlFor='shopify-url'>
          Shopify URL
        </label>
        <input
          type='text'
          id='shopify-url'
          name='shopify-url'
          value={reward.options?.url || ''}
          onChange={(e) =>
            dispatch(
              setReward({
                options: {
                  ...reward.options,
                  url: e.target.value,
                },
              })
            )
          }
          placeholder='Enter a link to either an individual product or your Shopify store home'
        />
      </div>
    </div>
  );
}
