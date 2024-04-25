import * as yup from 'yup';

export const AddCustomerSchema = yup.object({
    fullName: yup.string().required('required'),
    age: yup.string().required('required'),
    gender: yup.object().required('required'),
    dob: yup.array().required('required'),
    area: yup.string().required('required'),
    city: yup.string().required('required'),
    mobile: yup.string().required('required'),
    email: yup.string().email().required('required'),
    designation: yup.string().required('required'),
    patientType: yup.object().required('required'),
    branchId: yup.object().required('required')
    // isHomeBranch: yup.object().required('required')
});
