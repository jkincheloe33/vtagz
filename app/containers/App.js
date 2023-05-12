import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { NavigationProvider } from '@/contexts/NavigationContext';
import Header, { LoggedOutHeader } from '@/components/Header';
import UserRouter from '@/router/User';
import VisitorRouter from '@/router/Visitor';
import ScrollToTopProvider from '@/contexts/ScrollToTop';
import Loading from '@/components/Loading';
import { getSession } from '@/features/login/thunks';

export default function App() {
  const dispatch = useDispatch();
  const { authorized, initialized, loading } = useSelector(({ app }) => app);

  useEffect(() => {
    if (!initialized) {
      dispatch(getSession());
    }
  }, [dispatch, initialized]);

  return loading ? (
    <Loading />
  ) : (
    <NavigationProvider>
      <ScrollToTopProvider>
        {authorized ? (
          <>
            <Header />
            <UserRouter />
          </>
        ) : (
          <>
            <LoggedOutHeader />
            <VisitorRouter />
          </>
        )}
      </ScrollToTopProvider>
      <ToastContainer position={'top-center'} autoClose={15000} closeOnClick />
    </NavigationProvider>
  );
}
