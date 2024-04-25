import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import ActionsTable from '../../Components/Common/ActionsTable';
import { branchSchema } from '../../common/data/TableSchema';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { DeleteBranchAPI, GetAllBranchesAPI, GetAllCentersAPI, UpdateBranchAPI } from '../../helpers/APIs/CommonAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import AddBranch from './AddBranch';
import { PrepareEditBranchObj, addBranchIntialValues, indianStatesWithId } from './branchUtils';
import { getDeleteBranchUrl, getUpdateBranchUrl } from '../../helpers/APIs/CustomURL';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import BranchTableHeader from './BranchTableHeader';
const Branch = () => {
    const [branches, setAllBranches] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsMode] = useState(false);
    const [formIntialValues, setFormIntialValues] = useState({ ...addBranchIntialValues });
    const [centersList, setCentersList] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [rowsPerPage, setrowsPerPage] = useState(10);
    const [selectedData, setSelectedData] = useState([]);

    const GetAllBranchesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllBranchesAPI));
    const DeleteBranchAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, DeleteBranchAPI));
    const GetAllCentersAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllCentersAPI));
    const UpdateBranchAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateBranchAPI));

    const callBranch = () => {
        const queryParams = {
            page: pageNumber,
            pageSize: rowsPerPage
        };
        callAPIAction(GetAllBranchesAPI, null, null, queryParams);
        callAPIAction(GetAllCentersAPI);
    };
    useEffect(() => {
        callBranch();
    }, []);

    useEffect(() => {
        if (GetAllBranchesAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllBranchesAPIData?.[DataKey]?.data.map((item) => {
                return {
                    ...item,
                    slno: 1,
                    stateName: indianStatesWithId.find((i) => i.id === +item.state)?.name
                };
            });
            setAllBranches(data);
        } else {
            setAllBranches([]);
        }
    }, [GetAllBranchesAPIData]);

    useEffect(() => {
        if (GetAllCentersAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllCentersAPIData?.[DataKey]?.data.map((item) => {
                return {
                    ...item,
                    slno: 1
                };
            });
            setCentersList(data);
        } else {
            setCentersList([]);
        }
    }, [GetAllCentersAPIData]);

    useEffect(() => {
        if (DeleteBranchAPIData?.[DataKey]?.isSuccess) {
            toast.success('Branch Deleted Successfully');
            removeAPIDataAction('DeleteBranchAPI');
            const queryParams = {
                page: pageNumber,
                pageSize: rowsPerPage
            };
            callAPIAction(GetAllBranchesAPI, null, null, queryParams);
        } else if (DeleteBranchAPIData?.[ErrorKey] && !DeleteBranchAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(DeleteBranchAPIData, 'DeleteBranchAPI');
        }
    }, [DeleteBranchAPIData]);

    useEffect(() => {
        if (UpdateBranchAPIData?.[DataKey]?.isSuccess && !isEditMode) {
            toast.success('Branch Updated Successfully');
            removeAPIDataAction('UpdateBranchAPI');
            const queryParams = {
                page: pageNumber,
                pageSize: rowsPerPage
            };
            callAPIAction(GetAllBranchesAPI, null, null, queryParams);
        } else if (UpdateBranchAPIData?.[ErrorKey] && !UpdateBranchAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateBranchAPIData, 'UpdateBranchAPI');
        }
    }, [UpdateBranchAPIData]);

    const handleAddBranch = () => {
        setShowModal(true);
    };
    const handleCancel = () => {
        setShowModal(false);
        setIsMode(false);
        setFormIntialValues({ ...addBranchIntialValues });
    };
    const handleActionClick = (cell, row, index, actionType) => {
        if (actionType === 'delete') {
            callAPIAction(DeleteBranchAPI, getDeleteBranchUrl(row.original._id));
        } else if (actionType === 'edit') {
            setIsMode(true);
            setShowModal(true);
            setFormIntialValues(PrepareEditBranchObj(row?.original, centersList));
        }
    };

    const handlePageChange = (p, rowsPerPage) => {
        setPageNumber(p);
        setrowsPerPage(rowsPerPage);
        const queryParams = {
            page: p,
            pageSize: rowsPerPage
        };
        callAPIAction(GetAllBranchesAPI, null, null, queryParams);
    };

    const handleSwith = (e, row) => {
        callAPIAction(UpdateBranchAPI, getUpdateBranchUrl(row.original._id), {
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
        <div className="p-5 layout-container">
            <Container fluid className="p-0">
                <h4 className="mt-0">
                    Branches ({GetAllBranchesAPIData?.[DataKey]?.totalRecords ? GetAllBranchesAPIData?.[DataKey]?.totalRecords : '0'})
                </h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Branches',
                            isLink: false
                        }
                    ]}
                    rightContainer={() => (
                        <button className="btn btn-soft-primary btn-sm d-flex align-items-center fw-bold" onClick={handleAddBranch}>
                            <i class="ri-add-fill fs-16 fw-bold"></i>Add Branch
                        </button>
                    )}
                />
                <ActionsTable
                    tabelID="orgUsersTable"
                    cardHeader={() => <BranchTableHeader centersList={centersList} branchData={branches} selectedData={selectedData} />}
                    columns={branchSchema}
                    data={branches}
                    allDataObj={GetAllBranchesAPIData?.[DataKey]}
                    loading={GetAllBranchesAPIData?.[FetchingKey]}
                    customPageSize={10}
                    divClass="table-responsive table-card ref-mgmt-table-ht"
                    tableClass="table table-borderless table-centered align-middle fixed-header"
                    theadClass="default-table-header text-muted"
                    onPageChange={(p, rowsPerPage) => handlePageChange(p, rowsPerPage)}
                    emptyMessage={'no records found'}
                    tableLoader
                    handleSelectedData={handleSelectedData}
                    showSelectAllOption={true}
                    handleActionClick={handleActionClick}
                    handleSwith={handleSwith}
                />
            </Container>
            {showModal && (
                <AddBranch
                    onCloseClick={handleCancel}
                    formValues={formIntialValues}
                    centersList={centersList}
                    isEditMode={isEditMode}
                    pageNumber={pageNumber}
                    rowsPerPage={rowsPerPage}
                />
            )}
        </div>
    );
};

export default Branch;
