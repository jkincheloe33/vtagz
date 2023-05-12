import { useState, useRef } from 'react';
import { api, axios } from '@/config';

/**
 * @NOTE change in spec made multiple upload support in backend to be non-existant for now.
 * This shouldn't be a problem as this hook works for 1 or multiple uploads.
 */
export default function useImageUploader() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [total, setTotal] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  // used to calculate accurate upload progress when uploading more than 1 file
  const progressMap = useRef({});

  const uploadFile = async ({ file, onUploadProgress }) => {
    const data = new FormData();
    data.append('images', file);

    const response = await axios(`${api.product}/upload`, {
      method: 'POST',
      data,
      ...(onUploadProgress && { onUploadProgress }),
    });
    if (response.data.imageUrls) {
      return response.data.imageUrls;
    }
    throw 'Error uploading image';
  };

  const upload = async (files) => {
    if (!files.length) {
      return;
    }
    setErrors([]);
    setLoading(true);
    setTotal(files.length);
    setUploadProgress(0);
    progressMap.current = {};

    const results = await Promise.allSettled(
      Array.from(files).map((file) => {
        const imageUrls = uploadFile({
          file,
          onUploadProgress: (progressEvent) => {
            setUploadProgress(
              (progressEvent.loaded / progressEvent.total) * 100
            );
          },
        });
        return imageUrls;
      })
    );

    const newUrls = [];
    const errors = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        newUrls.push(result.value);
      } else if (result.status === 'rejected') {
        errors.push(result.reason);
      }
    });

    if (errors.length > 0) {
      setErrors(errors);
    }

    setLoading(false);

    if (newUrls.length > 0) {
      // flatten array of arrays to make one urls array of image strings
      return newUrls.flat(1);
    }
  };

  return {
    loading,
    errors,
    upload,
    uploadProgress,
    total,
  };
}
