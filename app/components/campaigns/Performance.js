import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { setStartDate, TIMESTAMPS } from '@/features/products-analytics/slice';
import { getPerformanceSummary } from '@/features/products-analytics/thunks';
import SectionHeader from '@/components/SectionHeader';
import Select from '@/components/Select';
import Tooltip from '@/components/Tooltip';
import EyeIcon from '@/static/assets/eye-icon.svg';
import PercentIcon from '@/static/assets/percent-icon.svg';
import PersonIcon from '@/static/assets/person-icon.svg';
import { formatNumber } from '@/utils';
import './performance.styl';

const icons = {
  eye: EyeIcon,
  percent: PercentIcon,
  person: PersonIcon,
};

export default function Performance() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { startDate, summary } = useSelector(
    ({ productsAnalytics }) => productsAnalytics
  );
  const { claims = 0, impressions = 0 } = summary || {};
  const claimRate = ((claims / impressions) * 100).toFixed(0);

  useEffect(() => {
    dispatch(
      getPerformanceSummary({
        productId: id ? Number(id) : undefined,
        startDate,
      })
    );
  }, [dispatch, id, startDate]);

  return (
    <div id='performance' className='section'>
      <div className='performance-header'>
        <SectionHeader color='purple' title='Performance' />
        <Select
          onChange={(v) => dispatch(setStartDate(v))}
          options={TIMESTAMPS}
          value={startDate}
        />
      </div>
      <div id='performance-blocks'>
        <Block
          icon='eye'
          type='Impressions'
          value={impressions === 0 ? '-' : formatNumber(impressions)}
        />
        <Block
          icon='person'
          type='Claims'
          value={claims === 0 ? '-' : formatNumber(claims)}
        />
        <Block
          icon='percent'
          type='Claim rate'
          value={isNaN(claimRate) ? '-' : `${claimRate}%`}
        />
      </div>
    </div>
  );
}

function Block({ icon, tooltip, type, value }) {
  return (
    <div className='block'>
      <img alt={`${icon} icon`} className='block-icon' src={icons[icon]} />
      <div className='block-type'>
        <p>{type}</p>
        {tooltip && <Tooltip message={tooltip} />}
      </div>
      <h3>{value}</h3>
    </div>
  );
}

Block.propTypes = {
  icon: PropTypes.oneOf(Object.keys(icons)).isRequired,
  tooltip: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
