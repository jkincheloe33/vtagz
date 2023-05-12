import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SectionHeader from '@/components/SectionHeader';
import ImageIcon from '@/static/assets/image-icon.svg';
import DiscountIcon from '@/static/assets/discount-icon.svg';
import UrlIcon from '@/static/assets/url-icon.svg';
import LockIcon from '@/static/assets/lock-icon.svg';
import DollarIcon from '@/static/assets/dollar-icon.svg';
import BarcodeIcon from '@/static/assets/barcode-icon.svg';
import './create-campaign.styl';

const ICONS = {
  IMAGE: ImageIcon,
  DISCOUNT: DiscountIcon,
  URL: UrlIcon,
  LOCK: LockIcon,
  DOLLAR: DollarIcon,
  BARCODE: BarcodeIcon,
};
const BADGES = {
  NEW: 'new',
  POPULAR: 'popular',
};

export default function CreateCampaign() {
  return (
    <div className='section' id='create-campaign'>
      <SectionHeader color='blue' title='Create your first campaign on VTAGZ' />
      <p className='body-1-medium'>Need some ideas for your first campaign?</p>
      <div className='ideas'>
        <IconAndText
          icon={ICONS.DOLLAR}
          text='Cashback rebates'
          badge={BADGES.NEW}
        />
        <IconAndText
          icon={ICONS.DISCOUNT}
          text='Discount codes'
          badge={BADGES.POPULAR}
        />
        <IconAndText icon={ICONS.URL} text='URLs' />
        <IconAndText icon={ICONS.BARCODE} text='Barcodes' />
        <IconAndText icon={ICONS.IMAGE} text='Images' />
        <IconAndText icon={ICONS.LOCK} text='...more soon' />
      </div>
      <Link to='/campaigns/create' className='btn primary'>
        Create a campaign
      </Link>
    </div>
  );
}

function IconAndText({ icon, text, badge }) {
  return (
    <div className='icon-and-text'>
      <div className='icon'>
        <img src={icon} />
      </div>
      <div className='text-and-badge'>
        <p className='base-1-semibold'>{text}</p>
        {badge && <div className={`badge badge-${badge}`}>{badge}</div>}
      </div>
    </div>
  );
}

IconAndText.propTypes = {
  icon: PropTypes.oneOf(Object.values(ICONS)).isRequired,
  text: PropTypes.string.isRequired,
  badge: PropTypes.oneOf(Object.values(BADGES)),
};
