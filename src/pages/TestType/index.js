import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import ActionsTable from '../../Components/Common/ActionsTable';
import { testTypeSchema } from '../../common/data/TableSchema';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { DeleteTestTypeAPI, GetAllTestTypeAPI, UpdateTestTypeAPI } from '../../helpers/APIs/CommonAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { addTestTypeIntialValues } from './testTypeUtils';
import { getDeleteTestTypeURL, getUpdateTestTypeURL } from '../../helpers/APIs/CustomURL';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import AddTestType from './AddTestType';
import TestTypeTableHeader from './TestTypeTableHeader';

const TestType = () => {
    const [testSamples, setTestSamples] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsMode] = useState(false);
    const [formIntialValues, setFormIntialValues] = useState({ ...addTestTypeIntialValues });
    const [pageNumber, setPageNumber] = useState(1);
    const [rowsPerPage, setrowsPerPage] = useState(10);
    const [selectedData, setSelectedData] = useState([]);


    const GetAllTestTypeAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllTestTypeAPI));
    const DeleteTestDepartmentAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, DeleteTestTypeAPI));
    const UpdateTestCategoryAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateTestTypeAPI));

    const callTesttype = () => {
        const queryParams = {
            page: pageNumber,
            pageSize: rowsPerPage
        };
        callAPIAction(GetAllTestTypeAPI, null, null, queryParams);
    };
    useEffect(() => {
        callTesttype();
    }, []);

    useEffect(() => {
        if (GetAllTestTypeAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllTestTypeAPIData?.[DataKey]?.data.map((item) => {
                return {
                    ...item,
                    slno: 1
                };
            });
            setTestSamples(data);
        } else {
            setTestSamples([]);
        }
    }, [GetAllTestTypeAPIData]);

    useEffect(() => {
        if (DeleteTestDepartmentAPIData?.[DataKey]?.isSuccess) {
            toast.success('Test Type Deleted Successfully');
            removeAPIDataAction('DeleteTestTypeAPI');
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            callAPIAction(GetAllTestTypeAPI, null, null, queryParams);
        } else if (DeleteTestDepartmentAPIData?.[ErrorKey] && !DeleteTestDepartmentAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(DeleteTestDepartmentAPIData, 'DeleteTestTypeAPI');
        }
    }, [DeleteTestDepartmentAPIData]);

    useEffect(() => {
        if (UpdateTestCategoryAPIData?.[DataKey]?.isSuccess) {
            toast.success('Test Type Updated Successfully');
            removeAPIDataAction('UpdateTestTypeAPI');
            callTesttype();
        } else if (UpdateTestCategoryAPIData?.[ErrorKey] && !UpdateTestCategoryAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateTestCategoryAPIData, 'UpdateTestTypeAPI');
        }
    }, [UpdateTestCategoryAPIData]);

    const handleAddRole = () => {
        setShowModal(true);
    };
    const handleCancel = () => {
        setShowModal(false);
        setIsMode(false);
        setFormIntialValues({ ...addTestTypeIntialValues });
    };

    const handlePageChange = (p, rowsPerPage) => {
        setPageNumber(p);
        setrowsPerPage(rowsPerPage);
        const queryParams = {
            page: p,
            pageSize: rowsPerPage
        };
        callAPIAction(GetAllTestTypeAPI, null, null, queryParams);
    };
    const handleActionClick = (cell, row, index, actionType) => {
        if (actionType === 'delete') {
            callAPIAction(DeleteTestTypeAPI, getDeleteTestTypeURL(row.original._id));
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
        callAPIAction(UpdateTestTypeAPI, getUpdateTestTypeURL(row.original._id), {
            ...row.original,
            status: row.original.status === 1 ? 2 : 1
        });
    };

    const handleSelectedData = (data) => {
        const rowData = [];

        Object.keys(data).map((item) => {
            rowData.push(testSamples[item]);
        });
        setSelectedData(rowData);
    };

    return (
        <div className="p-5 layout-container">
            <Container fluid className="p-0">
                <h4 className="mt-3">Test Types</h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Test Type',
                            isLink: false
                        }
                    ]}
                    rightContainer={() => (
                        <button className="btn btn-soft-primary btn-sm d-flex align-items-center fw-bold" onClick={handleAddRole}>
                            <i class="ri-add-fill fs-16 fw-bold"></i>Add Test Type
                        </button>
                    )}
                />
                <ActionsTable
                    cardHeader={() => <TestTypeTableHeader selectedData={selectedData} testSamplesData={testSamples}/>}
                    tabelID="orgUsersTable"
                    columns={testTypeSchema}
                    data={testSamples}
                    allDataObj={GetAllTestTypeAPIData?.[DataKey]}
                    loading={GetAllTestTypeAPIData?.[FetchingKey]}
                    customPageSize={10}
                    divClass="table-responsive table-card ref-mgmt-table-ht"
                    tableClass="table table-borderless table-centered align-middle fixed-header"
                    theadClass="default-table-header text-muted"
                    onPageChange={(p, rowsPerPage) => handlePageChange(p, rowsPerPage)}
                    emptyMessage={'no records found'}
                    tableLoader
                    showSelectAllOption={true}
                    handleSelectedData={handleSelectedData}
                    handleActionClick={handleActionClick}
                    handleSwith={handleSwith}
                />
            </Container>
            {showModal && <AddTestType onCloseClick={handleCancel} formValues={formIntialValues} isEditMode={isEditMode} />}
        </div>
    );
};

export default TestType;
