import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import ActionsTable from '../../Components/Common/ActionsTable';
import { CustomerSchema } from '../../common/data/TableSchema';
import { GetAllBranchesAPI, GetCustomerAPI } from '../../helpers/APIs/CommonAPIs';
import { callAPIAction } from '../../Store/callAPI/actions';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { DataKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import AddCustomer from './AddCustomer';
import { GenderList, addCustomerIntialValues, bookTestIntialValues, checkIsCustomerDataCanView, patientTypeList } from './customerUtils';
import { useNavigate } from 'react-router-dom';
import BookTest from './BookTest';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import { toast } from 'react-toastify';
import CustomerTableHeader from './CustomerTableHeader';
import { getCustomerURL } from '../../helpers/APIs/CustomURL';

const Customers = () => {
    const navigate = useNavigate();
    const [getCustomerData, setGetCustomerData] = useState([]);
    const [formIntialValues, setFormIntialValues] = useState({ ...addCustomerIntialValues });
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsMode] = useState(false);
    const [selectedData, setSelectedData] = useState([]);

    const [branchList, setBranchList] = useState([]);
    const currentNavSub = useSelector((state) => SelectSearchValInStore(state, 'currentNavSub'));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));
    const permissionData = profileData?.permissionData?.find((item) => item.module.toLowerCase() === 'patients');

    const GetAllCustomerAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetCustomerAPI));
    const GetAllBranchesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllBranchesAPI));

    let isLead = currentNavSub === 'Leads';

    useEffect(() => {
        const queryParams = {
            page: 1,
            pageSize: 10,
            customerType: isLead ? 'lead' : 'patient'
        };
        callAPIAction(GetCustomerAPI, getCustomerURL(profileData?.branchId), null, queryParams);
        callAPIAction(GetAllBranchesAPI);
    }, [isLead]);

    useEffect(() => {
        if (GetAllCustomerAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllCustomerAPIData?.[DataKey]?.data;

            setGetCustomerData(data);
        } else {
            setGetCustomerData([]);
        }
    }, [GetAllCustomerAPIData]);

    useEffect(() => {
        if (GetAllBranchesAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllBranchesAPIData?.[DataKey]?.data.map((item) => {
                return {
                    ...item
                };
            });
            setBranchList(data);
        } else {
            setBranchList([]);
        }
    }, [GetAllBranchesAPIData]);

    const handleCancel = (label) => {
        if (label === 'addCustomer') {
            setShowModal(false);
            setIsMode(false);
            setFormIntialValues({ ...addCustomerIntialValues });
        }
    };

    const handleActionClick = (cell, row, index, actionType) => {
        if (actionType === 'edit') {
            setIsMode(true);
            setShowModal(true);

            const obj = {
                ...row.original,
                gender: GenderList.find((i) => i.name === row.original.gender),
                patientType: patientTypeList.find((i) => i.name === row.original.patientType),
                branchId: branchList.find((i) => i._id === row.original.branch?._id),
                dob: [new Date(row.original.dob)]
            };
            setFormIntialValues(obj);
        } else if (actionType === 'link') {
            if (isLead && !checkIsCustomerDataCanView(row.original)) {
                toast.warning('Please fill all the required fields.');
                return;
            }
            navigate((isLead ? '/leads/' : '/patients/') + row.original._id);
        }
    };

    const handlePageChange = (p, rowsPerPage) => {
        const queryParams = {
            page: p,
            pageSize: rowsPerPage
        };
        callAPIAction(GetCustomerAPI, getCustomerURL(profileData?.branchId), null, queryParams);
    };

    const checkAddPatientAccess = () => {
        if (profileData.roleData === 1) {
            return true;
        }

        if (permissionData?.actions.create === 1) {
            return true;
        }
        return false;
    };

    const handleSelectedData = (data) => {
        const rowData = [];

        Object.keys(data).map((item) => {
            rowData.push(getCustomerData[item]);
        });
        setSelectedData(rowData);
    };

    return (
        <>
            <div className="p-5 layout-container">
                <Container fluid className="p-0">
                    <h4 className="mt-3">Customers</h4>
                    <BreadCrumb
                        pageTitle=""
                        crumbs={[
                            {
                                label: isLead ? 'Leads' : 'Patients',
                                isLink: false
                            }
                        ]}
                        rightContainer={() =>
                            isLead &&
                            checkAddPatientAccess() && (
                                <button
                                    className="btn btn-soft-primary btn-sm d-flex align-items-center fw-bold"
                                    onClick={() => setShowModal(true)}
                                >
                                    <i class="ri-add-fill fs-16 fw-bold"></i>Add Patient
                                </button>
                            )
                        }
                    />

                    <ActionsTable
                        tabelID="orgUsersTable"
                        cardHeader={() => (
                            <CustomerTableHeader isLead={isLead} selectedData={selectedData} getCustomerData={getCustomerData} />
                        )}
                        columns={CustomerSchema(isLead)}
                        data={getCustomerData}
                        allDataObj={GetAllCustomerAPIData?.[DataKey]}
                        loading={GetAllCustomerAPIData?.[FetchingKey]}
                        customPageSize={10}
                        divClass="table-responsive table-card"
                        tableClass="table table-borderless table-centered align-middle"
                        theadClass="default-table-header text-muted"
                        onPageChange={(p, rowsPerPage) => handlePageChange(p, rowsPerPage)}
                        emptyMessage={'no records found'}
                        tableLoader
                        handleSelectedData={handleSelectedData}
                        showSelectAllOption={true}
                        handleActionClick={handleActionClick}
                        isActionEdit={profileData.roleData === 1 ? true : permissionData?.actions.edit}
                    />
                </Container>
                {showModal && (
                    <AddCustomer
                        onCloseClick={() => handleCancel('addCustomer')}
                        formValues={formIntialValues}
                        branchList={branchList}
                        isEditMode={isEditMode}
                        isLead={isLead}
                    />
                )}
            </div>
        </>
    );
};

export default Customers;
