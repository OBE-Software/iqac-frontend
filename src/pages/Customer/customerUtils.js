export const addCustomerIntialValues = {
    fullName: '',
    age: '',
    gender: '',
    dob: '',
    area: '',
    city: '',
    area: '',
    mobile: '',
    email: '',
    designation: '',
    patientType: '',
    branchId: ''
};
export const bookTestIntialValues = (isSuperAdmin, profileData, allTests) => {
    return {
        tests: [],
        patient: '',
        bookedOn: '',
        address: '',
        testFor: 'no',
        bookingType: '',
        paymentType: '',
        employeeId: '',
        branchId: isSuperAdmin ? '' : allTests?.find((i) => i._id === profileData?.branchId)
    };
};

export const GenderList = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' },
    { id: 3, name: 'Other' }
];

export const patientTypeList = [
    { id: 1, name: 'IP' },
    { id: 2, name: 'OP' }
];

export const CustomerType = [
    { id: 1, name: 'Lead' },
    { id: 2, name: 'Patient' }
];

export const RelationTypeList = [
    { id: 1, name: 'Father' },
    { id: 2, name: 'Mother' },
    { id: 3, name: 'Brother' }
];

export const checkIsCustomerDataCanView = (customerData) => {
    return customerData.age && customerData.email && customerData.mobile && customerData.fullName && customerData.gender;
};
