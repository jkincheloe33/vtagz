import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { getSmsCampaign } from '@/features/sms/thunks';
import ProButton from '@/components/ProButton';
import SectionHeader from '@/components/SectionHeader';
import SMSIcon from '@/static/assets/sms-marketing-icon.svg';
import './integrations.styl';

export default function Integrations() {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { id: productId } = useParams();
  const { id, isEdit, loaded, status } = useSelector(({ sms }) => sms);

  useEffect(() => {
    if (!loaded) {
      dispatch(getSmsCampaign({ productId: Number(productId) }));
    }
  }, [dispatch, loaded, productId]);

  return (
    <div id='integrations' className='section'>
      <SectionHeader color='purple' title='Integrations' />
      <div id='interactions-buttons'>
        <ProButton
          icon={SMSIcon}
          onClick={() =>
            push(
              isEdit
                ? `/sms/edit/${id}?campaignId=${productId}`
                : `/sms/create?campaignId=${productId}`
            )
          }
          specialText={{
            status: status ?? undefined,
            text: isEdit ? status : 'Click here to setup',
          }}
          text='SMS auto-replies'
        />
      </div>
    </div>
  );
}
