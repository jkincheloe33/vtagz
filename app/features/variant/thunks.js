import { createAsyncThunk } from '@reduxjs/toolkit';
import { selectProductById } from '@/features/products/slice';
import query from '@/queries';

export const getVariant = createAsyncThunk(
  'variant/get',
  async ({ id, productId }, thunkAPI) => {
    const { variant } = await query.getVariant({ id, productId });
    return variant;
  }
);

export const deactivateVariant = createAsyncThunk(
  'variant/deactivate',
  async ({ id, campaignId }, { getState }) => {
    if (!id) {
      throw new Error('a name is needed to deactivate a variant');
    }

    const { metadata, id: productId } = selectProductById(
      getState(),
      campaignId
    );

    // filter out the current variant name so that we can replace it in the variants array
    const otherVariants = metadata?.variants.filter((v) => v.name !== name);
    const variant = { ...getState().variant.original, disabled: true };

    const { deleteVariant } = await query.deleteVariant({
      productId,
      id,
    });

    if (!deleteVariant.variant) {
      throw new Error('Variant was not deactivated');
    }

    return { id: campaignId, variants: [...otherVariants, variant] };
  }
);

export const publishVariant = createAsyncThunk(
  'variant/publish',
  async ({ id, campaignId }, { getState }) => {
    const { metadata, id: productId } = selectProductById(
      getState(),
      campaignId
    );

    // filter out the current variant id so that we can replace it in the variants array
    const otherVariants = metadata?.variants.filter((v) => v.id !== id);
    let data = { ...getState().variant.update };

    if (id) {
      const { modifyVariant } = await query.modifyVariant({
        productId,
        id,
        data,
      });

      if (!modifyVariant.variant) {
        throw new Error('Variant was not modified');
      }

      data = modifyVariant.variant;
    } else {
      const { createVariant } = await query.createVariant({
        productId,
        data,
      });

      if (!createVariant.variant) {
        throw new Error('Variant was not created');
      }
      data = createVariant.variant;
    }

    // return entity so products store updates proper entry
    return { id: campaignId, variants: [...otherVariants, data] };
  }
);
