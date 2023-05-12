import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import Sidebar from '@/components/Sidebar';
import Builder from '@/components/campaigns/Builder';
import Campaigns from '@/components/campaigns/Campaigns';
import Campaign from '@/components/campaigns/Campaign';
import SmsBuilder from '@/components/campaigns/Campaign/Integrations/SmsBuilder';
import VariantBuilder from '@/components/campaigns/Campaign/VariantBuilder';
import ClaimLinkBuilder from '@/components/campaigns/Campaign/ClaimLinkBuilder';
import Settings from '@/components/Settings';
import useProductsData from '@/hooks/useProductsData';
import Loading from '@/components/Loading';
import './styles.styl';

export default function User() {
  const { loaded } = useProductsData();

  return loaded ? (
    <div className='layout'>
      <Sidebar
        tabs={[
          { icon: 'divide', title: 'Campaigns', to: '/campaigns' },
          { icon: 'gear', title: 'Settings', to: '/settings' },
        ]}
      />
      <Switch>
        <Route exact path={'/campaigns'}>
          <MainLayout>
            <Campaigns />
          </MainLayout>
        </Route>
        <Route path={['/campaigns/create', '/campaign/edit/:id']}>
          <MainLayout hasFooter>
            <Builder />
          </MainLayout>
        </Route>
        <Route exact path={'/campaign/:id'}>
          <MainLayout>
            <Campaign />
          </MainLayout>
        </Route>
        <Route path={['/sms/create', '/sms/edit/:id']}>
          <MainLayout hasFooter>
            <SmsBuilder />
          </MainLayout>
        </Route>
        <Route path={['/variant/create', '/variant/edit/:id']}>
          <MainLayout hasFooter>
            <VariantBuilder />
          </MainLayout>
        </Route>
        <Route path={'/settings'}>
          <MainLayout>
            <Settings />
          </MainLayout>
        </Route>
        <Route path={['/claim-links/create', '/claim-links/edit']}>
          <MainLayout hasFooter>
            <ClaimLinkBuilder />
          </MainLayout>
        </Route>
        <Redirect to={'/campaigns'} />
      </Switch>
    </div>
  ) : (
    <Loading dimmed />
  );
}
