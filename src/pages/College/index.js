import React, { useEffect, useState } from 'react';
import ActionsTable from '../../Components/Common/ActionsTable';
import { Container } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { PrepareEditCollegeObj, addCollegeIntialValues } from './collegeUtils';
import { getAllCollegesAPI, getAllUniversitiesAPI, updateCollegeAPI } from '../../helpers/APIs/CommonAPIs';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { updateCollegeAPIURL } from '../../helpers/APIs/CustomURL';
import { collegeSchema } from '../../common/data/TableSchema';
import CollegeHeader from './CollegeHeader';
import AddCollege from './AddCollege';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';

const College = () => {
    const [getAllColleges, setAllColleges] = useState([]);
    const [universityList, setUniversityList] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [rowsPerPage, setrowsPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formIntialValues, setFormIntialValues] = useState({ ...addCollegeIntialValues });

    const GetAllCollegesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, getAllCollegesAPI));
    const UpdateCollegeAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, updateCollegeAPI));
    const GetAllUniversitiesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, getAllUniversitiesAPI));
    const navigate = useNavigate();

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

    useEffect(() => {
        if (UpdateCollegeAPIData?.[DataKey]?.isSuccess && !isEditMode) {
            toast.success('College status updated successfully'); // 2
            removeAPIDataAction('updateCollegeAPI');
            const queryParams = {
                page: pageNumber,
                pageSize: rowsPerPage
            };
            callAPIAction(getAllCollegesAPI, null, null, queryParams);
        } else if (UpdateCollegeAPIData?.[ErrorKey] && !UpdateCollegeAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateCollegeAPIData, 'updateCollegeAPI');
        }
    }, [UpdateCollegeAPIData]);

    const handleAddCollege = () => {
        setShowModal(true);
    };

    useEffect(() => {
        if (GetAllUniversitiesAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllUniversitiesAPIData?.[DataKey]?.data.map((item) => {
                return {
                    ...item,
                    slno: 1
                };
            });
            setUniversityList(data);
        } else {
            setUniversityList([]);
        }
    }, [GetAllUniversitiesAPIData]);

    const handlePageChange = (p, rows) => {
        const queryParams = {
            page: p,
            pageSize: rows
        };
        callAPIAction(getAllCollegesAPI, null, null, queryParams);
    };

    const handleActionClick = (cell, row, index, actionType) => {
        if (actionType === 'link') {
            navigate('/colleges/' + row.original._id);
        }
        // if (actionType === 'delete') {
        //     callAPIAction(DeleteBranchAPI, getDeleteBranchUrl(row.original._id));
        // }
        if (actionType === 'edit') {
            setIsEditMode(true);
            setShowModal(true);
            setFormIntialValues(PrepareEditCollegeObj(row?.original, universityList));
        }
    };

    const handleSelectedData = (data) => {
        const rowData = [];

        Object.keys(data).map((item) => {
            rowData.push(getAllColleges[item]);
        });
        setSelectedData(rowData);
    };

    const handleCancel = () => {
        setShowModal(false);
        setIsEditMode(false);
        setFormIntialValues({ ...addCollegeIntialValues });
    };

    const handleSwitch = (e, row) => {
        callAPIAction(updateCollegeAPI, updateCollegeAPIURL(row.original._id), {
            ...row.original,
            status: row.original.status === 1 ? 2 : 1
        });
    };

    return (
        <div className="p-5 layout-container">
            <Container fluid className="p-0">
                <h4 className="mt-0">
                    Colleges ({GetAllCollegesAPIData?.[DataKey]?.totalRecords ? GetAllCollegesAPIData?.[DataKey]?.totalRecords : '0'})
                </h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Universities',
                            isLink: false
                        }
                    ]}
                    rightContainer={() => (
                        <button className="btn btn-soft-primary btn-sm d-flex align-items-center fw-bold" onClick={handleAddCollege}>
                            <i class="ri-add-fill fs-16 fw-bold"></i>Add College
                        </button>
                    )}
                />

                <ActionsTable
                    tabelID="orgUsersTable"
                    cardHeader={() => <CollegeHeader selectedData={selectedData} getAllCollegesData={getAllColleges} />}
                    // cardTitle="Service States and LOB"
                    columns={collegeSchema}
                    data={getAllColleges?.length ? getAllColleges : []}
                    allDataObj={GetAllCollegesAPIData?.[DataKey]}
                    loading={GetAllCollegesAPIData?.[FetchingKey]}
                    customPageSize={10}
                    // handleSearch={handleSearch}
                    divClass="table-responsive table-card ref-mgmt-table-ht"
                    tableClass="table table-borderless table-centered align-middle fixed-header"
                    theadClass="default-table-header text-muted"
                    onPageChange={(p, rowsPerPage) => handlePageChange(p, rowsPerPage)}
                    emptyMessage={'no records found'}
                    tableLoader
                    showSelectAllOption={true}
                    handleActionClick={handleActionClick}
                    handleSwith={handleSwitch}
                    // isActionEdit={profileData.roleData === 1 ? true : permissionData.actions.edit}
                />
            </Container>
            {showModal && (
                <AddCollege
                    onCloseClick={handleCancel}
                    formValues={formIntialValues}
                    isEditMode={isEditMode}
                    pageNumber={pageNumber}
                    rowsPerPage={rowsPerPage}
                    universityList={universityList}
                />
            )}
        </div>
    );
};

export default College;
