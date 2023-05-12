import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SectionHeader from '@/components/SectionHeader';
import {
  selectFilteredProducts,
  setSearch,
  setFilter,
  STATUS,
} from '@/features/products/slice';
import { selectProductsAnalyticsEntities } from '@/features/products-analytics/slice';
import { commaSeparateNumber } from '@/utils';
import SearchBar from '@/components/SearchBar';
import Select from '@/components/Select';
import './list.styl';

const columns = [
  'Campaigns',
  'Status',
  'Quantity',
  'Impressions',
  'Claims',
  'Claim rate',
];

export default function List() {
  const { brand } = useSelector(({ user }) => user);
  const campaigns = useSelector((store) => selectFilteredProducts(store));
  const analytics = useSelector(selectProductsAnalyticsEntities);
  const { search, filter } = useSelector((store) => store.products);
  const dispatch = useDispatch();
  const { push } = useHistory();

  return (
    <div className='section'>
      <div id='list-header'>
        <SectionHeader color='blue' title='Campaigns' />
        <SearchBar
          placeholder='Search campaigns'
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
        />
        <div className='status-filters'>
          {Object.values(STATUS).map((status) => (
            <button
              key={status}
              onClick={() => dispatch(setFilter(status))}
              className={`btn status-filter base-1-semibold ${
                filter === status ? 'active' : ''
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <Select
          onChange={(value) => dispatch(setFilter(value))}
          options={Object.values(STATUS).map((value) => ({
            label: value,
            value,
          }))}
          value={filter}
        />
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
          {campaigns?.length > 0 ? (
            campaigns.map((campaign) => {
              const { claims = 0, impressions = 0 } =
                analytics?.[campaign.id] || {};
              const claimRate = ((claims / impressions) * 100).toFixed(0);

              return (
                <div
                  className='rows table-layout'
                  key={campaign.id}
                  onClick={() => push(`/campaign/${campaign.id}`)}
                >
                  <div className='row-info column'>
                    <img
                      alt={`Image for ${campaign.name}`}
                      src={campaign.imageUrl}
                    />
                    <div>
                      <h4>{campaign.name}</h4>
                      <p>{brand?.name}</p>
                    </div>
                  </div>
                  <p className='column-names column mobile'>{columns[1]}</p>
                  <p className={`status ${campaign.status} column`}>
                    <span>{campaign.status}</span>
                  </p>
                  <p className='column-names column mobile'>{columns[2]}</p>
                  <p className='row-values column'>{campaign.quantity}</p>
                  <p className='column-names column mobile'>{columns[3]}</p>
                  <p className='row-values column'>
                    {commaSeparateNumber(impressions)}
                  </p>
                  <p className='column-names column mobile'>{columns[4]}</p>
                  <p className='row-values column'>
                    {commaSeparateNumber(claims)}
                  </p>
                  <p className='column-names column mobile'>{columns[5]}</p>
                  <p className='row-values column'>
                    {isNaN(claimRate) ? 0 : claimRate}%
                  </p>
                </div>
              );
            })
          ) : (
            <div className='no-campaigns-found'>
              <p className='base-1-semibold'>No campaigns found</p>
              <button
                className='btn secondary'
                onClick={() => {
                  dispatch(setSearch(''));
                  dispatch(setFilter(STATUS.ALL));
                }}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
