import * as yup from 'yup';

export const AddDepartmentSchema = yup.object({
    departmentName: yup.string().required('required'),
    collegeId: yup.object().required('required')
});
