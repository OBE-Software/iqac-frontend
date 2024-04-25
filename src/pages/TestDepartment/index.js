import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import ActionsTable from '../../Components/Common/ActionsTable';
import { testDepartmentSchema } from '../../common/data/TableSchema';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { DeleteTestDepartmentAPI, GetAllTestDepartmentAPI, UpdateTestDepartmentAPI } from '../../helpers/APIs/CommonAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { addTestDepartmentIntialValues } from './testDepartmentUtils';
import { getDeleteTestDepartmentURL, getUpdateTestDepartmentURL } from '../../helpers/APIs/CustomURL';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import AddTestDepartment from './AddTestDepartment';
import TestDepartmentTableHeader from './TestDepartmentTableHeader';

const TestDepartment = () => {
    const [testDepartments, setTestDepartments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsMode] = useState(false);
    const [formIntialValues, setFormIntialValues] = useState({ ...addTestDepartmentIntialValues });
    const [selectedData, setSelectedData] = useState([]);

    const GetAllTestDepartmentAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllTestDepartmentAPI));
    const DeleteTestDepartmentAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, DeleteTestDepartmentAPI));
    const UpdateTestCategoryAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateTestDepartmentAPI));
    const [pageNumber, setPageNumber] = useState(1);
    const [rowsPerPage, setrowsPerPage] = useState(10);

    const callDepartments = () => {
        const queryParams = {
            page: pageNumber,
            pageSize: rowsPerPage
        };
        callAPIAction(GetAllTestDepartmentAPI, null, null, queryParams);
    };

    useEffect(() => {
        callDepartments();
    }, []);

    useEffect(() => {
        if (GetAllTestDepartmentAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllTestDepartmentAPIData?.[DataKey]?.data.map((item) => {
                return {
                    ...item,
                    slno: 1
                };
            });
            setTestDepartments(data);
        } else {
            setTestDepartments([]);
        }
    }, [GetAllTestDepartmentAPIData]);

    useEffect(() => {
        if (DeleteTestDepartmentAPIData?.[DataKey]?.isSuccess) {
            toast.success('Test Department Deleted Successfully');
            removeAPIDataAction('DeleteTestDepartmentAPI');
            callDepartments();
        } else if (DeleteTestDepartmentAPIData?.[ErrorKey] && !DeleteTestDepartmentAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(DeleteTestDepartmentAPIData, 'DeleteTestDepartmentAPI');
        }
    }, [DeleteTestDepartmentAPIData]);

    useEffect(() => {
        if (UpdateTestCategoryAPIData?.[DataKey]?.isSuccess && !isEditMode) {
            toast.success('Test Department Updated Successfully');
            removeAPIDataAction('UpdateTestDepartmentAPI');
            callDepartments();
        } else if (UpdateTestCategoryAPIData?.[ErrorKey] && !UpdateTestCategoryAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateTestCategoryAPIData, 'UpdateTestDepartmentAPI');
        }
    }, [UpdateTestCategoryAPIData]);

    const handleAddRole = () => {
        setShowModal(true);
    };
    const handleCancel = () => {
        setShowModal(false);
        setIsMode(false);
        setFormIntialValues({ ...addTestDepartmentIntialValues });
    };

    const handlePageChange = (p, rows) => {
        setPageNumber(p);
        setrowsPerPage(rows);
        const queryParams = {
            page: p,
            pageSize: rows
        };
        callAPIAction(GetAllTestDepartmentAPI, null, null, queryParams);
    };
    const handleActionClick = (cell, row, index, actionType) => {
        if (actionType === 'delete') {
            callAPIAction(DeleteTestDepartmentAPI, getDeleteTestDepartmentURL(row.original._id));
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
        callAPIAction(UpdateTestDepartmentAPI, getUpdateTestDepartmentURL(row.original._id), {
            ...row.original,
            status: row.original.status === 1 ? 2 : 1
        });
    };

    const handleSelectedData = (data) => {
        const rowData = [];

        Object.keys(data).map((item) => {
            rowData.push(testDepartments[item]);
        });
        setSelectedData(rowData);
    };
    return (
        <div className="p-5 layout-container">
            <Container fluid className="p-0">
                <h4 className="mt-3">Test Department</h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Test Department',
                            isLink: false
                        }
                    ]}
                    rightContainer={() => (
                        <button className="btn btn-soft-primary btn-sm d-flex align-items-center fw-bold" onClick={handleAddRole}>
                            <i class="ri-add-fill fs-16 fw-bold"></i>Add Test Department
                        </button>
                    )}
                />
                <ActionsTable
                    cardHeader={() => <TestDepartmentTableHeader testDepartmentsData={testDepartments} selectedData={selectedData} />}
                    tabelID="orgUsersTable"
                    columns={testDepartmentSchema}
                    data={testDepartments}
                    allDataObj={GetAllTestDepartmentAPIData?.[DataKey]}
                    loading={GetAllTestDepartmentAPIData?.[FetchingKey]}
                    customPageSize={10}
                    divClass="table-responsive table-card ref-mgmt-table-ht"
                    tableClass="table table-borderless table-centered align-middle fixed-header"
                    theadClass="default-table-header text-muted"
                    onPageChange={(p, rowsPerPage) => handlePageChange(p, rowsPerPage)}
                    emptyMessage={'no records found'}
                    tableLoader
                    showSelectAllOption={true}
                    handleActionClick={handleActionClick}
                    handleSwith={handleSwith}
                    handleSelectedData={handleSelectedData}
                />
            </Container>
            {showModal && (
                <AddTestDepartment
                    callDepartments={callDepartments}
                    onCloseClick={handleCancel}
                    formValues={formIntialValues}
                    isEditMode={isEditMode}
                />
            )}
        </div>
    );
};

export default TestDepartment;
