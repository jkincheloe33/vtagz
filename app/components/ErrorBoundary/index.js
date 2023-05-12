import React from 'react';
import { api } from '@/config';
import PropTypes from 'prop-types';
import './styles.styl';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {}

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div id='error-boundary'>
          <h1>Uh Oh!</h1>
          <p>Something unexpected happened...</p>
          <a className='btn btn-light' href={api.root}>
            Back to Dashboard
          </a>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.any,
};
