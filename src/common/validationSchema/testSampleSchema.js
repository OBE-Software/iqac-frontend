import * as yup from 'yup';

export const AddtestSampleSchema = yup.object({
    testSampleName: yup.string().required('testSampleName is required')
});
