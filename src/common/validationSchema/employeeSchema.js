import * as yup from 'yup';

export const AddEmployeeSchema = yup.object({
    employeeCode: yup.string().required('required'),
    employeeName: yup.string().required('required'),
    gender: yup.object().required('required'),
    email: yup.string().email().required('required'),
    phoneNumber: yup.string().required('required').max(10).min(10),
    state: yup.object().required('required'),
    city: yup.string().required('required'),
    employeeDepartmentId: yup.object().required('required'),
    address: yup.string().required('required'),
    // pinCode: yup.string().required('required').max(6).min(6),
    roleType: yup.object().required('required'),
    branchId: yup.object().required('required')
});
