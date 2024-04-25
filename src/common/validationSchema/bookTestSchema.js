import * as yup from 'yup';

export const bookTestSchema = yup.object({
    tests: yup.array().required('required').min(1, 'Atleat one time slot should be added.'),
    patient: yup.object().when('testFor', {
        is: (testFor) => testFor === 'no',
        then: yup.object().required('required')
    }),
    employeeId: yup.object().when('bookingType', {
        is: (bookingType) => bookingType?.id === 1,
        then: yup.object().required('required')
    }),
    bookedOn: yup.array().required('required'),
    address: yup.string().required('required'),
    bookingType: yup.object().required('required'),
    paymentType: yup.object().required('required'),
    branchId: yup.object().required('required')
});
export const addRelativeSchema = yup.object({
    fullName: yup.string().required('required'),
    gender: yup.object().required('required'),
    age: yup.number().required('required').min(1, 'required').max(100, 'required'),
    relationType: yup.object().required('required')
});
