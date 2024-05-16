import * as yup from 'yup';

export const AddDepartmentSchema = {
    departmentName: yup.string().required('required'),
    collegeId: yup.string().required('required')
};
