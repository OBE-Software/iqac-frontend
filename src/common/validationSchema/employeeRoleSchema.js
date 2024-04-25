import * as yup from 'yup';

export const AddRoleSchema = yup.object({
    roleName: yup.string().required('required'),
    employeeDepartmentId: yup.object().required('required')
});
