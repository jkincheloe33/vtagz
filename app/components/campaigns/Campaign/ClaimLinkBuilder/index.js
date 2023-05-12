import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { baseUrls } from '@/config';
import { selectProductById } from '@/features/products/slice';
import SectionHeader from '@/components/SectionHeader';
import Details from '../VariantBuilder/Details';
import ArrowBackward from '@/static/assets/arrow-backward.svg';
import CopyIcon from '@/components/icons/CopyIcon';
import ButtonWithStates from '@/components/ButtonWithStates';
import useQueryParams from '@/hooks/useQueryParams';
import './claim-link-builder.styl';

export default function ClaimLinkBuilder() {
  const history = useHistory();
  const { state } = useLocation();
  const { campaignId } = useQueryParams();
  const { claimToken } = useSelector((store) =>
    selectProductById(store, campaignId)
  );
  const [content, setContent] = useState(state?.claimLink?.content || '');
  const [platform, setPlatform] = useState(state?.claimLink?.platform || '');
  const [traffic, setTraffic] = useState(state?.claimLink?.traffic || '');
  const [audience, setAudience] = useState(state?.claimLink?.audience || '');
  const [copied, setCopied] = useState(false);

  const params = new URLSearchParams({
    token: claimToken,
    ...(content && { content: content.toLowerCase() }),
    ...(platform && { platform: platform.toLowerCase() }),
    ...(traffic && { traffic: traffic.toLowerCase() }),
    ...(audience && { audience: audience.toLowerCase() }),
  });

  const url = new URL(
    `${baseUrls[process.env.TARGET_ENV]}/claim?${params.toString()}`
  );

  return (
    <>
      <h1>Claim link</h1>
      <div id='claim-link-builder'>
        <form className='builder'>
          <div className='section'>
            <div className='header'>
              <SectionHeader title='Create a link' />
              <button
                className='btn secondary-alt small'
                type='button'
                onClick={() => history.goBack()}
              >
                <img src={ArrowBackward} />
                Back
              </button>
            </div>
            <div className='sub-section'>
              <label htmlFor='content' className='base-2'>
                Content
                <span className='caption-1-medium'>
                  e.g. gift-promotion, rebate-announcement etc.
                </span>
              </label>
              <input
                type='text'
                placeholder='Content'
                id='content'
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className='sub-section'>
              <label htmlFor='platform' className='base-2'>
                Platform
                <span className='caption-1-medium'>
                  e.g. newsletter, twitter, google, etc.
                </span>
              </label>
              <input
                type='text'
                placeholder='Platform'
                id='platform'
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              />
            </div>
            <div className='sub-section'>
              <label htmlFor='traffic' className='base-2'>
                Traffic
                <span className='caption-1-medium'>
                  e.g. organic, paid, etc.
                </span>
              </label>
              <input
                type='text'
                placeholder='Traffic'
                id='traffic'
                value={traffic}
                onChange={(e) => setTraffic(e.target.value)}
              />
            </div>
            <div className='sub-section'>
              <label htmlFor='audience' className='base-2'>
                Audience
                <span className='caption-1-medium'>
                  e.g. California, recent-purchases
                </span>
              </label>
              <input
                type='text'
                placeholder='Audience'
                id='audience'
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>
          </div>
        </form>
        <Details />
        <div className='builder-footer'>
          <p className='caption-1 url'>
            Generated tracking URL: {url && url.toString()}
          </p>
          <ButtonWithStates
            className='btn primary'
            disabled={!url}
            onClick={async () => {
              await navigator.clipboard.writeText(url.toString());
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            textSuccess={'Copied URL'}
            success={copied}
            loading={false}
            icon={<CopyIcon />}
            iconPosition='left'
          >
            Copy URL
          </ButtonWithStates>
        </div>
      </div>
    </>
  );
}
