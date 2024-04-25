import React, { useEffect, useState } from 'react';
import ActionsTable from '../../Components/Common/ActionsTable';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { Container } from 'reactstrap';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import {
    GetAllEmpDepartmentAPI,
    GetAllEmployeeAPI,
    GetAllRolesAPI,
    GetBranchEmployeesByBranchId,
    GetBranchRolesAPI,
    UpdateRoleAPI,
    putPermissionManagementAPI
} from '../../helpers/APIs/CommonAPIs';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { useSelector } from 'react-redux';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { PermissionRoleSchema, PermissionemployeeSchema } from '../../common/data/TableSchema';
import AddPermission from './AddPermission';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import { branchAdminRoleName } from '../../Components/constants/Constants';
import { getBranchEmployeesByBranchIdURL, getBranchRolesURL, getUpdateRoleURL } from '../../helpers/APIs/CustomURL';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';

const Permission = () => {
    const [employees, setAllEmployees] = useState([]);
    const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);
    const [data, setData] = useState('');
    const [roles, setRoles] = useState([]);
    const [empDepartmentList, setEmpDepartmentList] = useState([]);

    const GetAllRolesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllRolesAPI));

    const GetBranchRolesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetBranchRolesAPI));
    const GetAllEmpDeparmentAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllEmpDepartmentAPI));
    const UpdateRoleAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateRoleAPI));

    const GetAllEmployeeAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllEmployeeAPI));

    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));
    const GetBranchEmployeesByBranchIdData = useSelector((state) => SelectFullStateOfThisAPI(state, GetBranchEmployeesByBranchId));

    useEffect(() => {
        const queryParams = {
            page: 1,
            pageSize: 10
        };
        callAPIAction(GetAllEmpDepartmentAPI);

        roleData !== 1
            ? callAPIAction(GetBranchRolesAPI, getBranchRolesURL(profileData?.branchId), null, queryParams)
            : callAPIAction(GetAllRolesAPI, null, null, queryParams);
    }, []);

    useEffect(() => {
        if ((GetAllRolesAPIData?.[DataKey]?.isSuccess || GetBranchRolesAPIData?.[DataKey]?.isSuccess) && empDepartmentList?.length > 0) {
            const data =
                roleData !== 1
                    ? GetBranchRolesAPIData?.[DataKey]?.data.map((item) => {
                          return {
                              ...item,
                              employeeDepartmentName: empDepartmentList?.find((i) => i._id === item.employeeDepartmentId)
                                  ?.employeeDepartmentName
                          };
                      })
                    : GetAllRolesAPIData?.[DataKey]?.data.map((item) => {
                          return {
                              ...item,
                              employeeDepartmentName: empDepartmentList?.find((i) => i._id === item.employeeDepartmentId)
                                  ?.employeeDepartmentName
                          };
                      });
            setRoles(data);
        } else {
            setRoles([]);
        }
    }, [GetAllRolesAPIData, empDepartmentList, GetBranchRolesAPIData]);

    useEffect(() => {
        if (GetAllEmpDeparmentAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllEmpDeparmentAPIData?.[DataKey]?.data.map((item) => {
                return {
                    ...item,
                    slno: 1
                };
            });
            setEmpDepartmentList(data);
        } else {
            setEmpDepartmentList([]);
        }
    }, [GetAllEmpDeparmentAPIData]);

    useEffect(() => {
        if (UpdateRoleAPIData?.[DataKey]?.isSuccess) {
            toast.success('Role Updated Successfully');
            removeAPIDataAction('UpdateRoleAPI');
            callAPIAction(GetAllRolesAPI);
        } else if (UpdateRoleAPIData?.[ErrorKey] && !UpdateRoleAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateRoleAPIData, 'UpdateRoleAPI');
        }
    }, [UpdateRoleAPIData]);

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

    const handleSwith = (e, row) => {
        callAPIAction(UpdateRoleAPI, getUpdateRoleURL(row.original._id), {
            ...row.original,
            status: row.original.status === 1 ? 2 : 1
        });
    };
    const handlePageChange = (p, rowsPerPage) => {
        const queryParams = {
            page: p,
            pageSize: rowsPerPage
        };
        callAPIAction(GetAllRolesAPI, null, null, queryParams);
    };
    const handleActionClick = (cell, row, index, actionType) => {
        if (actionType === 'edit') {
            setData(row.original);
            setShowAddPermissionModal(true);
        }
    };

    const handleCancel = () => {
        setShowAddPermissionModal(false);
    };

    return (
        <div className="p-5 layout-container">
            <Container fluid className="p-0">
                <h4 className="my-3">Permission Management</h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Permissions',
                            isLink: false
                        }
                    ]}
                />
                <div className="mb-4">
                    <ActionsTable
                        data={roles ? roles : []}
                        tabelID="Permission table"
                        columns={PermissionRoleSchema}
                        allDataObj={GetAllRolesAPIData?.[DataKey]}
                        loading={GetAllRolesAPIData?.[FetchingKey]}
                        customPageSize={10}
                        divClass="table-responsive table-card ref-mgmt-table-ht"
                        tableClass="table table-borderless table-centered align-middle"
                        theadClass="default-table-header text-muted"
                        emptyMessage={'no records found'}
                        onPageChange={(p, rowsPerPage) => handlePageChange(p, rowsPerPage)}
                        tableLoader
                        handleActionClick={handleActionClick}
                        handleSwith={handleSwith}
                    />
                </div>
            </Container>

            {showAddPermissionModal && <AddPermission handleCancel={handleCancel} data={data} />}
        </div>
    );
};

export default Permission;
