import * as yup from 'yup';

export const AddBranchSchema = yup.object({
    centerId: yup.object().required('required'),
    branchName: yup.string().required('required'),
    email: yup.string().email().required('required'),
    phoneNumber: yup.string().required('required').max(10).min(10),
    address: yup.string().required('required'),
    pinCode: yup.string().required('required').max(6).min(6),
    city: yup.string().required('required'),
    state: yup.object().required('required')
});
