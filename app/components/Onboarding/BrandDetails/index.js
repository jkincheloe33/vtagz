import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import NavigationBlocker from '@/components/NavigationBlocker';
import { modifyBrand } from '@/features/login/thunks';
import './styles.styl';

export default function BrandDetails() {
  const dispatch = useDispatch();
  const [referralDetails, setReferralDetails] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const submitDisabled = !size || !industry;
  const [block, setBlock] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setBlock(false);
    dispatch(modifyBrand({ industry, size, referralDetails }));
  };

  return (
    <>
      <form id='brand-details' onSubmit={handleSubmit}>
        <h1 className='heading-5'>Setup your brand</h1>
        <p className='caption-1'>Help us tailor the VTAGZ experience for you</p>
        <div className='label-tip'>
          <label htmlFor='industry'>What industry are you in?</label>
        </div>
        <select
          name='industry'
          id='industry'
          onChange={(e) => setIndustry(e.target.value)}
          value={industry}
        >
          <option value style={{ display: 'none' }}></option>
          {[
            'Alcohol/Tobacco',
            'Beauty',
            'Education',
            'Fashion Retail',
            'Fitness',
            'Food Products',
            'Healthcare',
            'Home Goods',
            'Household Products',
            'Media',
            'Parenting',
            'Pet',
            'Tech',
            'Travel',
            'Other',
          ].map((opt) => (
            <option key={opt} value={opt.toLowerCase()}>
              {opt}
            </option>
          ))}
        </select>
        <div className='label-tip'>
          <label htmlFor='size'>What’s your size?</label>
        </div>
        <select
          name='size'
          id='size'
          onChange={(e) => setSize(e.target.value)}
          value={size}
        >
          <option value style={{ display: 'none' }}></option>
          {[
            '1-5 employees',
            '5-25 employees',
            '25-50 employees',
            '50-100 employees',
            '200-500 employees',
            '500-1000 employees',
            '1000+ employees',
          ].map((opt) => (
            <option key={opt} value={opt.toLowerCase()}>
              {opt}
            </option>
          ))}
        </select>
        <div className='label-tip'>
          <label htmlFor='referral-details'>
            How did you hear about VTAGZ? (Optional)
          </label>
        </div>
        <input
          type='text'
          id='referral-details'
          name='referral-details'
          value={referralDetails}
          onChange={(e) => setReferralDetails(e.target.value)}
        />
        <button className='btn primary' disabled={submitDisabled} type='submit'>
          Continue
        </button>
      </form>
      <NavigationBlocker
        shouldBlock={block}
        message={
          'We have incomplete information for your brand. Do you want to leave?'
        }
      />
    </>
  );
}
