import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import ActionsTable from '../../Components/Common/ActionsTable';
import { testCategorySchema } from '../../common/data/TableSchema';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { DeleteTestCategoryAPI, GetAllTestCategoryAPI, UpdateTestCategoryAPI } from '../../helpers/APIs/CommonAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { addTestCategoryIntialValues } from './testCategoryUtils';
import { getDeleteTestCategoryURL, getUpdateTestCategoryURL } from '../../helpers/APIs/CustomURL';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import AddTestCategory from './AddTestCategory';
import TestCategoryTableHeader from './TestCategoryTableHeader';

const TestCategory = () => {
    const [testCategories, setTestCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsMode] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [rowsPerPage, setrowsPerPage] = useState(10);
    const [formIntialValues, setFormIntialValues] = useState({ ...addTestCategoryIntialValues });
    const [selectedData, setSelectedData] = useState([]);

    const GetAllTestCategory = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllTestCategoryAPI));
    const DeleteTestCategoryAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, DeleteTestCategoryAPI));
    const UpdateTestCategoryAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateTestCategoryAPI));
    const callCategory = () => {
        const queryParams = {
            page: pageNumber,
            pageSize: rowsPerPage
        };
        callAPIAction(GetAllTestCategoryAPI, null, null, queryParams);
    };
    useEffect(() => {
        callCategory();
    }, []);

    useEffect(() => {
        if (GetAllTestCategory?.[DataKey]?.isSuccess) {
            const data = GetAllTestCategory?.[DataKey]?.data.map((item) => {
                return {
                    ...item,
                    slno: 1
                };
            });
            setTestCategories(data);
        } else {
            setTestCategories([]);
        }
    }, [GetAllTestCategory]);

    useEffect(() => {
        if (DeleteTestCategoryAPIData?.[DataKey]?.isSuccess) {
            toast.success('Test Category Deleted Successfully');
            removeAPIDataAction('DeleteTestCategoryAPI');
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            callAPIAction(GetAllTestCategoryAPI, null, null, queryParams);
        } else if (DeleteTestCategoryAPIData?.[ErrorKey] && !DeleteTestCategoryAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(DeleteTestCategoryAPIData, 'DeleteTestCategoryAPI');
        }
    }, [DeleteTestCategoryAPIData]);

    useEffect(() => {
        if (UpdateTestCategoryAPIData?.[DataKey]?.isSuccess) {
            toast.success('Test Category Updated Successfully');
            removeAPIDataAction('UpdateTestCategoryAPI');
            // callAPIAction(GetAllTestCategoryAPI);
            callCategory();
        } else if (UpdateTestCategoryAPIData?.[ErrorKey] && !UpdateTestCategoryAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateTestCategoryAPIData, 'UpdateTestCategoryAPI');
        }
    }, [UpdateTestCategoryAPIData]);

    const handleAddRole = () => {
        setShowModal(true);
    };
    const handleCancel = () => {
        setShowModal(false);
        setIsMode(false);
        setFormIntialValues({ ...addTestCategoryIntialValues });
    };

    const handlePageChange = (p, rowsPerPage) => {
        setPageNumber(p);
        setrowsPerPage(rowsPerPage);
        const queryParams = {
            page: p,
            pageSize: rowsPerPage
        };
        callAPIAction(GetAllTestCategoryAPI, null, null, queryParams);
    };
    const handleActionClick = (cell, row, index, actionType) => {
        if (actionType === 'delete') {
            callAPIAction(DeleteTestCategoryAPI, getDeleteTestCategoryURL(row.original._id));
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
        callAPIAction(UpdateTestCategoryAPI, getUpdateTestCategoryURL(row.original._id), {
            ...row.original,
            status: row.original.status === 1 ? 2 : 1
        });
    };

    const handleSelectedData = (data) => {
        const rowData = [];

        Object.keys(data).map((item) => {
            rowData.push(testCategories[item]);
        });
        setSelectedData(rowData);
    };
    return (
        <div className="p-5 layout-container">
            <Container fluid className="p-0">
                <h4 className="mt-3">Test Category</h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Test Category',
                            isLink: false
                        }
                    ]}
                    rightContainer={() => (
                        <button className="btn btn-soft-primary btn-sm d-flex align-items-center fw-bold" onClick={handleAddRole}>
                            <i class="ri-add-fill fs-16 fw-bold"></i>Add Test Category
                        </button>
                    )}
                />
                <ActionsTable
                    cardHeader={() => <TestCategoryTableHeader testCategoriesData={testCategories} selectedData={selectedData} />}
                    tabelID="orgUsersTable"
                    columns={testCategorySchema}
                    data={testCategories}
                    allDataObj={GetAllTestCategory?.[DataKey]}
                    loading={GetAllTestCategory?.[FetchingKey]}
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
            {showModal && <AddTestCategory onCloseClick={handleCancel} formValues={formIntialValues} isEditMode={isEditMode} />}
        </div>
    );
};

export default TestCategory;
