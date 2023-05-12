import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { setUnlockables } from '@/features/product/slice';
import {
  getUnlockableProducts,
  getUnlockableRequirements,
} from '@/features/product/thunks';
import SectionHeader from '@/components/SectionHeader';
import Switch from '@/components/Switch';
import './unlockables.styl';

export default function Unlockables() {
  const dispatch = useDispatch();
  const {
    original: { id },
    form: { unlockables },
    unlockableProducts,
    unlockableProductsFetched,
    unlockableRequirements,
    unlockableRequirementsFetched,
  } = useSelector(({ product }) => product);
  const { belongsToUnlockable, btuVisible, isUnlockable } = unlockables || {};

  // get unlockable options from reduced unlockable products
  const unlockableOptions = useMemo(
    () =>
      unlockableProducts?.reduce((result, product) => {
        if (product.id !== id) {
          result.push({
            value: product.id,
            label: product.name,
          });
        }
        return result;
      }, []),
    [id, unlockableProducts]
  );

  // fetch unlockable requirements
  useEffect(() => {
    if (isUnlockable && !unlockableRequirementsFetched) {
      dispatch(getUnlockableRequirements({ id }));
    }
  }, [dispatch, id, isUnlockable, unlockableRequirementsFetched]);

  // fetch unlockable products
  useEffect(() => {
    if (btuVisible && !unlockableProductsFetched) {
      dispatch(getUnlockableProducts());
    }
  }, [btuVisible, dispatch, unlockableProductsFetched]);

  return (
    <div id='unlockables' className='section'>
      <SectionHeader badge='Beta' title='Unlockables' />
      <div className='unlockable-switch'>
        <Switch
          label='Make this campaign an unlockable'
          onChange={(bool) =>
            dispatch(
              setUnlockables({
                isUnlockable: bool,
                belongsToUnlockable: null,
                btuVisible: false,
              })
            )
          }
          status={!!isUnlockable}
        />
      </div>
      {!!isUnlockable && (
        <div className='extended-section'>
          {unlockableRequirements?.length > 0 ? (
            <UnlockableCards unlockedByProducts={unlockableRequirements} />
          ) : (
            <p className='no-campaigns'>
              No campaigns have been linked to this unlockable yet.
            </p>
          )}
        </div>
      )}
      <Switch
        label='Use this campaign to unlock another one'
        onChange={(bool) =>
          dispatch(
            setUnlockables({
              btuVisible: bool,
              belongsToUnlockable: null,
              isUnlockable: false,
            })
          )
        }
        status={!!btuVisible}
      />
      {btuVisible && unlockableOptions && (
        <div className='extended-section'>
          <label className='builder-label base-2'>Campaign</label>
          <select
            onChange={(e) => {
              dispatch(
                setUnlockables({
                  btuVisible: true,
                  belongsToUnlockable: Number(e.target.value),
                  isUnlockable: false,
                })
              );
            }}
            value={belongsToUnlockable || ''}
          >
            <option value=''>Select a campaign</option>
            {unlockableOptions.map(({ label, value }) => (
              <option key={label} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

function UnlockableCards({ unlockedByProducts }) {
  return (
    <>
      <p className='unlockable-info'>
        Other campaigns that unlock this campaign
      </p>
      <div id='unlockable-cards'>
        {unlockedByProducts.map(({ id, imageUrl, name }) => (
          <div className='unlockable-card' key={id}>
            <img alt={`Image for ${name}`} src={imageUrl} />
            <p>{name}</p>
          </div>
        ))}
      </div>
    </>
  );
}

UnlockableCards.propTypes = {
  unlockedByProducts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
};
