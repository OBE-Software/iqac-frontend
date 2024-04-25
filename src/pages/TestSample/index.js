import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import ActionsTable from '../../Components/Common/ActionsTable';
import { testSampleSchema } from '../../common/data/TableSchema';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { DeleteTestSampleAPI, GetAllTestSampleAPI, UpdateTestSampleAPI } from '../../helpers/APIs/CommonAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { addTestSampleIntialValues } from './testSampleUtils';
import { getDeleteTestSampleURL, getUpdateTestSampleURL } from '../../helpers/APIs/CustomURL';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import AddTestSample from './AddTestSample';
import TestSampleTableHeader from './TestSampleTableHeader';

const TestSample = () => {
    const [testSamples, setTestSamples] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsMode] = useState(false);
    const [formIntialValues, setFormIntialValues] = useState({ ...addTestSampleIntialValues });
    const [pageNumber, setPageNumber] = useState(1);
    const [rowsPerPage, setrowsPerPage] = useState(10);

    const GetAllTestSampleAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllTestSampleAPI));
    const DeleteTestDepartmentAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, DeleteTestSampleAPI));
    const UpdateTestCategoryAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateTestSampleAPI));

    const callAllTestSample = () => {
        const queryParams = {
            page: pageNumber,
            pageSize: rowsPerPage
        };
        callAPIAction(GetAllTestSampleAPI, null, null, queryParams);
    };

    useEffect(() => {
        callAllTestSample();
    }, []);

    useEffect(() => {
        if (GetAllTestSampleAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllTestSampleAPIData?.[DataKey]?.data.map((item) => {
                return {
                    ...item,
                    slno: 1
                };
            });
            setTestSamples(data);
        } else {
            setTestSamples([]);
        }
    }, [GetAllTestSampleAPIData]);

    useEffect(() => {
        if (DeleteTestDepartmentAPIData?.[DataKey]?.isSuccess) {
            toast.success('Test Sample Deleted Successfully');
            removeAPIDataAction('DeleteTestSampleAPI');
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            callAPIAction(GetAllTestSampleAPI, null, null, queryParams);
        } else if (DeleteTestDepartmentAPIData?.[ErrorKey] && !DeleteTestDepartmentAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(DeleteTestDepartmentAPIData, 'DeleteTestSampleAPI');
        }
    }, [DeleteTestDepartmentAPIData]);

    useEffect(() => {
        if (UpdateTestCategoryAPIData?.[DataKey]?.isSuccess) {
            toast.success('Test Sample Updated Successfully');
            removeAPIDataAction('UpdateTestSampleAPI');
            callAllTestSample();
        } else if (UpdateTestCategoryAPIData?.[ErrorKey] && !UpdateTestCategoryAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateTestCategoryAPIData, 'UpdateTestSampleAPI');
        }
    }, [UpdateTestCategoryAPIData]);

    const handleAddRole = () => {
        setShowModal(true);
    };
    const handleCancel = () => {
        setShowModal(false);
        setIsMode(false);
        setFormIntialValues({ ...addTestSampleIntialValues });
    };

    const handlePageChange = (p, rowsPerPage) => {
        const queryParams = {
            page: p,
            pageSize: rowsPerPage
        };
        callAPIAction(GetAllTestSampleAPI, null, null, queryParams);
    };
    const handleActionClick = (cell, row, index, actionType) => {
        if (actionType === 'delete') {
            callAPIAction(DeleteTestSampleAPI, getDeleteTestSampleURL(row.original._id));
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
        callAPIAction(UpdateTestSampleAPI, getUpdateTestSampleURL(row.original._id), {
            ...row.original,
            status: row.original.status === 1 ? 2 : 1
        });
    };
    return (
        <div className="p-5 layout-container">
            <Container fluid className="p-0">
                <h4 className="mt-3">Test Sample</h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Test Sample',
                            isLink: false
                        }
                    ]}
                    rightContainer={() => (
                        <button className="btn btn-soft-primary btn-sm d-flex align-items-center fw-bold" onClick={handleAddRole}>
                            <i class="ri-add-fill fs-16 fw-bold"></i>Add Test Sample
                        </button>
                    )}
                />
                <ActionsTable
                    cardHeader={() => <TestSampleTableHeader />}
                    tabelID="orgUsersTable"
                    columns={testSampleSchema}
                    data={testSamples}
                    allDataObj={GetAllTestSampleAPIData?.[DataKey]}
                    loading={GetAllTestSampleAPIData?.[FetchingKey]}
                    customPageSize={10}
                    divClass="table-responsive table-card"
                    tableClass="table table-borderless table-centered align-middle"
                    theadClass="default-table-header text-muted"
                    onPageChange={(p, rowsPerPage) => handlePageChange(p, rowsPerPage)}
                    emptyMessage={'no records found'}
                    tableLoader
                    // showSelectAllOption={true}
                    handleActionClick={handleActionClick}
                    handleSwith={handleSwith}
                />
            </Container>
            {showModal && <AddTestSample onCloseClick={handleCancel} formValues={formIntialValues} isEditMode={isEditMode} />}
        </div>
    );
};

export default TestSample;
