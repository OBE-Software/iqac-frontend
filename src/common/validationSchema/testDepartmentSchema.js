import * as yup from 'yup';

export const AddtestDepartmentSchema = yup.object({
    departmentName: yup.string().required('departmentName is required')
});
