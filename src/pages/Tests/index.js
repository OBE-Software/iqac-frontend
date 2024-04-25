import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import ActionsTable from '../../Components/Common/ActionsTable';
import { testSchema } from '../../common/data/TableSchema';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import {
    DeleteTestAPI,
    GetAllRolesAPI,
    GetAllTestsAPI,
    GetAllTestsWithoutParamsAPI,
    GetTestCategoriesListAPI,
    GetTestDepartmentsListAPI,
    GetTestSamplesListAPI,
    UpdateTestAPI
} from '../../helpers/APIs/CommonAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { TestGendersListOptions, addTestIntialValues } from './testUtils';
import { getDeleteTestURL, getUpdateTestURL } from '../../helpers/APIs/CustomURL';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import AddTest from './AddTest';
import { addCurrentNavToStore, addCurrentSubNavToStore } from '../../Store/commonStore/actions';
import { useNavigate } from 'react-router-dom';
import TestTableHeader from './TestTableHeader';

const Tests = () => {
    const navigate = useNavigate();

    const [tests, setTests] = useState([]);
    const [alltests, setAllTests] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsMode] = useState(false);
    const [formIntialValues, setFormIntialValues] = useState({ ...addTestIntialValues });
    const [testCategoriesList, setTestCategoriesList] = useState([]);
    const [testSamplesList, setTestSamplesList] = useState([]);
    const [testDepartmentsList, setTestDepartmentsList] = useState([]);
    const [isThisSwitchCall, setIsThisSwitchCall] = useState(false);
    const [selectedData, setSelectedData] = useState([]);

    const GetAllTestAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllTestsAPI));
    const DeleteTestAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, DeleteTestAPI));
    const GetTestCategoriesListAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetTestCategoriesListAPI));
    const GetTestSamplesListAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetTestSamplesListAPI));
    const GetTestDepartmentsListAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetTestDepartmentsListAPI));
    const GetAllTestsWithoutParamsAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllTestsWithoutParamsAPI));
    const UpdateTestAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateTestAPI));

    useEffect(() => {
        const queryParams = {
            page: 1,
            pageSize: 10
        };
        callAPIAction(GetAllTestsAPI, null, null, queryParams);
        callAPIAction(GetTestCategoriesListAPI);
        callAPIAction(GetTestSamplesListAPI);
        callAPIAction(GetTestDepartmentsListAPI);
        callAPIAction(GetAllTestsWithoutParamsAPI);
    }, []);

    useEffect(() => {
        if (GetAllTestAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllTestAPIData?.[DataKey]?.data.map((item) => {
                return {
                    ...item,
                    slno: 1
                };
            });
            setTests(data);
        } else {
            setTests([]);
        }
    }, [GetAllTestAPIData]);

    useEffect(() => {
        if (GetTestCategoriesListAPIData?.[DataKey]?.isSuccess) {
            setTestCategoriesList(GetTestCategoriesListAPIData?.[DataKey]?.data);
        } else {
            setTestCategoriesList([]);
        }
    }, [GetTestCategoriesListAPIData]);

    useEffect(() => {
        if (GetTestSamplesListAPIData?.[DataKey]?.isSuccess) {
            setTestSamplesList(GetTestSamplesListAPIData?.[DataKey]?.data);
        } else {
            setTestSamplesList([]);
        }
    }, [GetTestSamplesListAPIData]);

    useEffect(() => {
        if (GetTestDepartmentsListAPIData?.[DataKey]?.isSuccess) {
            setTestDepartmentsList(GetTestDepartmentsListAPIData?.[DataKey]?.data);
        } else {
            setTestDepartmentsList([]);
        }
    }, [GetTestDepartmentsListAPIData]);

    useEffect(() => {
        if (GetAllTestsWithoutParamsAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllTestsWithoutParamsAPIData?.[DataKey]?.data;
            setAllTests(data);
        } else {
            setAllTests([]);
        }
    }, [GetAllTestsWithoutParamsAPIData]);

    useEffect(() => {
        if (DeleteTestAPIData?.[DataKey]?.isSuccess) {
            toast.success('Role Deleted Successfully');
            removeAPIDataAction('DeleteTestAPI');
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            callAPIAction(GetAllRolesAPI, null, null, queryParams);
        } else if (DeleteTestAPIData?.[ErrorKey] && !DeleteTestAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(DeleteTestAPIData, 'DeleteTestAPI');
        }
    }, [DeleteTestAPIData]);

    useEffect(() => {
        if (UpdateTestAPIData?.[DataKey]?.isSuccess && isThisSwitchCall) {
            setIsThisSwitchCall(false);
            toast.success('Test Updated Successfully');
            removeAPIDataAction('UpdateTestAPI');
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            callAPIAction(GetAllTestsAPI, null, null, queryParams);
            callAPIAction(GetAllTestsWithoutParamsAPI);
        } else if (UpdateTestAPIData?.[ErrorKey] && !UpdateTestAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateTestAPIData, 'UpdateTestAPI');
        }
    }, [UpdateTestAPIData]);

    const handleAddRole = () => {
        setShowModal(true);
    };
    const handleCancel = () => {
        setShowModal(false);
        setIsMode(false);
        setFormIntialValues({ ...addTestIntialValues });
    };

    const handlePageChange = (p, rowsPerPage) => {
        const queryParams = {
            page: p,
            pageSize: rowsPerPage
        };

        callAPIAction(GetAllTestsAPI, null, null, queryParams);
    };
    const handleActionClick = (cell, row, index, actionType) => {
        if (actionType === 'edit') {
            setIsMode(true);
            setShowModal(true);
            const Obj = { ...row.original };
            Obj['testCategory'] = testCategoriesList.find((i) => i.testCategoryName === row.original?.testCategory);
            Obj['departmentName'] = testDepartmentsList.find((i) => i.departmentName === row.original?.departmentName);
            Obj['testSamples'] = testSamplesList.filter((i) => row.original?.testSamples?.includes(i.testSampleName));
            Obj['recommendedFor'] = TestGendersListOptions.find((i) => i.name === row.original.recommendedFor);
            Obj['testIncluded'] = alltests?.filter((i) => row?.original?.testIncluded.includes(i.testName));
            setFormIntialValues(Obj);
        } else if (actionType === 'link') {
            addCurrentNavToStore('Lab Tests');
            addCurrentSubNavToStore('Tests');
            navigate('/lab-test/' + row.original._id);
        }
    };
    const handleSwith = (e, row) => {
        setIsThisSwitchCall(true);
        callAPIAction(UpdateTestAPI, getUpdateTestURL(row.original._id), {
            ...row.original,
            status: row.original.status === 1 ? 2 : 1
        });
    };

    const handleSelectedData = (data) => {
        const rowData = [];

        Object.keys(data).map((item) => {
            rowData.push(tests[item]);
        });
        setSelectedData(rowData);
    };

    return (
        <div className="p-5">
            <Container fluid className="p-0">
                <h4 className="mt-3">Tests</h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Tests',
                            isLink: false
                        }
                    ]}
                    rightContainer={() => (
                        <button className="btn btn-soft-primary btn-sm d-flex align-items-center fw-bold" onClick={handleAddRole}>
                            <i class="ri-add-fill fs-16 fw-bold"></i>Add Test
                        </button>
                    )}
                />
                <ActionsTable
                    tabelID="orgUsersTable"
                    cardHeader={() => (
                        <TestTableHeader testDepartmentsList={testDepartmentsList} testData={tests} selectedData={selectedData} />
                    )}
                    columns={testSchema}
                    data={tests}
                    allDataObj={GetAllTestAPIData?.[DataKey]}
                    loading={GetAllTestAPIData?.[FetchingKey]}
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
                <AddTest
                    onCloseClick={handleCancel}
                    formValues={formIntialValues}
                    isEditMode={isEditMode}
                    testCategoriesList={testCategoriesList}
                    testSamplesList={testSamplesList}
                    testDepartmentsList={testDepartmentsList}
                    alltests={alltests}
                />
            )}
        </div>
    );
};

export default Tests;
