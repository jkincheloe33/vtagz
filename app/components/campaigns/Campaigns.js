import React from 'react';
import List from './List';
import Performance from './Performance';
import CreateCampaign from './CreateCampaign';
import useProductsData from '@/hooks/useProductsData';
import './campaigns.styl';

export default function Campaigns() {
  const { campaigns } = useProductsData();

  return (
    <>
      <h1>Your campaigns</h1>
      {campaigns?.length > 0 ? (
        <>
          <Performance />
          <List />
        </>
      ) : (
        <CreateCampaign />
      )}
    </>
  );
}
