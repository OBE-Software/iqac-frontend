import * as yup from 'yup';

export const AddtestCategorySchema = yup.object({
    testName: yup.string().required('required'),
    testID: yup.string().required('required'),
    testAmount: yup.string().required('required'),
    testCategory: yup.object().required('required'),
    departmentName: yup.object().required('required'),
    testSamples: yup.array().required('required')
});
