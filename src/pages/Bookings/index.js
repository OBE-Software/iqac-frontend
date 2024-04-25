import React, { useEffect, useState } from 'react';
import { Container, Nav, NavItem, NavLink, TabContent } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import ActionsTable from '../../Components/Common/ActionsTable';
import { bookingSchema } from '../../common/data/TableSchema';
import { callAPIAction } from '../../Store/callAPI/actions';
import { GetAllBranchesAPI, GetBookingAllAPI } from '../../helpers/APIs/CommonAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { getOrdersURL, getUpdateBranchUrl } from '../../helpers/APIs/CustomURL';
import BookingTableHeader from './BookingTableHeader';
import { toast } from 'react-toastify';
import { branchAdminRoleName, orderStatusesList } from '../../Components/constants/Constants';
import { ongoingStatusesList } from './bookingUtils';
import { addCurrentNavToStore, addCurrentSubNavToStore } from '../../Store/commonStore/actions';
import { useNavigate } from 'react-router-dom';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import CreateOrder from './CreateOrder';

const Bookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('0');
    const [showModal, setShowModal] = useState(false);
    const [searchValue, SetSearchValue] = useState('');
    const [CheckedValue, setCheckedValue] = useState('');
    const [filterDate, setFilterDate] = useState([]);
    const [selectedData, setSelectedData] = useState([]);

    const GetBookingAllAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetBookingAllAPI));
    const GetAllBranchesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllBranchesAPI));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));
    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));

    useEffect(() => {
        callAPIAction(GetBookingAllAPI, getOrdersURL(profileData?.branchId), null, {
            page: 1,
            pageSize: 10
        });
        roleData?.roleName !== branchAdminRoleName && callAPIAction(GetAllBranchesAPI);
    }, []);

    useEffect(() => {
        if (GetBookingAllAPIData?.[DataKey]?.isSuccess) {
            const data = GetBookingAllAPIData?.[DataKey]?.data.map((item, idx) => {
                const findBranch = GetAllBranchesAPIData?.[DataKey]?.data?.find((i) => i._id === item.branchId);
                return {
                    ...item,
                    bookingStatusText: orderStatusesList.find((i) => i.id === item.status)?.name,
                    bookingTypeText: item.bookingType === 1 ? 'Home' : 'Diagnostic',
                    paymentStatusText: item.bookingType === 1 ? 'Failed' : 'Success',
                    branchName: findBranch ? findBranch?.branchName : '',
                    sno: idx + 1
                };
            });
            setBookings(data);
        } else {
            setBookings([]);
        }
    }, [GetBookingAllAPIData, GetAllBranchesAPIData]);

    const handlePageChange = (p, rowsPerPage) => {
        const queryParams = {
            page: p,
            pageSize: rowsPerPage
        };
        !!+activeTab && (queryParams['status'] = activeTab);
        searchValue && (queryParams['search'] = searchValue);
        CheckedValue && (queryParams['bookingType'] = CheckedValue);

        callAPIAction(GetBookingAllAPI, getOrdersURL(profileData?.branchId), null, queryParams);
    };

    const handleActionClick = (cell, row, index, actionType) => {
        if (actionType === 'link') {
            addCurrentNavToStore('Bookings');
            addCurrentSubNavToStore('');
            navigate('/bookings/' + row.original._id);
        }
    };

    const handleTabClick = (data) => {
        console.log(data, 'data------>');
        let number = data;
        if (roleData?.roleName === branchAdminRoleName && data === '3') {
            number = '4';
        }
        SetSearchValue('');
        setCheckedValue('');
        setActiveTab(number);
        setFilterDate('');

        if (number === '0') {
            callAPIAction(GetBookingAllAPI, getOrdersURL(profileData?.branchId), null, {
                page: 1,
                pageSize: 10
            });
            return;
        } else if (number === '3' || number === '1' || number === '4') {
            callAPIAction(GetBookingAllAPI, getOrdersURL(profileData?.branchId), null, {
                page: 1,
                pageSize: 10,
                status: number
            });
        } else {
            callAPIAction(GetBookingAllAPI, getOrdersURL(profileData?.branchId), null, {
                page: 1,
                pageSize: 10,
                status: ongoingStatusesList(number, roleData?.roleName)
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchValue) {
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            activeTab !== '0' && (queryParams['status'] = ongoingStatusesList(activeTab, roleData?.roleName));
            searchValue && (queryParams['search'] = searchValue);
            CheckedValue && (queryParams['bookingType'] = CheckedValue);
            filterDate?.length > 0 && (queryParams['startDate'] = filterDate[0]);
            filterDate?.length > 0 && (queryParams['endDate'] = filterDate[1]);

            callAPIAction(GetBookingAllAPI, getOrdersURL(profileData?.branchId), null, queryParams);
        }
    };
    const handleDate = (e) => {
        const queryParams = {
            page: 1,
            pageSize: 10
        };
        activeTab !== '0' && (queryParams['status'] = ongoingStatusesList(activeTab, roleData?.roleName));
        searchValue && (queryParams['search'] = searchValue);
        CheckedValue && (queryParams['bookingType'] = CheckedValue);

        if (e.length > 0) {
            queryParams['startDate'] = e[0];
            queryParams['endDate'] = e[1];
        }
        callAPIAction(GetBookingAllAPI, getOrdersURL(profileData?.branchId), null, queryParams);
    };

    const onChangeData = (val) => {
        if (val.length > 50) {
            toast.error('Search value should not be more than 50 characters');
            return;
        }
        if (!val) {
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            activeTab !== '0' && (queryParams['status'] = ongoingStatusesList(activeTab, roleData?.roleName));
            CheckedValue && (queryParams['bookingType'] = CheckedValue);
            filterDate?.length > 0 && (queryParams['startDate'] = filterDate[0]);
            filterDate?.length > 0 && (queryParams['endDate'] = filterDate[1]);
            callAPIAction(GetBookingAllAPI, getOrdersURL(profileData?.branchId), null, queryParams);
        }
        SetSearchValue(val);
    };

    const handleCheck = (e) => {
        const queryParams = {
            page: 1,
            pageSize: 10
        };
        activeTab !== '0' && (queryParams['status'] = ongoingStatusesList(activeTab, roleData?.roleName));
        searchValue && (queryParams['search'] = searchValue);
        e.target.checked && (queryParams['bookingType'] = e.target.value);
        filterDate?.length > 0 && (queryParams['startDate'] = filterDate[0]);
        filterDate?.length > 0 && (queryParams['endDate'] = filterDate[1]);

        callAPIAction(GetBookingAllAPI, getOrdersURL(profileData?.branchId), null, queryParams);
        setCheckedValue(e.target.value === CheckedValue ? '' : e.target.value);
    };

    const handleCloseCreateOrderModal = () => {
        setShowModal(false);
    };

    const handleSelectedData = (data) => {
        const rowData = [];

        Object.keys(data).map((item) => {
            rowData.push(bookings[item]);
        });
        setSelectedData(rowData);
    };

    return (
        <div className="p-5 layout-container">
            <Container fluid className="p-0">
                <h4 className="mt-0">
                    Bookings {!!GetBookingAllAPIData?.[DataKey]?.totalRecords && ` (${GetBookingAllAPIData?.[DataKey]?.totalRecords})`}
                </h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Bookings',
                            isLink: false
                        }
                    ]}
                />

                <Nav tabs className="d-flex justify-content-end">
                    <NavItem>
                        <NavLink className={activeTab === '0' ? 'active bg-white ' : ''} onClick={() => handleTabClick('0')}>
                            All
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={activeTab === '3' || activeTab === '4' ? 'active bg-white' : ''}
                            onClick={() => handleTabClick('3')}
                        >
                            New
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={activeTab === '2' ? 'active bg-white' : ''} onClick={() => handleTabClick('2')}>
                            Ongoing
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={activeTab === '1' ? 'active bg-white' : ''} onClick={() => handleTabClick('1')}>
                            Completed
                        </NavLink>
                    </NavItem>
                </Nav>
                <ActionsTable
                    tabelID="Bookings Table"
                    cardHeader={() => (
                        <BookingTableHeader
                            handleSearch={handleSearch}
                            onChangeData={onChangeData}
                            searchValue={searchValue}
                            CheckedValue={CheckedValue}
                            handleCheck={handleCheck}
                            handleDate={handleDate}
                            filterDate={filterDate}
                            setFilterDate={setFilterDate}
                            bookingData={bookings}
                            selectedData={selectedData}
                        />
                    )}
                    columns={bookingSchema(roleData?.roleName)}
                    data={bookings}
                    allDataObj={GetBookingAllAPIData?.[DataKey]}
                    loading={GetBookingAllAPIData?.[FetchingKey]}
                    customPageSize={10}
                    divClass="table-responsive table-card ref-mgmt-table-ht"
                    tableClass="table table-borderless table-centered align-middle fixed-header"
                    theadClass="default-table-header text-muted"
                    onPageChange={(p, rowsPerPage) => handlePageChange(p, rowsPerPage)}
                    emptyMessage={'no records found'}
                    tableLoader
                    handleActionClick={handleActionClick}
                    handleSelectedData={handleSelectedData}
                    showSelectAllOption={true}
                />
            </Container>
            {showModal && <CreateOrder onCloseClick={handleCloseCreateOrderModal} />}
        </div>
    );
};

export default Bookings;
