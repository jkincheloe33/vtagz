import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useQueryParams from '@/hooks/useQueryParams';
import { reset } from '@/features/sms/slice';
import { getSmsCampaign } from '@/features/sms/thunks';
import Loading from '@/components/Loading';
import NavigationBlocker from '@/components/NavigationBlocker';
import SectionHeader from '@/components/SectionHeader';
import CreateSave from './CreateSave';
import Faq from './Faq';
import Onboarding from './Onboarding';
import './sms-builder.styl';

export default function SmsBuilder() {
  const dispatch = useDispatch();
  const { campaignId: productId } = useQueryParams();
  const { loading, update } = useSelector(({ sms }) => sms);
  const shouldBlockNavigation = useMemo(
    () => Object.keys(update).length > 0,
    [update]
  );

  useEffect(() => {
    if (productId) {
      dispatch(getSmsCampaign({ productId: Number(productId) }));
    }

    return () => dispatch(reset());
  }, [dispatch, productId]);

  return productId && loading ? (
    <Loading />
  ) : (
    <div id='sms-builder'>
      <div>
        <h1>SMS auto-replies</h1>
      </div>
      <div id='sms-builder' className='section'>
        <SectionHeader title='Automated messages' />
        <Onboarding />
        <Faq />
      </div>
      <CreateSave />
      <NavigationBlocker shouldBlock={shouldBlockNavigation} />
    </div>
  );
}
