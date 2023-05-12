import React, { useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProductLinks } from '@/features/product/slice';
import LabeledInput from '@/components/LabeledInput';
import GenericModal from '@/components/GenericModal';
import SectionHeader from '@/components/SectionHeader';
import CloseIcon from '@/static/assets/close-icon.svg';
import { productLinkSchema } from '@/features/product/helpers/product-links';
import './styles.styl';

const MODAL_STATUS = { CLOSED: false, EDIT: 'edit', CREATE: 'create' };
const initialLink = { url: '', title: '' };

export default function CampaignLinks() {
  const dispatch = useDispatch();
  const { form } = useSelector(({ product }) => product);
  const [showModal, setShowModal] = useState(MODAL_STATUS.CLOSED);
  const [productLink, setProductLink] = useState(initialLink);
  const error = useRef(null);
  // remove the current campaignLink to help avoiding repetition when saving.
  // this is also used as the dispatched value when removing a campaignLink.
  const filteredProductLinks = useMemo(() => {
    return form.productLinks
      ? form.productLinks.filter((_, i) => i !== productLink.index)
      : [];
  }, [form.productLinks, productLink]);

  const saveDisabled = !!(error.current || productLink.url === '');

  const validate = (campaignLink) => {
    try {
      productLinkSchema.validateSync(campaignLink);
      error.current = null;
      return true;
    } catch (e) {
      error.current = e.message;
      return false;
    }
  };

  // get a handler for the onChange props. key: 'title' | 'url'
  const getHandleCampaignLinkChange = (key) => (value) => {
    setProductLink((pl) => {
      const link = { ...pl, [key]: value };
      // validate the new campaign link and show error / disable save button
      validate(link);
      return link;
    });
  };

  const handleCloseModal = () => {
    error.current = null;
    setProductLink(initialLink);
    setShowModal(MODAL_STATUS.CLOSED);
  };

  return (
    <div className='section' id='campaign-links'>
      <SectionHeader title='Campaign links' />
      <p className='builder-description caption-1'>
        Add links that you would like to display to users on the first screen of
        the campaign. Common examples include links to campaign Terms &
        Conditions, Privacy Policies and customer support.
      </p>
      {form.productLinks?.length > 0 && (
        <div className='links'>
          {form.productLinks.map(({ url, title }, index) => (
            <div
              key={url}
              className='campaign-link'
              onClick={() => {
                setProductLink({ index, url, title });
                setShowModal(MODAL_STATUS.EDIT);
              }}
            >
              <p className='caption-2-medium url'>{url}</p>
              <h2 className='base-1-semibold name'>{title}</h2>
            </div>
          ))}
        </div>
      )}
      <button
        className='btn secondary builder-button'
        onClick={() => setShowModal(MODAL_STATUS.CREATE)}
        type='button'
      >
        Add a campaign link
      </button>
      <GenericModal open={Boolean(showModal)} handleClose={handleCloseModal}>
        <div className='section modal-section'>
          <div className='header'>
            <SectionHeader title='Campaign link' />
            <button
              className='btn secondary close'
              onClick={handleCloseModal}
              type='button'
            >
              <img src={CloseIcon} />
            </button>
          </div>
          <hr />
          <p className='body-1-medium'>
            Enter the web link and name (e.g. Terms & Conditions) for your link.
          </p>

          <div className='inputs'>
            <LabeledInput
              label='Link'
              placeholder='https://www...'
              value={productLink.url}
              onChange={getHandleCampaignLinkChange('url')}
            />
            <LabeledInput
              label='Name'
              placeholder='e.g. Terms & Conditions'
              value={productLink.title}
              onChange={getHandleCampaignLinkChange('title')}
            />
            {error?.current && <p className='error'>{error.current}</p>}
          </div>
          <div className='actions'>
            {showModal === MODAL_STATUS.EDIT && (
              <button
                className='btn danger delete'
                onClick={() => {
                  dispatch(setProductLinks([...filteredProductLinks]));
                  handleCloseModal();
                }}
                type='button'
              >
                Delete link
              </button>
            )}
            <button
              className='btn btn-primary save'
              onClick={() => {
                let links =
                  form.productLinks?.length > 0 ? [...form.productLinks] : [];

                if (productLink.index >= 0) {
                  links[productLink.index] = {
                    title: productLink.title,
                    url: productLink.url,
                  };
                } else {
                  links.push({
                    title: productLink.title,
                    url: productLink.url,
                  });
                }

                dispatch(setProductLinks(links));
                handleCloseModal();
              }}
              type='button'
              disabled={saveDisabled}
            >
              Save
            </button>
          </div>
        </div>
      </GenericModal>
    </div>
  );
}
