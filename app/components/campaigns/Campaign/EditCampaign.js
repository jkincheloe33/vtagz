import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { commaSeparateNumber } from '@/utils';
import { selectProductById, STATUS } from '@/features/products/slice';
import { selectProductsAnalyticsById } from '@/features/products-analytics/slice';
import SectionHeader from '@/components/SectionHeader';
import PencilIcon from '@/static/assets/pencil-icon.svg';

const columns = [
  'Campaign',
  'Status',
  'Quantity',
  'Impressions',
  'Claims',
  'Claim rate',
];

export default function EditCampaign() {
  const { push } = useHistory();
  const { id } = useParams();
  const campaign = useSelector((store) => selectProductById(store, id));
  const { brand } = useSelector(({ user }) => user);
  const analytics = useSelector((store) =>
    selectProductsAnalyticsById(store, id)
  );
  const { claims = 0, impressions = 0 } = analytics || {};
  const claimRate = ((claims / impressions) * 100).toFixed(0);

  return (
    <div id='edit-campaign' className='section'>
      <div className='campaign-header'>
        <SectionHeader color='blue' title='Campaign' />
        {campaign.status !== STATUS.INACTIVE && (
          <Link className='btn tertiary icon' to={`/campaign/edit/${id}`}>
            <img src={PencilIcon} /> Edit campaign
          </Link>
        )}
      </div>
      <div className='list-table'>
        <div className='list-overflow'>
          <div
            className='columns table-layout'
            onClick={() => push(`/campaign/edit/${id}`)}
          >
            {columns.map((c, i) => (
              <p className='column-names column' key={i}>
                {c}
              </p>
            ))}
          </div>
          <div className='rows table-layout'>
            <div className='row-info column'>
              <img alt={`Image for ${campaign.name}`} src={campaign.imageUrl} />
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
            <p className='row-values column'>{commaSeparateNumber(claims)}</p>
            <p className='column-names column mobile'>{columns[5]}</p>
            <p className='row-values column'>
              {isNaN(claimRate) ? 0 : claimRate}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
