import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { JsonEditor } from 'jsoneditor-react';
import ace from 'brace';
import 'brace/mode/json';
import SectionHeader from '@/components/SectionHeader';
import Switch from '@/components/Switch';
import DragDrop from '@/components/DragDrop';
import {
  setWrapperImage,
  setClaimScreenStyling,
  setNftScreenStyling,
} from '@/features/product/slice';
import 'jsoneditor-react/es/editor.min.css';
import './styles.styl';

export default function Branding() {
  const dispatch = useDispatch();
  const { wrapperImage, claimScreenStyling, nftScreenStyling } = useSelector(
    (store) => store.product.form
  );

  const onRemoveWrapperImage = () => {
    dispatch(setWrapperImage({ ...wrapperImage, url: '' }));
  };

  const onUploadWrapperImage = useCallback(
    (urls) => dispatch(setWrapperImage({ visible: true, url: urls[0] })),
    [dispatch]
  );

  return (
    <div id='branding' className='section'>
      <SectionHeader title='Branding' badge='Beta' />
      <div className='wrapper-image'>
        <Switch
          label='Use a custom wrapper image'
          status={Boolean(wrapperImage?.visible)}
          onChange={() =>
            dispatch(
              setWrapperImage({
                visible: !wrapperImage?.visible,
                url: null,
              })
            )
          }
        />
        {wrapperImage?.visible && (
          <>
            <hr />
            <h3 className='base-2'>Wrapper image</h3>
            <DragDrop
              imageUrls={wrapperImage?.url ? [wrapperImage?.url] : []}
              maxFiles={1}
              onRemove={onRemoveWrapperImage}
              onUpload={onUploadWrapperImage}
            />
          </>
        )}
      </div>
      <div className='claim-screen'>
        <Switch
          label='Custom claim screen styling (JSON only)'
          status={Boolean(claimScreenStyling?.visible)}
          onChange={() =>
            dispatch(
              setClaimScreenStyling({
                visible: !claimScreenStyling?.visible,
                payload: null,
              })
            )
          }
        />
        {claimScreenStyling?.visible && (
          <>
            <hr />
            <h3 className='base-2'>Claim screen payload</h3>
            <JsonEditor
              mode={'code'}
              ace={ace}
              value={claimScreenStyling?.payload || {}}
              onChangeText={(payload) =>
                dispatch(setClaimScreenStyling({ visible: true, payload }))
              }
            />
          </>
        )}
      </div>
      <div className='nft-screen'>
        <Switch
          label='Custom NFT screen styling (JSON only)'
          status={Boolean(nftScreenStyling?.visible)}
          onChange={() =>
            dispatch(
              setNftScreenStyling({
                visible: !nftScreenStyling?.visible,
                payload: null,
              })
            )
          }
        />
        {nftScreenStyling?.visible && (
          <>
            <hr />
            <h3 className='base-2'>NFT screen payload</h3>
            <JsonEditor
              mode={'code'}
              ace={ace}
              value={nftScreenStyling?.payload || {}}
              onChangeText={(payload) =>
                dispatch(setNftScreenStyling({ visible: true, payload }))
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
