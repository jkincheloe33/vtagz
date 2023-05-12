import React, { lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

const Onboarding = lazy(() => import('@/containers/Onboarding'));
const SignIn = lazy(() => import('@/containers/SignIn'));

export default function VisitorRouter() {
  return (
    <Switch>
      <Route path='/signup' render={(props) => <Onboarding {...props} />} />
      <Route path='/signin' render={(props) => <SignIn {...props} />} />
      <Redirect to='/signup' />
    </Switch>
  );
}
