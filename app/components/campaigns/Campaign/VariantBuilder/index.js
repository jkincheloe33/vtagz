import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { hasPermission, AccountPermissions } from '@/features/user/slice';
import { reset } from '@/features/variant/slice';
import { getVariant } from '@/features/variant/thunks';
import Loading from '@/components/Loading';
import Actions from './Actions';
import Details from './Details';
import Fallbacks from './Fallbacks';
import Images from './Images';
import NameDescription from './NameDescription';
import Reward from './Reward';
import Availability from './Availability';
import NavigationBlocker from '@/components/NavigationBlocker';
import useQueryParams from '@/hooks/useQueryParams';
import './styles.styl';

export default function VariantBuilder() {
  const roleFlag = useSelector((store) => store.user.roleFlag);
  const {
    loading,
    original: variant,
    update,
  } = useSelector((store) => store.variant);
  const dispatch = useDispatch();
  const { location } = useHistory();
  const { id } = useParams();
  const { campaignId: productId } = useQueryParams();
  const shouldBlockNavigation = useMemo(
    () => Object.keys(update).length > 0,
    [update]
  );

  useEffect(() => {
    if (id) {
      dispatch(getVariant({ id, productId: Number(productId) }));
    }
    // clear out state on unmount
    return () => dispatch(reset());
  }, [dispatch, id, productId, location.pathname]);

  return id && loading ? (
    <Loading />
  ) : (
    <>
      <h1>{variant.title ? variant.title : 'New Reward'}</h1>
      <div id='variant-builder'>
        <form className='builder'>
          <NameDescription />
          <Reward />
          <Availability />
          <Images />
          {!!hasPermission(roleFlag, AccountPermissions.SUPERADMIN) && (
            <Fallbacks />
          )}
        </form>
        <Details />
      </div>
      <Actions />
      <NavigationBlocker shouldBlock={shouldBlockNavigation} />
    </>
  );
}
