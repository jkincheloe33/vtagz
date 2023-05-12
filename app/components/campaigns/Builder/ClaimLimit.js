import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setClaimLimit } from '@/features/product/slice';
import SectionHeader from '@/components/SectionHeader';
import Switch from '@/components/Switch';

export default function ClaimLimit() {
  const dispatch = useDispatch();
  const { claimLimit } = useSelector((store) => store.product.form);
  const { errors } = useSelector(({ product }) => product);

  return (
    <div id='claim-limit' className='section'>
      <SectionHeader title='Claiming' />
      <Switch
        label='Set a claim limit for this campaign'
        onChange={(bool) =>
          dispatch(
            setClaimLimit({ visible: bool, claimLimit: bool ? 1 : null })
          )
        }
        status={!!claimLimit?.visible}
      />
      {claimLimit?.visible && (
        <div className='extended-section'>
          <label className='builder-label base-2'>Claim limit</label>
          {errors?.claimLimit && <p className='error'>{errors.claimLimit}</p>}
          <input
            className='builder-input'
            min='1'
            onChange={(e) =>
              dispatch(
                setClaimLimit({
                  visible: true,
                  claimLimit: Number(e.target.value),
                })
              )
            }
            type='number'
            value={claimLimit?.claimLimit ?? ''}
          />
        </div>
      )}
    </div>
  );
}
