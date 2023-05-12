import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { reset } from '@/features/product/slice';
import { getProductById } from '@/features/product/thunks';
import { AccountPermissions, hasPermission } from '@/features/user/slice';
import Loading from '@/components/Loading';
import Blockchain from './Blockchain';
import CampaignLinks from './CampaignLinks';
import ClaimLimit from './ClaimLimit';
import Controls from './Controls';
import CoverImage from './CoverImage';
import CreateSave from './CreateSave';
import Legal from './Legal';
import NameDescription from './NameDescription';
import Branding from './Branding';
import Unlockables from './Unlockables';
import NavigationBlocker from '@/components/NavigationBlocker';
import 'react-quill/dist/quill.snow.css';
import './styles.styl';

export default function Builder() {
  const { location } = useHistory();
  const { id } = useParams();
  const dispatch = useDispatch();
  const roleFlag = useSelector((store) => store.user.roleFlag);
  const { isEdit, loading, update } = useSelector(({ product }) => product);
  const shouldBlockNavigation = useMemo(
    () => Object.keys(update).length > 0,
    [update]
  );

  useEffect(() => {
    if (id) {
      dispatch(getProductById({ id }));
    }
    // clear out state on unmount
    return () => {
      dispatch(reset());
    };
  }, [dispatch, id, location.pathname]);

  return id && loading ? (
    <Loading />
  ) : (
    <>
      <h1>{isEdit ? 'Edit campaign' : 'New campaign'}</h1>
      <form id='builder-form' className='builder'>
        <NameDescription />
        <CoverImage />
        <ClaimLimit />
        <Legal />
        <CampaignLinks />
        {!!hasPermission(roleFlag, AccountPermissions.SUPERADMIN) && (
          <>
            <Branding />
            <Blockchain />
            <Unlockables />
            <Controls />
          </>
        )}
      </form>
      <CreateSave campaignId={Number(id)} />
      <NavigationBlocker shouldBlock={shouldBlockNavigation} />
    </>
  );
}
