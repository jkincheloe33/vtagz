import * as Yup from 'yup';
import { getAddress } from 'ethers';

export const gatedChainIdOptions = [
  { label: 'Ethereum', value: 1 },
  { label: 'Polygon', value: 137 },
  { label: 'Avalanche', value: 43114 },
];

export const blockchainSchema = Yup.object().shape({
  visible: Yup.boolean().default(false),
  gatedChainId: Yup.number()
    .nullable()
    .when('visible', (visible, field) => {
      return visible[0] === true
        ? field
            .required()
            .oneOf(gatedChainIdOptions?.map(({ value }) => value))
            .nonNullable()
        : field;
    }),
  gatedContractAddress: Yup.string()
    .nullable()
    .when('visible', (visible, field) => {
      return visible[0] === true
        ? field
            .required()
            .nonNullable()
            .test('ethers', (value) => {
              try {
                getAddress(value);
                return true;
              } catch (e) {
                return false;
              }
            })
        : field;
    }),
});

// export a helper for the blockchain section of the builder.
const blockchainHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: blockchainSchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: blockchainSchema.validateSync.bind(blockchainSchema),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the product slice
   * @returns a schematized object compliant with blockchainHelper.schema
   */
  toSchematized: (original) => {
    if (original?.gatedChainId) {
      return {
        visible: true,
        gatedChainId: original.gatedChainId,
        gatedContractAddress: original.gatedContractAddress,
      };
    }
    return {
      visible: false,
      gatedChainId: null,
      gatedContractAddress: null,
    };
  },
  /**
   * merge the proper updates to state.update and return a new state.update
   * @param blockchainInstance an object compliant with the blockchainHelper.schema
   * @param state the state from the product slice
   * @returns new state.update
   **/
  getStateUpdate: (blockchainInstance, state) => {
    const gated = {};
    if (
      blockchainInstance.gatedChainId === state.original.gatedChainId ||
      (!state.isEdit && !blockchainInstance.gatedChainId)
    ) {
      // if value is equal to original, we make sure we leave no previous value in update.
      // if value is null and we are on product create, it means we had set a value, so we need to remove that from update.
      delete state.update.gatedChainId;
    } else {
      gated.gatedChainId = blockchainInstance.gatedChainId;
    }

    if (
      blockchainInstance.gatedContractAddress ===
        state.original.gatedContractAddress ||
      (!state.isEdit && !blockchainInstance.gatedContractAddress)
    ) {
      delete state.update.gatedContractAddress;
    } else {
      gated.gatedContractAddress = blockchainInstance.gatedContractAddress
        ? getAddress(blockchainInstance.gatedContractAddress)
        : null;
    }

    return {
      ...state.update,
      ...gated,
    };
  },
};

export default blockchainHelper;
