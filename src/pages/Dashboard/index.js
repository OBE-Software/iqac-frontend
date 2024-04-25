import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { callAPIAction } from '../../Store/callAPI/actions';
import { GetDashboardCustomersAPI, GetDashboardOrdersAPI, GetDashboardTransactionsAPI } from '../../helpers/APIs/CommonAPIs';
import newStatusSvg from '../../assets/svg/new.svg';
import assignedStatusSvg from '../../assets/svg/assign.svg';
import ongoingStatusSvg from '../../assets/svg/ongoing.svg';
import completedStatusSvg from '../../assets/svg/completed.svg';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { useSelector } from 'react-redux';
import { DataKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { TableSkelton } from '../../Components/Common/skelton';
import ActionsTable from '../../Components/Common/ActionsTable';
import { dashboardCustomerSchema, dashboardTransactionsSchema } from '../../common/data/TableSchema';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import { GetDashboardOrdersAPIURL, getPaymentsURL } from '../../helpers/APIs/CustomURL';
import Flatpickr from 'react-flatpickr';
import { dateInRequireFormate } from '../../Components/Common/Util';
import ExportToPdf from '../../Components/Common/ExportToPdf';

const Dashboard = () => {
    const [ordersData, setOrdersData] = useState('');
    const [customersData, setCustomersData] = useState([]);
    const [paymentsData, setPaymentsData] = useState([]);
    const [getDate, setGetDate] = useState([]);
    const GetDashboardOrdersAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetDashboardOrdersAPI));
    const GetDashboardCustomersAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetDashboardCustomersAPI));
    const GetDashboardTransactionsAPIAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetDashboardTransactionsAPI));
    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));
    console.log(profileData?.branchId);
    useEffect(() => {
        callAPIAction(GetDashboardOrdersAPI, GetDashboardOrdersAPIURL(profileData?.branchId));
        callAPIAction(GetDashboardCustomersAPI, null, { page: 1, pageSize: 10 });
        // callAPIAction(GetDashboardTransactionsAPI, null, { page: 1, pageSize: 10 });
        callAPIAction(GetDashboardTransactionsAPI, getPaymentsURL(profileData?.branchId), null, { page: 1, pageSize: 10 });
    }, []);

    useEffect(() => {
        if (GetDashboardOrdersAPIData?.[DataKey]?.isSuccess) {
            const data = GetDashboardOrdersAPIData?.[DataKey]?.data;
            setOrdersData(data);
        } else {
            setOrdersData('');
        }
    }, [GetDashboardOrdersAPIData]);

    useEffect(() => {
        if (GetDashboardCustomersAPIData?.[DataKey]?.isSuccess) {
            const data = GetDashboardCustomersAPIData?.[DataKey]?.data;
            setCustomersData(data);
        } else {
            setCustomersData([]);
        }
    }, [GetDashboardCustomersAPIData]);

    useEffect(() => {
        if (GetDashboardTransactionsAPIAPIData?.[DataKey]?.isSuccess) {
            const data = GetDashboardTransactionsAPIAPIData?.[DataKey]?.data;
            setPaymentsData(data);
        } else {
            setPaymentsData([]);
        }
    }, [GetDashboardTransactionsAPIAPIData]);

    const handlePageChangeForCustomer = (p, rowsPerPage) => {
        callAPIAction(GetDashboardCustomersAPI, null, null, {
            page: p,
            pageSize: rowsPerPage
        });
    };

    const handlePageChangeForTrans = (p, rowsPerPage) => {
        callAPIAction(GetDashboardTransactionsAPI, null, null, {
            page: p,
            pageSize: rowsPerPage
        });
    };

    if (GetDashboardOrdersAPIData?.[FetchingKey]) {
        return <TableSkelton />;
    }

    // const handleDate = (e) => {
    //     let queryParams = null;
    //     // const startValue = moment(e[0], 'ddd MMM DD YYYY HH:mm:ss ZZ').format('YYYY-MM-DD');
    //     // const endValue = moment(e[1], 'ddd MMM DD YYYY HH:mm:ss ZZ').fromat('YYYY-MM-DD');
    //     if (e.length > 0) {
    //         queryParams = {
    //             // startDate: startValue,
    //             // endDate: endValue === 'Invalid date' ? startValue : endValue
    //             startDate: e[0],
    //             endDate: e[1]
    //         };
    //         // queryParams['startDate'] = e[0];
    //         // queryParams['endDate'] = e[1];
    //     }

    //     callAPIAction(GetAllTimeSlotsAPI, null, null, queryParams);
    // };

    // const UserData = [
    //     { id: 1, name: 'John Doe', age: 30 },
    //     { id: 2, name: 'Jane Smith', age: 25 }
    //     // More data
    // ];
    return (
        <div className="p-5 layout-container">
            <Container fluid className="p-0">
                <h4 className="mt-0">Dashboard</h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Dashboard',
                            isLink: false
                        }
                    ]}
                />
            </Container>
            {/* <ExportToPdf data={UserData} /> */}
            <Card className="box-shadow-card">
                <div className="p-2 my-2 pe-4 w-20">
                    <label htmlFor="date">Filter Bookings</label>
                    <Flatpickr
                        name="date"
                        id="Date"
                        value={getDate}
                        // onClose={handleDate}
                        // onChange={(e) => {
                        //     setGetDate(e);
                        // }}
                        placeholder="From Date and To Date"
                        options={{
                            formatDate: (date) => {
                                return dateInRequireFormate(date, 'm/d/y');
                            },
                            mode: 'range'
                        }}
                    />
                </div>
                <CardBody className="d-flex align-items-center justify-content-between">
                    {/* ///////////  */}

                    {/* <Card className="box-shadow-card flex-grow-1 me-3 mb-0">
                        <CardBody className="text-center">
                            <h5 className="mb-2">{ordersData?.totalOrders}</h5>
                            <p className="mb-0">Total No. of Bookings</p>
                        </CardBody>
                    </Card> */}
                    {/* ////////// */}
                    <CardItemForMetricStatus icon={newStatusSvg} label="Approved" data={'62.4%'} classess={'approved-status'} />
                    <CardItemForMetricStatus icon={assignedStatusSvg} label="Rejected" data={'24.3%'} classess={'rejected-status'} />
                    <CardItemForMetricStatus icon={ongoingStatusSvg} label="In Draft" data={'24.3%'} classess={'inDraft-status'} />
                    <CardItemForMetricStatus icon={completedStatusSvg} label="Submitted" data={'24.3%'} classess={'submitted-status'} />
                    <CardItemForMetricStatus icon={completedStatusSvg} label="Not Started" data={'24.3%'} classess={'notStarted-status'} />
                    {/* //////// */}
                </CardBody>
            </Card>
            <Row>
                <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} className="">
                    {/* <Card className="box-shadow-card mb-0">
                        <CardBody> */}
                    <ActionsTable
                        tabelID="orgUsersTable"
                        cardHeader={() => <h5>New Customers in this month</h5>}
                        columns={dashboardCustomerSchema}
                        data={customersData}
                        allDataObj={GetDashboardCustomersAPIData?.[DataKey]}
                        loading={GetDashboardCustomersAPIData?.[FetchingKey]}
                        customPageSize={10}
                        divClass="table-responsive table-card dashboard-table-ht"
                        tableClass="table table-borderless table-centered align-middle fixed-header"
                        theadClass="default-table-header text-muted"
                        onPageChange={(p, rowsPerPage) => handlePageChangeForCustomer(p, rowsPerPage)}
                        emptyMessage={'no records found'}
                        tableLoader
                    />
                    {/* </CardBody>
                    </Card> */}
                </Col>
                <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} className="">
                    {/* <Card className="box-shadow-card mb-0">
                        <CardBody> */}
                    <ActionsTable
                        tabelID="orgUsersTable"
                        cardHeader={() => <h5>All Recent Transactions</h5>}
                        columns={dashboardTransactionsSchema}
                        data={paymentsData}
                        allDataObj={GetDashboardTransactionsAPIAPIData?.[DataKey]}
                        loading={GetDashboardTransactionsAPIAPIData?.[FetchingKey]}
                        customPageSize={10}
                        divClass="table-responsive table-card dashboard-table-ht"
                        tableClass="table table-borderless table-centered align-middle fixed-header"
                        theadClass="default-table-header text-muted"
                        onPageChange={(p, rowsPerPage) => handlePageChangeForTrans(p, rowsPerPage)}
                        emptyMessage={'no records found'}
                        tableLoader
                    />
                    {/* </CardBody>
                    </Card> */}
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;

const CardItemForMetricStatus = ({ icon, data, label, classess }) => (
    <Card className={`box-shadow-card flex-grow-1 me-3 ${classess} mb-0 pt-5`}>
        <CardBody className="">
            {/* <img src={icon} alt="new Status" /> */}
            <div className="ms-5">
                <p className="mb-0">{label}</p>
                <h3 className={`${classess} my-0`}>{data}</h3>
            </div>
        </CardBody>
    </Card>
);
