import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { store } from './store';
import { Provider } from 'react-redux';
import App from './containers/App';
import Loading from './components/Loading';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/bootstrap/main.scss';
import './styles/index.styl';

const root = document.createElement('div');
root.setAttribute('id', 'app');

render(
  <ErrorBoundary>
    <Provider store={store}>
      <Router>
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route render={(props) => <App {...props} />} />
          </Switch>
        </Suspense>
      </Router>
    </Provider>
  </ErrorBoundary>,
  root
);

document.body.insertBefore(root, document.body.firstElementChild);
