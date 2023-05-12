import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProductById, STATUS } from '@/features/products/slice';
import Performance from '@/components/campaigns/Performance';
import ClaimLinks from './ClaimLinks';
import EditCampaign from './EditCampaign';
import Heading from './Heading';
import Integrations from './Integrations';
import Rewards from './Rewards';
import './campaign.styl';

export default function Campaign() {
  const { id } = useParams();
  const { status } = useSelector((store) => selectProductById(store, id));

  return (
    <div id='campaign'>
      <Heading />
      <Performance />
      <EditCampaign />
      <Integrations />
      <Rewards />
      {status === STATUS.ACTIVE && <ClaimLinks />}
    </div>
  );
}
