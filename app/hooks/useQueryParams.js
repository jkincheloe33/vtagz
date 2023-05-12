import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import qs from 'qs';
// A custom hook that builds on useLocation to parse
// the query string for you.
// @see https://v5.reactrouter.com/web/example/query-parameters
export default function useQueryParams() {
  const { search } = useLocation();
  return useMemo(() => {
    return qs.parse(search, {
      ignoreQueryPrefix: true,
    });
  }, [search]);
}
