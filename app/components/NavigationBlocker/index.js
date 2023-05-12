import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router-dom';

export default function NavigationBlocker({
  shouldBlock,
  message = 'Leaving this page will lose your unsaved changes',
}) {
  // blocks refresh/closing
  useEffect(() => {
    if (shouldBlock) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = undefined;
    }

    return () => {
      window.onbeforeunload = null;
    };
  });

  // blocks react-router navigation
  return <Prompt when={shouldBlock} message={message} />;
}

NavigationBlocker.propTypes = {
  shouldBlock: PropTypes.bool,
  message: PropTypes.string,
};
