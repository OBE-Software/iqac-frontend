import * as yup from 'yup';

export const AddTestCategorySchema = yup.object({
    testCategoryName: yup.string().required('testCategoryName is required')
});
