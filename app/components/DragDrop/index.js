import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import ImgLoader from '@/components/ImgLoader';
import Loading from '@/components/Loading';
import useImageUploader from '@/hooks/useImageUploader';
import CloseIcon from '@/static/assets/close-icon.svg';
import UploadIcon from '@/static/assets/upload-icon.svg';
import { getImage } from '@/utils';
import './drag-drop.styl';

const accept = {
  'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
};

export default function DragDrop({
  imageUrls,
  // default as 0 means you can upload unlimited files
  maxFiles = 0,
  onUpload,
  onRemove,
}) {
  const { errors, loading, upload, uploadProgress } = useImageUploader();

  const onDrop = useCallback(
    (acceptedFiles) => {
      upload(acceptedFiles).then((urls) => onUpload(urls));
    },
    [upload, onUpload]
  );

  return (
    <>
      <div className='drag-drop'>
        {loading && (
          <div className='drag-drop-loading'>
            <Loading contain />
            <div className='drag-drop-progress-bar'>
              <div
                className='drag-drop-progress'
                style={{ transform: `translateX(${uploadProgress}%)` }}
              />
            </div>
          </div>
        )}
        {imageUrls?.length > 0 ? (
          <DragDropEdit
            imageUrls={imageUrls}
            loading={loading}
            maxFiles={maxFiles}
            onDrop={onDrop}
            removeUrl={(url) => {
              onRemove(url);
            }}
          />
        ) : (
          <DragDropNew loading={loading} maxFiles={maxFiles} onDrop={onDrop} />
        )}
      </div>
      {errors?.length > 0 && (
        <p id='drag-drop-error' className='error'>
          Image upload failed, please try again.
        </p>
      )}
    </>
  );
}

DragDrop.propTypes = {
  imageUrls: PropTypes.arrayOf(PropTypes.string),
  maxFiles: PropTypes.number,
  onUpload: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

function DragDropNew({ loading, maxFiles, onDrop }) {
  const { getRootProps, getInputProps } = useDropzone({
    accept,
    maxFiles,
    onDrop,
  });

  return (
    <div
      className={`drag-drop-upload ${loading ? 'loading' : ''}`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div className='drag-drop-cta'>
        <img alt='Upload icon' src={UploadIcon} />
        <p>Click or drop image{maxFiles === 0 && '(s)'}</p>
      </div>
    </div>
  );
}

const dragDropNewType = {
  loading: PropTypes.bool,
  maxFiles: PropTypes.number,
  onDrop: PropTypes.func.isRequired,
};

DragDropNew.propTypes = dragDropNewType;

function DragDropEdit({ imageUrls, loading, maxFiles, onDrop, removeUrl }) {
  const { getRootProps, getInputProps } = useDropzone({
    accept,
    maxFiles,
    onDrop,
  });
  const isSingle = imageUrls.length === 1;

  return (
    <>
      <div className='edit-images'>
        {imageUrls.map((url, i) => (
          <div
            className={`drag-drop-image-wrapper ${isSingle ? 'single' : ''}`}
            key={`edit-${url}-${i}`}
          >
            {!isSingle && (
              <div className='drag-drop-x' onClick={() => removeUrl(url)}>
                <img src={CloseIcon} />
              </div>
            )}
            <ImgLoader
              className='drag-drop-image'
              retry
              src={getImage(url, 256)}
            />
          </div>
        ))}
      </div>
      <div>
        <div
          className={`drag-drop-upload has-image ${loading ? 'loading' : ''}`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <p>
            {maxFiles === 1
              ? 'Upload a different image'
              : 'Upload another image'}
          </p>
        </div>
        {isSingle && (
          <button
            className='drag-drop-remove'
            onClick={() => removeUrl(imageUrls[0])}
          >
            Remove image
          </button>
        )}
      </div>
    </>
  );
}

DragDropEdit.propTypes = {
  ...dragDropNewType,
  imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  removeUrl: PropTypes.func,
};
