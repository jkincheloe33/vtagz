import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import { setLegal } from '@/features/product/slice';
import Switch from '@/components/Switch';
import SectionHeader from '@/components/SectionHeader';

const modules = {
  toolbar: [['bold', 'italic', 'underline', 'link', { list: 'bullet' }]],
};

export default function Legal() {
  const dispatch = useDispatch();
  const form = useSelector((store) => store.product.form);

  return (
    <div className='section'>
      <SectionHeader title='Legal' />
      <p className='builder-description caption-1'>
        Disclaimers can be added to your campaign and displayed to users when
        they first enter the campaign.
      </p>
      <Switch
        label='Show a disclaimer to users'
        status={Boolean(form?.legal?.visible)}
        onChange={() =>
          dispatch(
            setLegal({ visible: !form?.legal?.visible, disclaimer: null })
          )
        }
      />
      {form?.legal?.visible && (
        <>
          <hr />
          <label htmlFor='disclaimer' className='builder-label base-2'>
            Disclaimer
          </label>
          <ReactQuill
            bounds='.quill'
            modules={modules}
            onChange={(value, _, source) => {
              source === 'user' &&
                dispatch(setLegal({ visible: true, disclaimer: value }));
            }}
            placeholder='Enter your placeholder here'
            theme='snow'
            value={form.legal.disclaimer || ''}
          />
        </>
      )}
    </div>
  );
}
