/* eslint-disable quotes */
import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import ActionsTable from '../../Components/Common/ActionsTable';
import { employeeSchema } from '../../common/data/TableSchema';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import {
    DeleteBranchAPI,
    GetAllBranchesAPI,
    GetAllEmpDepartmentAPI,
    GetAllEmployeeAPI,
    GetAllRolesAPI,
    GetBranchEmployeesByBranchId,
    UpdateEmployeeAPI
} from '../../helpers/APIs/CommonAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { PrepareEditEmployeeObj, addEmployeeIntialValues, genderList } from './employeeUtils';
import { getBranchEmployeesByBranchIdURL, getDeleteBranchUrl, getUpdateEmployeeURL } from '../../helpers/APIs/CustomURL';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
// import BranchTableHeader from './BranchTableHeader';
import AddEmployee from './AddEmployee';
import { branchAdminRoleName } from '../../Components/constants/Constants';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import AddEmployeePermission from './AddEmployeePermission';
import EmployeeTableHeader from '../EmployeeRoles/EmployeeRoleHeader';
import EmployeeHeader from './EmployeeHeader';
const Employee = () => {
    const [employees, setAllEmployees] = useState([]);
    const [empDepartments, setEmpDepartments] = useState([]);
    const [roles, setRoles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsMode] = useState(false);
    const [branchList, setBranchList] = useState([]);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [data, setData] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [rowsPerPage, setrowsPerPage] = useState(10);
    const [selectedData, setSelectedData] = useState([]);

    // const [showButton, setShowButton] = useState(false);

    const GetAllEmployeeAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllEmployeeAPI));
    const GetAllBranchesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllBranchesAPI));
    const GetAllEmpDeparmentAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllEmpDepartmentAPI));
    const GetAllRolesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllRolesAPI));
    const UpdateEmployeeAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateEmployeeAPI));
    const GetBranchEmployeesByBranchIdData = useSelector((state) => SelectFullStateOfThisAPI(state, GetBranchEmployeesByBranchId));
    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));
    const permissionData =
        profileData?.permissionData && profileData.permissionData.find((item) => item.module.toLowerCase() === 'employees');

    const [formIntialValues, setFormIntialValues] = useState({ ...addEmployeeIntialValues(profileData, roleData) });

    const callAllEmployee = () => {
        const queryParams = {
            page: pageNumber,
            pageSize: rowsPerPage
        };
        callAPIAction(GetAllEmployeeAPI, null, null, queryParams);
    };
    useEffect(() => {
        callAllEmployee();
    }, []);

    useEffect(() => {
        const queryParams = {
            page: pageNumber,
            pageSize: rowsPerPage
        };
        roleData?.roleName === branchAdminRoleName
            ? callAPIAction(GetBranchEmployeesByBranchId, getBranchEmployeesByBranchIdURL(profileData?.branchId), null, queryParams)
            : callAllEmployee();
        roleData?.roleName !== branchAdminRoleName && callAPIAction(GetAllBranchesAPI);

        callAPIAction(GetAllRolesAPI);
        callAPIAction(GetAllEmpDepartmentAPI);
    }, []);

    useEffect(() => {
        if (GetAllEmpDeparmentAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllEmpDeparmentAPIData?.[DataKey]?.data.map((item) => {
                return {
                    ...item,
                    slno: 1
                };
            });
            setEmpDepartments(data);
        } else {
            setEmpDepartments([]);
        }
    }, [GetAllEmpDeparmentAPIData]);

    useEffect(() => {
        if (GetAllRolesAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllRolesAPIData?.[DataKey]?.data.map((item) => {
                return {
                    ...item,
                    slno: 1
                };
            });
            setRoles(data);
        } else {
            setRoles([]);
        }
    }, [GetAllRolesAPIData]);

    useEffect(() => {
        if (GetAllEmployeeAPIData?.[DataKey]?.isSuccess || GetBranchEmployeesByBranchIdData?.[DataKey]?.isSuccess) {
            const data =
                roleData?.roleName === branchAdminRoleName
                    ? GetBranchEmployeesByBranchIdData?.[DataKey]?.data.filter((i) => i.roleName !== branchAdminRoleName)
                    : GetAllEmployeeAPIData?.[DataKey]?.data;
            setAllEmployees(data);
        } else {
            setAllEmployees([]);
        }
    }, [GetAllEmployeeAPIData, GetBranchEmployeesByBranchIdData]);

    useEffect(() => {
        if (GetAllBranchesAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllBranchesAPIData?.[DataKey]?.data.map((item) => {
                return {
                    ...item,
                    slno: 1
                };
            });
            setBranchList(data);
        } else {
            setBranchList([]);
        }
    }, [GetAllBranchesAPIData]);

    useEffect(() => {
        if (UpdateEmployeeAPIData?.[DataKey]?.isSuccess && !isEditMode) {
            toast.success('Employee Updated Successfully');
            removeAPIDataAction('UpdateEmployeeAPI');

            const queryParams = {
                page: pageNumber,
                pageSize: rowsPerPage
            };
            roleData?.roleName === branchAdminRoleName
                ? callAPIAction(GetBranchEmployeesByBranchId, getBranchEmployeesByBranchIdURL(profileData?.branchId), null, queryParams)
                : callAllEmployee();
        } else if (UpdateEmployeeAPIData?.[ErrorKey] && !UpdateEmployeeAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateEmployeeAPIData, 'UpdateEmployeeAPI');
        }
    }, [UpdateEmployeeAPIData]);

    const handleAddBranch = () => {
        setShowModal(true);
    };
    const handleCancel = (label) => {
        if (label === 'addEmployee') {
            setShowModal(false);
            setIsMode(false);
            setFormIntialValues({ ...addEmployeeIntialValues });
        } else if (label === 'addPermissionEmployee') {
            setShowPermissionModal(false);
        }
    };
    const handleActionClick = (cell, row, index, actionType) => {
        if (actionType === 'delete') {
            callAPIAction(DeleteBranchAPI, getDeleteBranchUrl(row.original._id));
        } else if (actionType === 'edit') {
            setIsMode(true);
            setShowModal(true);
            setFormIntialValues(PrepareEditEmployeeObj(row?.original, branchList, roles, empDepartments, roleData, profileData));
        } else if (actionType === 'permission') {
            setShowPermissionModal(true);
            setData(row.original);
        }
    };

    const handlePageChange = (p, rows) => {
        setPageNumber(p);
        setrowsPerPage(rows);
        const queryParams = {
            page: p,
            pageSize: rows
        };
        roleData?.roleName === branchAdminRoleName
            ? callAPIAction(GetBranchEmployeesByBranchId, getBranchEmployeesByBranchIdURL(profileData?.branchId), null, queryParams)
            : callAllEmployee();
    };

    const handleSwith = (e, row) => {
        callAPIAction(UpdateEmployeeAPI, getUpdateEmployeeURL(row.original._id), {
            ...row.original,
            status: row.original.status === 1 ? 2 : 1
        });
    };

    const handleSelectedData = (data) => {
        const rowData = [];

        Object.keys(data).map((item) => {
            rowData.push(employees[item]);
        });
        setSelectedData(rowData);
    };

    return (
        <div className="p-5">
            <Container fluid className="p-0">
                <h4 className="mt-0">Employees</h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Employee',
                            isLink: false
                        }
                    ]}
                    rightContainer={() =>
                        (profileData.roleData === 1 || permissionData.actions.create === 1) && (
                            <button className="btn btn-soft-primary btn-sm d-flex align-items-center fw-bold" onClick={handleAddBranch}>
                                <i class="ri-add-fill fs-16 fw-bold"></i>Add Employee
                            </button>
                        )
                    }
                />
                <ActionsTable
                    cardHeader={() => <EmployeeHeader employessData={employees} selectedData={selectedData} />}
                    tabelID="orgUsersTable"
                    columns={employeeSchema}
                    data={employees?.length ? employees : []}
                    allDataObj={GetAllEmployeeAPIData?.[DataKey] || GetBranchEmployeesByBranchIdData?.[DataKey]}
                    loading={GetAllEmployeeAPIData?.[FetchingKey] || GetBranchEmployeesByBranchIdData?.[FetchingKey]}
                    customPageSize={10}
                    divClass="table-responsive table-card ref-mgmt-table-ht"
                    tableClass="table table-borderless table-centered align-middle"
                    theadClass="default-table-header text-muted"
                    onPageChange={(p, rowsPerPage) => {
                        handlePageChange(p, rowsPerPage);
                    }}
                    emptyMessage={'no records found'}
                    tableLoader
                    showSelectAllOption={true}
                    handleActionClick={handleActionClick}
                    handleSwith={handleSwith}
                    isActionEdit={profileData.roleData === 1 ? true : permissionData.actions.edit}
                />
            </Container>
            {showModal && (
                <AddEmployee
                    onCloseClick={() => handleCancel('addEmployee')}
                    formValues={formIntialValues}
                    branchList={branchList}
                    roleList={roles}
                    isEditMode={isEditMode}
                    empDepartmentList={empDepartments}
                    handleSwith={handleSwith}
                />
            )}

            {showPermissionModal && <AddEmployeePermission data={data} onCloseClick={() => handleCancel('addPermissionEmployee')} />}
        </div>
    );
};

export default Employee;
