import { branchAdminRoleName } from '../../Components/constants/Constants';

export const addEmployeeIntialValues = (profileData, roleData) => {
    return {
        proficPic: '',
        employeeName: '',
        employeeCode: '',
        branchName: '',
        email: '',
        gender: '',
        state: '',
        phoneNumber: '',
        address: '',
        city: '',
        pinCode: '',
        employeeDepartmentId: '',
        dob: '',
        joiningDate: '',
        roleType: '',
        branchId:
            roleData?.roleName === branchAdminRoleName
                ? { value: profileData?.branchId, _id: profileData?.branchId, label: profileData?.branchId }
                : ''
    };
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
export const PrepareEditEmployeeObj = (values, branchList, roleList, empDepartmentList, roleData, profileData) => {
    const obj = {
        ...values,
        gender: genderList.find((i) => i.name === values.gender),
        branchId:
            roleData?.roleName === branchAdminRoleName
                ? { value: profileData?.branchId, _id: profileData?.branchId, label: profileData?.branchId }
                : branchList.find((i) => i._id === values.branchId),
        roleType: roleList.find((i) => i._id === values.roleType),
        employeeDepartmentId: empDepartmentList.find((i) => i._id === values.employeeDepartmentId),
        state: indianStatesWithId.find((i) => i.id === +values.state)
    };

    return obj;
};

export const genderList = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' },
    { id: 3, name: 'Other' }
];
