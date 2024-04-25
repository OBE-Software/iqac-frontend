import * as yup from 'yup';

export const singleDateslotSchema = yup.object({
    date: yup.array().required('required'),
    timeSlots: yup.array().required('Atleat one time slot should be added.').min(1, 'Atleat one time slot should be added.')
});

export const dateRangeTimeslotSchema = yup.object({
    date: yup.array().required('required'),
    timeSlots: yup.array().required('Atleat one time slot should be added.').min(1, 'Atleat one time slot should be added.'),
    duration: yup.object().required('required')
});
