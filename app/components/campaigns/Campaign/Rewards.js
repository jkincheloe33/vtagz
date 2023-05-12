import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { selectAllVariants } from '@/features/variants/slice';
import { selectProductById, STATUS } from '@/features/products/slice';
import { getVariantsByProductId } from '@/features/variants/thunks';
import SectionHeader from '@/components/SectionHeader';
import PlusIcon from '@/static/assets/plus-icon.svg';

const columns = ['Reward', 'Status', 'Quantity', 'Claims', 'Type'];

export default function Rewards() {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { id } = useParams();
  const { status } = useSelector((store) => selectProductById(store, id));
  const variants = useSelector((store) => selectAllVariants(store));
  const { brand } = useSelector(({ user }) => user);

  useEffect(() => {
    if (id) {
      dispatch(getVariantsByProductId({ id }));
    }
  }, [id, dispatch]);

  return (
    <div id='rewards' className='section'>
      <div className='campaign-header'>
        <SectionHeader title='Rewards' />
        {status !== STATUS.INACTIVE && (
          <Link
            className='btn tertiary icon'
            to={`/variant/create/?campaignId=${id}`}
          >
            <img src={PlusIcon} /> Create a reward
          </Link>
        )}
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
          {variants?.length > 0 ? (
            variants.map((v) => (
              <div
                className={`rows table-layout ${v.disabled ? 'inactive' : ''}`}
                key={v.id}
                onClick={() =>
                  !v.disabled && push(`/variant/edit/${v.id}/?campaignId=${id}`)
                }
              >
                <div className='row-info column'>
                  <img alt={`Image for ${v.title}`} src={v.images[0]} />
                  <div>
                    <h4>{v.title}</h4>
                    <p>{brand?.name}</p>
                  </div>
                </div>
                <p className='column-names column mobile'>{columns[1]}</p>
                <p
                  className={`status ${
                    v.disabled ? 'inactive' : 'active'
                  } column`}
                >
                  <span>{v.disabled ? 'Inactive' : 'Active'}</span>
                </p>
                <p className='column-names column mobile'>{columns[2]}</p>
                <p className='row-values column'>{v.quantity}</p>
                <p className='column-names column mobile'>{columns[3]}</p>
                <p className='row-values column'>Placeholder</p>
                <p className='column-names column mobile'>{columns[4]}</p>
                <p className='row-values column'>{v.utility?.type ?? 'None'}</p>
              </div>
            ))
          ) : (
            <h3 className='base-1-semibold empty'>
              No rewards for this campaign
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}
