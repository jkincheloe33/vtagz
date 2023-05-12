import * as Yup from 'yup';

// a schema of all the minimum required fields for campaign creation
// this should be used against an update object
export const coreSchema = Yup.object().shape({
  title: Yup.string().required(),
  description: Yup.string().required(),
  images: Yup.array().of(Yup.string().url()).min(1).required(),
  utility: Yup.object().required(), // reward creation requires an utility, otherwise an error is thrown
  quantity: Yup.number().positive().min(1).required(),
});

// export a helper for the create section of the builder.
const coreHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: coreSchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: coreSchema.validateSync.bind(coreSchema),
};

export default coreHelper;
