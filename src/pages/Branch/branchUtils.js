export const addBranchIntialValues = {
    centerId: '',
    branchName: '',
    email: '',
    state: '',
    phoneNumber: '',
    address: '',
    city: '',
    pinCode: ''
    // photos: ''
};
export const indianStatesWithId = [
    { id: 1, name: 'Andhra Pradesh' },
    { id: 2, name: 'Arunachal Pradesh' },
    { id: 3, name: 'Assam' },
    { id: 4, name: 'Bihar' },
    { id: 5, name: 'Chhattisgarh' },
    { id: 6, name: 'Goa' },
    { id: 7, name: 'Gujarat' },
    { id: 8, name: 'Haryana' },
    { id: 9, name: 'Himachal Pradesh' },
    { id: 10, name: 'Jharkhand' },
    { id: 11, name: 'Karnataka' },
    { id: 12, name: 'Kerala' },
    { id: 13, name: 'Madhya Pradesh' },
    { id: 14, name: 'Maharashtra' },
    { id: 15, name: 'Manipur' },
    { id: 16, name: 'Meghalaya' },
    { id: 17, name: 'Mizoram' },
    { id: 18, name: 'Nagaland' },
    { id: 19, name: 'Odisha' },
    { id: 20, name: 'Punjab' },
    { id: 21, name: 'Rajasthan' },
    { id: 22, name: 'Sikkim' },
    { id: 23, name: 'Tamil Nadu' },
    { id: 24, name: 'Telangana' },
    { id: 25, name: 'Tripura' },
    { id: 26, name: 'Uttar Pradesh' },
    { id: 27, name: 'Uttarakhand' },
    { id: 28, name: 'West Bengal' }
];
export const PrepareEditBranchObj = (values, centersList) => {
    const obj = {
        ...values,
        centerId: centersList.find((i) => i._id === values.centerId),
        state: indianStatesWithId.find((i) => i.id === +values.state)
    };

    return obj;
};
