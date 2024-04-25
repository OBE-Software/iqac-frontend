import * as yup from 'yup';

export const AddEmpDepartmentSchema = yup.object({
    employeeDepartmentName: yup.string().required('required'),
});
