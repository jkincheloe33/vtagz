import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@/components/Tooltip';
import './file-upload.styl';

export default function FileUpload({
  id,
  label,
  name,
  onChange,
  onRemove,
  accept = '*',
  tooltip,
}) {
  const [file, setFile] = useState();
  const ref = useRef();

  return (
    <div className='file-upload'>
      <div className='tooltip-label'>
        <label htmlFor={id}>{label}</label>
        {tooltip && <Tooltip message={tooltip} />}
      </div>
      {file ? (
        <div className='sub-section'>
          <div className='uploaded-file'>
            <p className='caption-2-medium'>Uploaded file</p>
            <p className='base-1-semibold'>{file.name}</p>
          </div>
          <div className='actions'>
            <button
              className='btn secondary'
              type='button'
              onClick={() => ref.current?.click()}
            >
              Upload a different file
            </button>
            <button
              className='btn danger'
              type='button'
              onClick={() => {
                setFile(null);
                ref.current.value = '';
                onRemove();
              }}
            >
              Remove file
            </button>
          </div>
        </div>
      ) : (
        <button
          className='btn secondary'
          type='button'
          onClick={() => ref.current?.click()}
        >
          Upload a file
        </button>
      )}
      <input
        type='file'
        name={name}
        id={id}
        hidden
        onChange={() => {
          setFile(ref.current?.files?.[0]);
          onChange(ref.current?.files?.[0]);
        }}
        accept={accept}
        ref={ref}
      />
    </div>
  );
}

FileUpload.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  accept: PropTypes.string,
  tooltip: PropTypes.string,
};
