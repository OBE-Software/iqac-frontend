import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { useSelector } from 'react-redux';
import { getCustomerBookingsURL, getCustomerDetailsByIdURL } from '../../helpers/APIs/CustomURL';
import {
    GetAllBranchesAPI,
    GetAllTestsAPI,
    GetBookingAllAPI,
    GetCustomerDetailsByIdAPI,
    GetCustomersBookings
} from '../../helpers/APIs/CommonAPIs';
import { DataKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { callAPIAction } from '../../Store/callAPI/actions';
import { CommonLoadingSkelton } from '../../Components/Common/skelton';
import { Container } from 'reactstrap';
import moment from 'moment';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { bookTestIntialValues } from './customerUtils';
import BookTest from './BookTest';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import ActionsTable from '../../Components/Common/ActionsTable';
import { bookingSchema } from '../../common/data/TableSchema';
import { orderStatusesList } from '../../Components/constants/Constants';

const ViewCustomerComponent = () => {
    const { id } = useParams();

    const [customerDetails, setCusltomerDetails] = useState({});

    const [bookings, setBookings] = useState([]);

    const [showModalForBookTest, setShowModalForBookTest] = useState(false);
    const [alltests, setAllTests] = useState([]);
    const [branchList, setBranchList] = useState([]);

    const GetCustomerDetailsByIdAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetCustomerDetailsByIdAPI));
    const GetAllTestsAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllTestsAPI));
    const GetAllBranchesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllBranchesAPI));
    const GetCustomersBookingsData = useSelector((state) => SelectFullStateOfThisAPI(state, GetCustomersBookings));
    const currentNavSub = useSelector((state) => SelectSearchValInStore(state, 'currentNavSub'));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));
    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));
    const permissionData =
        profileData?.permissionData && profileData.permissionData.find((item) => item.module.toLowerCase() === 'bookings');

    let isLead = currentNavSub === 'Leads';
    const [formIntialValuesForBookTest, setFormIntialValuesForBookTest] = useState({
        ...bookTestIntialValues(roleData === 1, profileData, branchList)
    });

    useEffect(() => {
        callAPIAction(GetCustomerDetailsByIdAPI, getCustomerDetailsByIdURL(id));
        callAPIAction(GetAllTestsAPI);
        callAPIAction(GetCustomersBookings, getCustomerBookingsURL(id));
    }, []);

    useEffect(() => {
        if (GetCustomersBookingsData?.[DataKey]?.isSuccess) {
            // const data = GetCustomersBookingsData?.[DataKey]?.data;
            const data = GetCustomersBookingsData?.[DataKey]?.data.map((item) => {
                return {
                    ...item,
                    bookingStatusText: orderStatusesList.find((i) => i.id === item.status)?.name,
                    bookingTypeText: item.bookingType === 1 ? 'Home' : 'Diagnostic',
                    paymentStatusText: item.bookingType === 1 ? 'pending' : 'Success'
                };
            });
            setBookings(data);
        } else {
            setBookings([]);
        }
    }, [GetCustomersBookingsData]);

    useEffect(() => {
        if (GetAllTestsAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllTestsAPIData?.[DataKey]?.data;
            setAllTests(data);
        } else {
            setAllTests([]);
        }
    }, [GetAllTestsAPIData]);

    useEffect(() => {
        if (GetCustomerDetailsByIdAPIData?.[DataKey]?.isSuccess) {
            const data = GetCustomerDetailsByIdAPIData?.[DataKey]?.data;

            setCusltomerDetails(data);
        } else {
            setCusltomerDetails([]);
        }
    }, [GetCustomerDetailsByIdAPIData]);

    const handleCancel = () => {
        setShowModalForBookTest(false);
        setFormIntialValuesForBookTest({ ...bookTestIntialValues(roleData === 1, profileData, branchList) });
    };

    const handlePageChange = (p, rowsPerPage) => {
        const queryParams = {
            page: p,
            pageSize: rowsPerPage
        };

        callAPIAction(GetCustomersBookings, getCustomerBookingsURL(id), null, queryParams);
    };

    useEffect(() => {
        if (GetAllBranchesAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllBranchesAPIData?.[DataKey]?.data.map((item) => {
                return {
                    ...item,
                    slno: 1
                };
            });
            setBranchList(data);
        } else {
            setBranchList([]);
        }
    }, [GetAllBranchesAPIData]);
    if (GetCustomerDetailsByIdAPIData?.[FetchingKey])
        return (
            <div className="freeze-spinner">
                <CommonLoadingSkelton />
            </div>
        );

    return (
        <section className="p-5 layout-container">
            <Container fluid className="p-0">
                <h4 className="mt-0">Customer Details</h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: isLead ? 'Leads' : 'Patients',
                            isLink: true,
                            link: isLead ? '/leads' : '/patients'
                        },
                        {
                            label: customerDetails?.fullName,
                            isLink: false
                        }
                    ]}
                    rightContainer={() => (
                        <>
                            {(profileData.roleData === 1 || permissionData.actions.create === 1) && (
                                <button
                                    className="btn btn-soft-primary btn-sm d-flex align-items-center fw-bold"
                                    onClick={() => setShowModalForBookTest(true)}
                                >
                                    <i class="ri-add-fill fs-16 fw-bold"></i> Book Test
                                </button>
                            )}
                        </>
                    )}
                />
                <div className="customer-details">
                    <div className="flex-left">
                        <div className="info">
                            <p className="title-info">Full Name</p>
                            <p className="body-info">
                                {customerDetails?.designation} {customerDetails?.fullName || '-'}
                            </p>
                        </div>
                        <div className="info">
                            <p className="title-info">Phone Number</p>
                            <p className="body-info">{customerDetails?.mobile || '-'}</p>
                        </div>
                        <div className="info">
                            <p className="title-info">Email</p>
                            <p className="body-info">{customerDetails?.email || '-'}</p>
                        </div>
                        <div className="info">
                            <p className="title-info">Customer Type</p>
                            <p className="body-info">{customerDetails?.patientType || '-'}</p>
                        </div>
                        <div className="info">
                            <p className="title-info">Branch Name</p>
                            <p className="body-info">{customerDetails?.branchId?.branchName || '-'}</p>
                        </div>
                    </div>
                    <div className="flex-right">
                        <div className="info">
                            <p className="title-info">Date of Birth</p>
                            <p className="body-info">{moment(customerDetails?.dob).format('DD/MM/YYYY') || '-'}</p>
                        </div>
                        <div className="info">
                            <p className="title-info">Gender</p>
                            <p className="body-info">{customerDetails?.gender || '-'}</p>
                        </div>
                        <div className="info">
                            <p className="title-info">Address</p>
                            <p className="body-info">
                                {customerDetails?.area || '-'}, {customerDetails?.city || '-'}
                            </p>
                        </div>
                        <div className="info">
                            <p className="title-info">MRN NO.</p>
                            <p className="body-info">{customerDetails?.mrmNumber || '-'}</p>
                        </div>
                        <div className="info">
                            <p className="title-info">Branch Phone Number</p>
                            <p className="body-info">{customerDetails?.branchId?.phoneNumber || '-'}</p>
                        </div>
                    </div>
                    <div className="flex-right">
                        <div className="info">
                            <p className="title-info">Date of Birth</p>
                            <p className="body-info">{moment(customerDetails?.dob).format('DD/MM/YYYY') || '-'}</p>
                        </div>
                        <div className="info">
                            <p className="title-info">Gender</p>
                            <p className="body-info">{customerDetails?.gender || '-'}</p>
                        </div>
                        <div className="info">
                            <p className="title-info">Address</p>
                            <p className="body-info">
                                {customerDetails?.area || '-'}, {customerDetails?.city || '-'}
                            </p>
                        </div>
                        <div className="info">
                            <p className="title-info">Branch Pincode</p>
                            <p className="body-info">{customerDetails?.branchId?.pinCode || '-'}</p>
                        </div>
                    </div>
                </div>
                {!isLead && (
                    <>
                        <h4 className="mt-8">Booking Details</h4>
                        <ActionsTable
                            tabelID="Bookings Table"
                            columns={bookingSchema(null, true)}
                            data={bookings}
                            allDataObj={GetCustomersBookingsData?.[DataKey]}
                            loading={GetCustomersBookingsData?.[FetchingKey]}
                            customPageSize={10}
                            divClass="table-responsive table-card ref-mgmt-table-ht"
                            tableClass="table table-borderless table-centered align-middle fixed-header"
                            theadClass="default-table-header text-muted"
                            onPageChange={(p, rowsPerPage) => handlePageChange(p, rowsPerPage)}
                            emptyMessage={'no records found'}
                            tableLoader
                        />
                    </>
                )}
            </Container>
            {showModalForBookTest && (
                <BookTest
                    formValuesBookTest={formIntialValuesForBookTest}
                    onCloseClick={handleCancel}
                    getAllTest={alltests}
                    customerDetails={customerDetails}
                    branchList={branchList}
                />
            )}
        </section>
    );
};

export default ViewCustomerComponent;
