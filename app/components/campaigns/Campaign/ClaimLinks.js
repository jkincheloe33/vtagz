import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams, useHistory } from 'react-router-dom';
import { selectProductById } from '@/features/products/slice';
import SectionHeader from '@/components/SectionHeader';
import Select from '@/components/Select';
import PlusIcon from '@/static/assets/plus-icon.svg';
import './claim-links.styl';

const columns = [
  'Parameter',
  'Impressions',
  'Claims',
  'Claim Rate',
  'Performance',
];

const dropdownOptions = [
  { label: 'Content', value: 'content' },
  { label: 'Platform', value: 'platform' },
  { label: 'Traffic', value: 'traffic' },
  { label: 'Audience', value: 'audience' },
];

export default function ClaimLinks() {
  const { id } = useParams();
  const { push } = useHistory();
  const product = useSelector((store) => selectProductById(store, id));
  const [sortBy, setSortBy] = useState(dropdownOptions[0].value);
  // retrieve from proper place once API details are known
  const claimLinks =
    product.claimLinks &&
    [...product.claimLinks].sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

  return (
    <div id='claim-links'>
      <div id='rewards' className='section'>
        <div className='campaign-header'>
          <SectionHeader title='Claim links' color='yellow' />
          <div className='header-actions'>
            <Link
              className='btn tertiary icon'
              to={`/claim-links/create/?campaignId=${id}`}
            >
              <img src={PlusIcon} /> Create a link
            </Link>
            <Select
              options={dropdownOptions}
              value={sortBy}
              onChange={(v) => setSortBy(v)}
              prefix='By '
            />
          </div>
        </div>
        <div className='list-table'>
          <div className='list-overflow'>
            <div className='columns table-layout'>
              {columns.map((c, i) => (
                <p className='column-names column' key={i}>
                  {c}
                </p>
              ))}
            </div>
            {claimLinks?.length > 0 ? (
              claimLinks.map((v) => (
                <div
                  className='rows table-layout'
                  key={v.id}
                  onClick={() =>
                    push(`/claim-links/edit/?campaignId=${id}`, {
                      claimLink: v,
                    })
                  }
                >
                  <p className='row-values column'>{v[sortBy]}</p>
                  <p className='row-values column'>
                    {v.impressions.toLocaleString()}
                  </p>
                  <p className='row-values column'>
                    {v.claims.toLocaleString()}
                  </p>
                  <p className='row-values column'>
                    {v.claimRate.toFixed(1).toLocaleString()}%
                  </p>
                  <p
                    className={`row-values column ${
                      v.performance < 0
                        ? 'primary-03'
                        : v.performance === 0
                        ? ''
                        : 'primary-02'
                    }`}
                  >
                    {v.performance === 0
                      ? '-'
                      : `${v.performance.toFixed(1).toLocaleString()}%`}
                  </p>
                </div>
              ))
            ) : (
              <h3 className='base-1-semibold empty'>
                No impressions for this campaign yet
              </h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
