import * as yup from 'yup';

export const AddUniversitySchema = yup.object({
    universityName: yup.string().required('required'),
    address: yup.string().required('required'),
    city: yup.string().required('required'),
    state: yup.object().required('required'),
    country: yup.string().required('required'),
    countryCode: yup.string().required('required').min(3).max(5),
    phoneNumber: yup.string().required('required').min(10).max(10),
    email: yup.string().required('required')
});
