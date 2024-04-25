import * as yup from 'yup';

export const AddCenterSchema = yup.object({
    centerName: yup.string().required('required'),
    firstName: yup.string().required('required'),
    lastName: yup.string().required('required'),
    gender: yup.object().required('required'),
    email: yup.string().email().required('required'),
    phoneNumber: yup.string().required('required').max(10).min(10),
    area: yup.string().required('required'),
    pinCode: yup.string().required('required').max(6).min(6),
    city: yup.string().required('required'),
    state: yup.object().required('required')
    // isHomeBranch: yup.object().required('required')
});
