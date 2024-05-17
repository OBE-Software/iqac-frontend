import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import ActionsTable from '../../Components/Common/ActionsTable';
import DepartmentTableHeader from './DepartmentTableHeader';
import { useSelector } from 'react-redux';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import { addEmpDepartmentIntialValues } from '../EmployeeDepartment/EmployeeDepartmentUtils';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import {
    DeleteEmpDepartmentAPI,
    GetAllEmpDepartmentAPI,
    UpdateEmpDepartmentAPI,
    getAllCollegesAPI,
    getAllDepartmentsAPI,
    updateDepartmentAPI
} from '../../helpers/APIs/CommonAPIs';
import { departmentSchema, employeeDepartmentSchema } from '../../common/data/TableSchema';
import { DataKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { callAPIAction } from '../../Store/callAPI/actions';
import { getDeleteEmpDepartmentURL, getUpdateEmpDepartmentURL, updateDepartmentAPIURL } from '../../helpers/APIs/CustomURL';
import AddDepartment from './AddDepartment';
import { addDepartmentIntialValues } from './departmentUtils';

const Department = () => {
    const [departments, setAllDepartments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [rowsPerPage, setrowsPerPage] = useState(10);
    const [getAllColleges, setAllColleges] = useState([]);

    const [formIntialValues, setFormIntialValues] = useState({ ...addEmpDepartmentIntialValues });
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));
    const permissionData =
        profileData?.permissionData && profileData.permissionData.find((item) => item.module.toLowerCase() === 'employee department');

    const GetAllDepartmentsAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, getAllDepartmentsAPI));
    // const DeleteEmpDepartmentAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, DeleteEmpDepartmentAPI));
    const UpdateDepartmentsAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, updateDepartmentAPI));
    const GetAllCollegesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, getAllCollegesAPI));

    useEffect(() => {
        callAPIAction(getAllDepartmentsAPI);
    }, []);

    useEffect(() => {
        if (GetAllDepartmentsAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllDepartmentsAPIData?.[DataKey]?.data?.map((item) => {
                return {
                    ...item,
                    slno: 1
                };
            });
            // console.log('iiiiiiiiiiiii', data.data);
            setAllDepartments(data);
        } else {
            setAllDepartments([]);
        }
    }, [GetAllDepartmentsAPIData]);

    const handlePageChange = (p, rowsPerPage) => {
        const queryParams = {
            page: p,
            pageSize: rowsPerPage
        };
        callAPIAction(getAllDepartmentsAPI, null, null, queryParams);
    };
    const handleActionClick = (cell, row, index, actionType) => {
        if (actionType === 'delete') {
            callAPIAction(DeleteEmpDepartmentAPI, getDeleteEmpDepartmentURL(row.original._id));
        } else if (actionType === 'edit') {
            setIsEditMode(true);
            setShowModal(true);
            const obj = {
                ...row.original
            };

            setFormIntialValues(obj);
        }
    };

    const handleSwitch = (e, row) => {
        callAPIAction(updateDepartmentAPI, updateDepartmentAPIURL(row.original._id), {
            ...row.original,
            status: row.original.status === 1 ? 2 : 1
        });
    };

    const handleSelectedData = (data) => {
        const rowData = [];

        Object.keys(data).map((item) => {
            rowData.push(departments[item]);
        });
        setSelectedData(rowData);
    };

    const handleAddDepartment = () => {
        setShowModal(true);
    };

    const handleCancel = () => {
        setShowModal(false);
        setIsEditMode(false);
        setFormIntialValues({ ...addDepartmentIntialValues });
    };

    useEffect(() => {
        const queryParams = {
            page: pageNumber,
            pageSize: rowsPerPage
        };
        callAPIAction(getAllCollegesAPI, null, null, queryParams);
    }, []);

    useEffect(() => {
        if (GetAllCollegesAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllCollegesAPIData?.[DataKey]?.data;
            setAllColleges(data);
            // console.log(data);
        } else {
            setAllColleges([]);
        }
    }, [GetAllCollegesAPIData]);

    return (
        <div className="p-5">
            <Container fluid className="p-0">
                <h4 className="mt-3">Department</h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Department',
                            isLink: false
                        }
                    ]}
                    rightContainer={() => (
                        <button className="btn btn-soft-primary btn-sm d-flex align-items-center fw-bold" onClick={handleAddDepartment}>
                            <i class="ri-add-fill fs-16 fw-bold"></i>Add Department
                        </button>
                    )}
                />
                <ActionsTable
                    tabelID="orgUsersTable"
                    cardHeader={() => <DepartmentTableHeader selectedData={selectedData} />}
                    // cardTitle="Service States and LOB"
                    columns={departmentSchema}
                    data={departments}
                    allDataObj={GetAllDepartmentsAPIData?.[DataKey]}
                    loading={GetAllDepartmentsAPIData?.[FetchingKey]}
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
                    handleSwith={handleSwitch}
                    // isActionEdit={profileData.roleData === 1 ? true : permissionData.actions.edit}
                    isActionEdit={true}
                />
                {showModal && (
                    <AddDepartment
                        onCloseClick={handleCancel}
                        formValues={formIntialValues}
                        isEditMode={isEditMode}
                        pageNumber={pageNumber}
                        rowsPerPage={rowsPerPage}
                        collegeList={getAllColleges}
                    />
                )}
            </Container>
        </div>
    );
};

export default Department;
