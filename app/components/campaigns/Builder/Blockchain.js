import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { gatedChainIdOptions } from '@/features/product/helpers/blockchain';
import { setGated } from '@/features/product/slice';
import SectionHeader from '@/components/SectionHeader';
import Switch from '@/components/Switch';

// toggles on/off gated part of builder. dropdown & input fields set gatedChainId & gatedContractAddress
export default memo(function Blockchain() {
  const dispatch = useDispatch();
  const { form } = useSelector(({ product }) => product);
  const { gatedChainId, gatedContractAddress, visible } = form?.gated || {};

  return (
    <div className='section'>
      <SectionHeader badge='Beta' title='Blockchain' />
      <Switch
        label='Gate this campaign to holders of a blockchain token'
        onChange={() =>
          dispatch(
            setGated({
              visible: !visible,
              gatedChainId: null,
              gatedContractAddress: null,
            })
          )
        }
        status={!!visible}
      />
      {visible && (
        <div className='extended-section'>
          <label className='builder-label base-2'>Blockchain</label>
          <select
            className='blockchain-select'
            onChange={(e) =>
              dispatch(
                setGated({
                  visible: true,
                  gatedChainId: Number(e.target.value),
                  gatedContractAddress,
                })
              )
            }
            value={gatedChainId || ''}
          >
            <option value=''>Select a blockchain</option>
            {gatedChainIdOptions.map(({ label, value }) => (
              <option key={label} value={value}>
                {label}
              </option>
            ))}
          </select>
          <label className='builder-label base-2'>Contract address</label>
          <input
            className='builder-input'
            onChange={(e) =>
              dispatch(
                setGated({
                  visible: true,
                  gatedChainId,
                  gatedContractAddress: e.target.value,
                })
              )
            }
            placeholder='Enter the contract address'
            value={gatedContractAddress || ''}
          />
        </div>
      )}
    </div>
  );
});
