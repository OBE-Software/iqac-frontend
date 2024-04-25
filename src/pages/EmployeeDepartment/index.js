import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import ActionsTable from '../../Components/Common/ActionsTable';
import { employeeDepartmentSchema } from '../../common/data/TableSchema';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { DeleteEmpDepartmentAPI, GetAllEmpDepartmentAPI, UpdateEmpDepartmentAPI } from '../../helpers/APIs/CommonAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import AddEmployeeDepartment from './AddEmployeeDepartment';
import { addEmpDepartmentIntialValues } from './EmployeeDepartmentUtils';
import { getDeleteEmpDepartmentURL, getUpdateEmpDepartmentURL } from '../../helpers/APIs/CustomURL';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import EmployeeDepartmentTableHeader from './EmployeeDepartmentTableHeader';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';

const EmployeeDepartment = () => {
    const [branches, setAllBranches] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsMode] = useState(false);
    const [selectedData, setSelectedData] = useState([]);

    const [formIntialValues, setFormIntialValues] = useState({ ...addEmpDepartmentIntialValues });
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));
    const permissionData =
        profileData?.permissionData && profileData.permissionData.find((item) => item.module.toLowerCase() === 'employee department');

    const GetAllEmpDepartmentAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllEmpDepartmentAPI));
    const DeleteEmpDepartmentAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, DeleteEmpDepartmentAPI));
    const UpdateEmpDepartmentAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateEmpDepartmentAPI));

    useEffect(() => {
        callAPIAction(GetAllEmpDepartmentAPI);
    }, []);

    useEffect(() => {
        if (GetAllEmpDepartmentAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllEmpDepartmentAPIData?.[DataKey]?.data.map((item) => {
                return {
                    ...item,
                    slno: 1
                };
            });
            setAllBranches(data);
        } else {
            setAllBranches([]);
        }
    }, [GetAllEmpDepartmentAPIData]);

    useEffect(() => {
        if (DeleteEmpDepartmentAPIData?.[DataKey]?.isSuccess) {
            toast.success('Employee Department Deleted Successfully');
            removeAPIDataAction('DeleteEmpDepartmentAPI');
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            callAPIAction(GetAllEmpDepartmentAPI, null, null, queryParams);
        } else if (DeleteEmpDepartmentAPIData?.[ErrorKey] && !DeleteEmpDepartmentAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(DeleteEmpDepartmentAPIData, 'DeleteEmpDepartmentAPI');
        }
    }, [DeleteEmpDepartmentAPIData]);

    useEffect(() => {
        if (UpdateEmpDepartmentAPIData?.[DataKey]?.isSuccess) {
            toast.success('Employee Department Updated Successfully');
            removeAPIDataAction('UpdateEmpDepartmentAPI');
            callAPIAction(GetAllEmpDepartmentAPI);
        } else if (UpdateEmpDepartmentAPIData?.[ErrorKey] && !UpdateEmpDepartmentAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateEmpDepartmentAPIData, 'UpdateEmpDepartmentAPI');
        }
    }, [UpdateEmpDepartmentAPIData]);

    const handleAddBranch = () => {
        setShowModal(true);
    };
    const handleCancel = () => {
        setShowModal(false);
    };
    const handlePageChange = (p, rowsPerPage) => {
        const queryParams = {
            page: p,
            pageSize: rowsPerPage
        };
        callAPIAction(GetAllEmpDepartmentAPI, null, null, queryParams);
    };
    const handleActionClick = (cell, row, index, actionType) => {
        if (actionType === 'delete') {
            callAPIAction(DeleteEmpDepartmentAPI, getDeleteEmpDepartmentURL(row.original._id));
        } else if (actionType === 'edit') {
            setIsMode(true);
            setShowModal(true);
            const obj = {
                ...row.original
            };

            setFormIntialValues(obj);
        }
    };

    const handleSwith = (e, row) => {
        callAPIAction(UpdateEmpDepartmentAPI, getUpdateEmpDepartmentURL(row.original._id), {
            ...row.original,
            status: row.original.status === 1 ? 2 : 1
        });
    };

    const handleSelectedData = (data) => {
        const rowData = [];

        Object.keys(data).map((item) => {
            rowData.push(branches[item]);
        });
        setSelectedData(rowData);
    };

    return (
        <div className="p-5">
            <Container fluid className="p-0">
                <h4 className="mt-3">Employee Department</h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Employee Department',
                            isLink: false
                        }
                    ]}
                    rightContainer={() =>
                        (profileData.roleData === 1 || permissionData.actions.create === 1) && (
                            <button className="btn btn-soft-primary btn-sm d-flex align-items-center fw-bold" onClick={handleAddBranch}>
                                <i class="ri-add-fill fs-16 fw-bold"></i>Add Department
                            </button>
                        )
                    }
                />
                <ActionsTable
                    tabelID="orgUsersTable"
                    cardHeader={() => <EmployeeDepartmentTableHeader selectedData={selectedData} branchesData={branches} />}
                    // cardTitle="Service States and LOB"
                    columns={employeeDepartmentSchema}
                    data={branches}
                    allDataObj={GetAllEmpDepartmentAPIData?.[DataKey]}
                    loading={GetAllEmpDepartmentAPIData?.[FetchingKey]}
                    customPageSize={10}
                    // handleSearch={handleSearch}
                    divClass="table-responsive table-card"
                    tableClass="table table-borderless table-centered align-middle"
                    theadClass="default-table-header text-muted"
                    onPageChange={(p, rowsPerPage) => handlePageChange(p, rowsPerPage)}
                    emptyMessage={'no records found'}
                    tableLoader
                    showSelectAllOption={true}
                    handleSelectedData={handleSelectedData}
                    handleActionClick={handleActionClick}
                    handleSwith={handleSwith}
                    isActionEdit={profileData.roleData === 1 ? true : permissionData.actions.edit}
                />
            </Container>
            {showModal && <AddEmployeeDepartment formValues={formIntialValues} isEditMode={isEditMode} onCloseClick={handleCancel} />}
        </div>
    );
};

export default EmployeeDepartment;