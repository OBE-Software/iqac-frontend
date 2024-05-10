export const getDeleteBranchUrl = (id) => {
    return 'branch/delete/' + id;
};
export const getUpdateBranchUrl = (id) => {
    return 'branch/update/' + id;
};
export const getDeleteCenterURL = (id) => {
    return 'center/delete/' + id;
};
export const getUpdateCenterhURL = (id) => {
    return 'center/update/' + id;
};

export const getDeleteRoleURL = (id) => {
    return 'role/delete/' + id;
};

export const getUpdateRoleURL = (id) => {
    return 'role/update/' + id;
};

export const getUpdateEmpDepartmentURL = (id) => {
    return 'employee-department/update/' + id;
};

export const getDeleteEmpDepartmentURL = (id) => {
    return 'employee-department/delete/' + id;
};

export const getUpdateEmployeeURL = (id) => {
    return 'employee/update/' + id;
};

export const getDeleteTestURL = (id) => {
    return 'test/delete/' + id;
};
export const getUpdateTestURL = (id) => {
    return 'test/update/' + id;
};
export const getUpdateTestCategoryURL = (id) => {
    return 'test-category/update/' + id;
};
export const getDeleteTestCategoryURL = (id) => {
    return 'test-category/delete/' + id;
};
export const getUpdateTestDepartmentURL = (id) => {
    return 'test-department/update/' + id;
};
export const getDeleteTestDepartmentURL = (id) => {
    return 'test-department/delete/' + id;
};
export const getUpdateTestSampleURL = (id) => {
    return 'test-sample/update/' + id;
};
export const getDeleteTestTypeURL = (id) => {
    return 'test-type/delete/' + id;
};
export const getUpdateTestTypeURL = (id) => {
    return 'test-type/update/' + id;
};
export const getDeleteTestSampleURL = (id) => {
    return 'test-sample/delete/' + id;
};
export const getTestDetailsByIdURL = (id) => {
    return 'test/' + id;
};

export const getTestDescriptionIdURL = (id) => {
    return 'test/' + id;
};
export const getUpdateCustomerURL = (id) => {
    return 'patient/update/' + id;
};
export const getBookingDetailsByIdURL = (id) => {
    return 'orders/' + id;
};

export const getCustomerDetailsByIdURL = (id) => {
    return 'customers/' + id;
};

export const putPermissionModuleByEmployeeIdURL = (id) => {
    return 'permission/update/' + id;
};
export const getPaymentsURL = (branchId) => {
    return branchId ? 'payments/all/' + branchId : 'payments/all';
};
export const getBranchEmployeesByBranchIdURL = (branchId) => {
    return branchId ? 'employee/all/' + branchId : 'employee/all';
};
export const getBranchRolesURL = (branchId) => {
    return 'role/all/' + branchId;
};
export const getCustomerURL = (branchId) => {
    return false ? 'customers/all/' + branchId : 'customers/all';
};

export const getBranchRoleByBranchIDURL = (branchId) => {
    return branchId ? 'role/all' + branchId : 'role/all';
};
export const getOrdersURL = (branchId) => {
    return branchId ? 'orders/all/' + branchId : 'orders/all';
};
export const deleteTimeSlotIdURL = (dateID, timeSlotId) => {
    return 'slots/' + dateID + '/delete/' + timeSlotId;
};

export const GetDashboardOrdersAPIURL = (branchId) => {
    return branchId ? 'orders/dashboard/' + branchId : 'orders/dashboard';
};
export const getCustomerBookingsURL = (customerId) => {
    return 'orders/customer/all/' + customerId;
};
export const getCustomerRelativesByIdURL = (customerId) => {
    return 'customer/patient/' + customerId;
};

export const putPermissionModuleByRoleIdURL = (id) => {
    return 'role/update/' + id;
};
export const getGenralNotificationByBranchIdURL = (id) => {
    return 'generalNotifications/all/' + id;
};

export const getLogDetailsURL = (id) => {
    return 'logs/' + id;
};

export const updateUniversityAPIURL = (id) => {
    return 'universities/' + id + '/update';
};

export const getUniversityDetailsAPIURL = (id) => {
    return 'universities/' + id;
};
