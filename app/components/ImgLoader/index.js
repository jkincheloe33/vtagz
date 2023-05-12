import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Loading from '@/components/Loading';

/**
 * Provides a clean interface for loading images to mitigate FOUC
 * @param {string} className - the name of the wrapped class
 * @param {string} src - the URL of the image, can be nullish
 * @param {object} children - the child image tag to render
 */
export default function ImgLoader({
  className = '',
  src,
  children,
  retry = false,
}) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!src) {
      return;
    }
    let isMounted = true;
    let timeout;
    function loadImage() {
      if (!isMounted) {
        clearTimeout(timeout);
        return;
      }
      const img = new Image();
      img.onload = () => {
        if (!isMounted) {
          return;
        }
        setLoaded(true);
      };
      if (retry) {
        img.onerror = () => {
          timeout = setTimeout(loadImage, 1000);
        };
      }
      img.src = src;
    }
    loadImage();
    return () => (isMounted = false);
  }, [src, retry]);

  if (loaded) {
    if (children) {
      return children;
    } else {
      return <img className={className} src={src} />;
    }
  }
  return (
    <div className={'img-loader ' + className}>
      <Loading contain />
    </div>
  );
}

ImgLoader.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string,
  children: PropTypes.element,
  retry: PropTypes.bool,
};
