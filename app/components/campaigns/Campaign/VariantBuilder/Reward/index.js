import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SectionHeader from '@/components/SectionHeader';
import Select from '@/components/Select';
import RewardShopify from './RewardShopify';
import RewardBarcode from './RewardBarcode';
import RewardUrl from './RewardUrl';
import RewardImage from './RewardImage';
import { setReward, setRarity, setQuantity } from '@/features/variant/slice';
import { REWARD_TYPES } from '@/features/variant/helpers/reward';
import { RARITIES } from '@/features/variant/helpers/rarity';
import './reward.styl';

// used to fill the reward types select
const REWARD_TYPES_OPTIONS = [
  {
    label: 'None',
    value: REWARD_TYPES.NONE,
  },
  {
    label: 'Shopify discount codes',
    value: REWARD_TYPES.SHOPIFY,
  },
  {
    label: 'URLs',
    value: REWARD_TYPES.URL,
  },
  {
    label: 'Barcodes',
    value: REWARD_TYPES.BARCODE,
  },
  {
    label: 'Image',
    value: REWARD_TYPES.IMAGE,
    status: 'beta',
  },
];

// used to dispatch the proper default values whenever a reward type is selected
const REWARD_TO_DISPATCH = {
  [REWARD_TYPES.NONE]: { type: REWARD_TYPES.NONE, options: undefined },
  [REWARD_TYPES.SHOPIFY]: {
    type: REWARD_TYPES.SHOPIFY,
    options: { type: 'generic' },
  },
  [REWARD_TYPES.URL]: { type: REWARD_TYPES.URL, options: { type: 'generic' } },
  [REWARD_TYPES.BARCODE]: {
    type: REWARD_TYPES.BARCODE,
    options: { type: 'generic' },
  },
  [REWARD_TYPES.IMAGE]: { type: REWARD_TYPES.IMAGE, options: { imageUrl: '' } },
};

// used to fill the rarity select
const RARITY_OPTIONS = [
  { label: 'Legendary', value: RARITIES.LEGENDARY },
  { label: 'Epic', value: RARITIES.EPIC },
  { label: 'Rare', value: RARITIES.RARE },
  { label: 'Uncommon', value: RARITIES.UNCOMMON },
  { label: 'Common', value: RARITIES.COMMON },
];

export default function Reward() {
  const dispatch = useDispatch();
  const { reward, rarity, quantity } = useSelector(
    (store) => store.variant.form
  );

  return (
    <div id='reward' className='section'>
      <SectionHeader title='Reward' />

      <div className='sub-section'>
        <label className='builder-label base-2' htmlFor='reward-options'>
          Type
        </label>
        <Select
          options={REWARD_TYPES_OPTIONS}
          id='reward-options'
          value={reward?.type}
          onChange={(v) => dispatch(setReward(REWARD_TO_DISPATCH[v]))}
          placeholder='Select a type of reward'
        />
      </div>

      {reward?.type === REWARD_TYPES.SHOPIFY ? (
        <RewardShopify />
      ) : reward?.type === REWARD_TYPES.URL ? (
        <RewardUrl />
      ) : reward?.type === REWARD_TYPES.BARCODE ? (
        <RewardBarcode />
      ) : (
        reward?.type === REWARD_TYPES.IMAGE && <RewardImage />
      )}

      <div className='sub-section'>
        <label className='builder-label base-2' htmlFor='quantity'>
          Quantity
        </label>

        <input
          type='number'
          min='0'
          value={quantity?.quantity || ''}
          id='quantity'
          onChange={(e) =>
            dispatch(setQuantity({ quantity: Number(e.target.value) }))
          }
          placeholder='How many do you want to give away'
        />
      </div>

      <div className='sub-section'>
        <div className='rarity-label-wrapper'>
          <div className='tooltip-label'>
            <label className='builder-label base-2' htmlFor='rarity-options'>
              Rarity
            </label>
          </div>
          <span className='caption-1-medium optional'>Optional</span>
        </div>
        <Select
          options={RARITY_OPTIONS}
          id='rarity-options'
          value={rarity}
          onChange={(v) => dispatch(setRarity(v))}
          placeholder='Select a rarity'
        />
      </div>
    </div>
  );
}
