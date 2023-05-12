import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllProducts } from '@/features/products/slice';
import { getAllProducts } from '@/features/products/thunks';
import { getAllTimePerformance } from '@/features/products-analytics/thunks';

export default function useProductsData() {
  const { authorized, brand } = useSelector(({ user }) => user);
  const { loaded } = useSelector(({ products }) => products);
  const campaigns = useSelector((store) => selectAllProducts(store));
  const dispatch = useDispatch();

  useEffect(() => {
    if (authorized && brand?.id && !loaded) {
      dispatch(getAllProducts({ brandId: brand.id }));
      dispatch(getAllTimePerformance({ brandId: brand.id }));
    }
  }, [authorized, brand.id, dispatch, loaded]);

  return { campaigns, loaded };
}
