import * as yup from 'yup';

export const AddtestTypeSchema = yup.object({
    testTypeName: yup.string().required('testTypeName is required')
});
