import * as yup from 'yup';

export const notificationSchema = yup.object({
    notificationType: yup.object().required('required'),
    notificationTitle: yup.string().required('required'),
    notificationDataLabel: yup.string().required('required'),
    notificationBody: yup.string().required('required'),
    userType: yup.object().required('required'),
    notificationLink: yup.string().required('required'),
    photos: yup.string()
});
