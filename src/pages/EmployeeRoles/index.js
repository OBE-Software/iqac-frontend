import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import ActionsTable from '../../Components/Common/ActionsTable';
import { employeeRoleSchema } from '../../common/data/TableSchema';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { DeleteRoleAPI, GetAllEmpDepartmentAPI, GetAllRolesAPI, GetBranchRolesAPI, UpdateRoleAPI } from '../../helpers/APIs/CommonAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import AddEmpRole from './AddEmployeeRole';
import { addEmpRoleIntialValues } from './employeeRoleUtils';
import { getBranchRolesURL, getDeleteRoleURL, getUpdateRoleURL } from '../../helpers/APIs/CustomURL';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import EmployeeTableHeader from './EmployeeRoleHeader';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';

const EmployeeRoles = () => {
    const [roles, setRoles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsMode] = useState(false);
    const [formIntialValues, setFormIntialValues] = useState({ ...addEmpRoleIntialValues });
    const [empDepartmentList, setEmpDepartmentList] = useState([]);
    const [selectedData, setSelectedData] = useState([]);

    const GetAllRolesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllRolesAPI));
    const GetBranchRolesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetBranchRolesAPI));

    const GetAllEmpDeparmentAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllEmpDepartmentAPI));
    const DeleteRoleAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, DeleteRoleAPI));
    const UpdateRoleAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateRoleAPI));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));
    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));

    const permissionData = profileData?.permissionData && profileData.permissionData.find((item) => item.module.toLowerCase() === 'roles');

    useEffect(() => {
        const queryParams = {
            page: 1,
            pageSize: 10
        };
        callAPIAction(GetAllEmpDepartmentAPI, null, null, queryParams);
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
        if (DeleteRoleAPIData?.[DataKey]?.isSuccess) {
            toast.success('Role Deleted Successfully');
            removeAPIDataAction('DeleteRoleAPI');
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            callAPIAction(GetAllRolesAPI, null, null, queryParams);
        } else if (DeleteRoleAPIData?.[ErrorKey] && !DeleteRoleAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(DeleteRoleAPIData, 'DeleteRoleAPI');
        }
    }, [DeleteRoleAPIData]);

    useEffect(() => {
        if (UpdateRoleAPIData?.[DataKey]?.isSuccess && !isEditMode) {
            toast.success('Role Updated Successfully');
            removeAPIDataAction('UpdateRoleAPI');
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            roleData !== 1
                ? callAPIAction(GetBranchRolesAPI, getBranchRolesURL(profileData?.branchId), null, queryParams)
                : callAPIAction(GetAllRolesAPI, null, null, queryParams);
        } else if (UpdateRoleAPIData?.[ErrorKey] && !UpdateRoleAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateRoleAPIData, 'UpdateRoleAPI');
        }
    }, [UpdateRoleAPIData]);

    const handleAddRole = () => {
        setShowModal(true);
    };
    const handleCancel = () => {
        setShowModal(false);
        setIsMode(false);
        setFormIntialValues({ ...addEmpRoleIntialValues });
    };

    const handlePageChange = (p, rowsPerPage) => {
        const queryParams = {
            page: p,
            pageSize: rowsPerPage
        };
        callAPIAction(GetAllRolesAPI, null, null, queryParams);
    };
    const handleActionClick = (cell, row, index, actionType) => {
        if (actionType === 'delete') {
            callAPIAction(DeleteRoleAPI, getDeleteRoleURL(row.original._id));
        } else if (actionType === 'edit') {
            setIsMode(true);
            setShowModal(true);
            const obj = {
                ...row.original,
                employeeDepartmentId: empDepartmentList.find((i) => i._id === row?.original?.employeeDepartmentId)
            };

            setFormIntialValues(obj);
        }
    };

    const handleSwith = (e, row) => {
        callAPIAction(UpdateRoleAPI, getUpdateRoleURL(row.original._id), {
            ...row.original,
            status: row.original.status === 1 ? 2 : 1
        });
    };

    const handleSelectedData = (data) => {
        const rowData = [];

        Object.keys(data).map((item) => {
            rowData.push(roles[item]);
        });
        setSelectedData(rowData);
    };
    return (
        <div className="p-5">
            <Container fluid className="p-0">
                <h4 className="mt-3">Roles</h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Roles',
                            isLink: false
                        }
                    ]}
                    rightContainer={() =>
                        (profileData.roleData === 1 || permissionData.actions.create === 1) && (
                            <button className="btn btn-soft-primary btn-sm d-flex align-items-center fw-bold" onClick={handleAddRole}>
                                <i class="ri-add-fill fs-16 fw-bold"></i>Add Role
                            </button>
                        )
                    }
                />
                <ActionsTable
                    cardHeader={() => <EmployeeTableHeader rolesData={roles} selectedData={selectedData} />}
                    tabelID="orgUsersTable"
                    columns={employeeRoleSchema}
                    data={roles ? roles : []}
                    allDataObj={GetAllRolesAPIData?.[DataKey]}
                    loading={GetAllRolesAPIData?.[FetchingKey]}
                    customPageSize={10}
                    divClass="table-responsive table-card"
                    tableClass="table table-borderless table-centered align-middle"
                    theadClass="default-table-header text-muted"
                    onPageChange={(p, rowsPerPage) => handlePageChange(p, rowsPerPage)}
                    emptyMessage={'no records found'}
                    tableLoader
                    showSelectAllOption={true}
                    handleActionClick={handleActionClick}
                    handleSwith={handleSwith}
                    handleSelectedData={handleSelectedData}
                    isActionEdit={profileData.roleData === 1 ? true : permissionData.actions.edit}
                />
            </Container>
            {showModal && (
                <AddEmpRole
                    onCloseClick={handleCancel}
                    formValues={formIntialValues}
                    isEditMode={isEditMode}
                    empDepartmentList={empDepartmentList}
                />
            )}
        </div>
    );
};

export default EmployeeRoles;
