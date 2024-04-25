import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import ActionsTable from '../../Components/Common/ActionsTable';
import { branchSchema, centerSchema } from '../../common/data/TableSchema';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { DeleteCenterAPI, GetAllCentersAPI, UpdateCenterAPI } from '../../helpers/APIs/CommonAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import AddBranch from './AddCenter';
import { GenderList, PrepareEditCenterObj, addCenterIntialValues, indianStatesWithId, isHomeBranchList } from './centerUtils';
import { getDeleteCenterURL, getUpdateCenterhURL } from '../../helpers/APIs/CustomURL';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import CenterTableHeader from './CenterTableCenter';

const Center = () => {
    const [centers, setAllCenters] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsMode] = useState(false);
    const [formIntialValues, setFormIntialValues] = useState({ ...addCenterIntialValues });

    const [selectedData, setSelectedData] = useState([]);

    const GetAllCentersAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllCentersAPI));
    const DeleteCenterAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, DeleteCenterAPI));
    const UpdateCenterAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateCenterAPI));

    useEffect(() => {
        const queryParams = {
            page: 1,
            pageSize: 10
            // search: 'hel'
        };
        callAPIAction(GetAllCentersAPI, null, null, queryParams);
    }, []);

    useEffect(() => {
        if (GetAllCentersAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllCentersAPIData?.[DataKey]?.data;
            setAllCenters(data);
        } else {
            setAllCenters([]);
        }
    }, [GetAllCentersAPIData]);

    useEffect(() => {
        if (DeleteCenterAPIData?.[DataKey]?.isSuccess) {
            toast.success('Center Deleted Successfully');
            removeAPIDataAction('DeleteCenterAPI');
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            callAPIAction(GetAllCentersAPI, null, null, queryParams);
        } else if (DeleteCenterAPIData?.[ErrorKey] && !DeleteCenterAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(DeleteCenterAPIData, 'DeleteCenterAPI');
        }
    }, [DeleteCenterAPIData]);

    useEffect(() => {
        if (UpdateCenterAPIData?.[DataKey]?.isSuccess) {
            toast.success('Center Updated Successfully');
            removeAPIDataAction('UpdateCenterAPI');
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            callAPIAction(GetAllCentersAPI, null, null, queryParams);
        } else if (UpdateCenterAPIData?.[ErrorKey] && !UpdateCenterAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateCenterAPIData, 'UpdateCenterAPI');
        }
    }, [UpdateCenterAPIData]);

    const handleAddBranch = () => {
        setShowModal(true);
    };
    const handleCancel = () => {
        setShowModal(false);
        setIsMode(false);
        setFormIntialValues({ ...addCenterIntialValues });
    };

    const handlePageChange = (p, rowsPerPage) => {
        const queryParams = {
            page: p,
            pageSize: rowsPerPage
        };
        callAPIAction(GetAllCentersAPI, null, null, queryParams);
    };
    const handleActionClick = (cell, row, index, actionType) => {
        if (actionType === 'delete') {
            callAPIAction(DeleteCenterAPI, getDeleteCenterURL(row.original._id));
        } else if (actionType === 'edit') {
            setIsMode(true);
            setShowModal(true);

            const Obj = {
                ...row.original,
                gender: GenderList.find((i) => i.name === row.original.gender),
                state: indianStatesWithId.find((i) => i.name === row.original.state),
                isHomeBranch: isHomeBranchList.find((i) => i.name === (row.original.isHomeBranch ? 'Yes' : 'No'))
            };
            setFormIntialValues(Obj);
        }
    };

    const handleSwith = (e, row) => {
        callAPIAction(UpdateCenterAPI, getUpdateCenterhURL(row.original._id), {
            ...row.original,
            status: row.original.status === 1 ? 2 : 1
        });
    };

    const handleSelectedData = (data) => {
        const rowData = [];

        Object.keys(data).map((item) => {
            rowData.push(centers[item]);
        });
        setSelectedData(rowData);
    };

    return (
        <div className="p-5">
            <Container fluid className="p-0">
                <h4 className="mt-3">
                    Diagnostics Center (
                    {GetAllCentersAPIData?.[DataKey]?.totalRecords ? GetAllCentersAPIData?.[DataKey]?.totalRecords : '0'})
                </h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'TesDiagnostics Centersts',
                            isLink: false
                        }
                    ]}
                    rightContainer={() => (
                        <button className="btn btn-soft-primary btn-sm d-flex align-items-center fw-bold" onClick={handleAddBranch}>
                            <i class="ri-add-fill fs-16 fw-bold"></i>Add Center
                        </button>
                    )}
                />
                <ActionsTable
                    tabelID="orgUsersTable"
                    cardHeader={() => <CenterTableHeader centerData={centers} selectedData={selectedData} />}
                    columns={centerSchema}
                    data={centers}
                    allDataObj={GetAllCentersAPIData?.[DataKey]}
                    loading={GetAllCentersAPIData?.[FetchingKey]}
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
            {showModal && <AddBranch onCloseClick={handleCancel} formValues={formIntialValues} isEditMode={isEditMode} />}
        </div>
    );
};

export default Center;
