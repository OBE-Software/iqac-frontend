import React, { useEffect, useState } from 'react';
import { Card, Container } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import ActionsTable from '../../Components/Common/ActionsTable';
import { paymentSchema } from '../../common/data/TableSchema';
import { callAPIAction } from '../../Store/callAPI/actions';
import { GetDashboardTransactionsAPI } from '../../helpers/APIs/CommonAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { DataKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import { getPaymentsURL } from '../../helpers/APIs/CustomURL';
import PaymentTableHeader from './PaymentTableHeader';

const Payment = () => {
    const [payments, setPayments] = useState([]);
    const [selectedData, setSelectedData] = useState([]);

    const GetDashboardTransactionsAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetDashboardTransactionsAPI));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));

    useEffect(() => {
        const queryParams = {
            page: 1,
            pageSize: 10
        };
        callAPIAction(GetDashboardTransactionsAPI, getPaymentsURL(profileData?.branchId), null, queryParams);
    }, []);

    useEffect(() => {
        if (GetDashboardTransactionsAPIData?.[DataKey]?.isSuccess) {
            const data = GetDashboardTransactionsAPIData?.[DataKey]?.data;
            setPayments(data);
        } else {
            setPayments([]);
        }
    }, [GetDashboardTransactionsAPIData]);

    const handlePageChange = (p, rowsPerPage) => {
        const queryParams = {
            page: p,
            pageSize: rowsPerPage
        };
        callAPIAction(GetDashboardTransactionsAPI, null, null, queryParams);
    };

    const handleSelectedData = (data) => {
        const rowData = [];

        Object.keys(data).map((item) => {
            rowData.push(payments[item]);
        });
        setSelectedData(rowData);
    };

    return (
        <div className="p-5 layout-container">
            <Container fluid className="p-0">
                <h4 className="mt-3">Payments</h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Payments',
                            isLink: false
                        }
                    ]}
                />

                <ActionsTable
                    tabelID="orgUsersTable"
                    cardHeader={() => <PaymentTableHeader testDepartmentsList={[]} paymentData={payments} selectedData={selectedData} />}
                    columns={paymentSchema}
                    data={payments}
                    allDataObj={GetDashboardTransactionsAPI?.[DataKey]}
                    loading={GetDashboardTransactionsAPIData?.[FetchingKey]}
                    customPageSize={10}
                    divClass="table-responsive table-card"
                    tableClass="table table-borderless table-centered align-middle"
                    theadClass="default-table-header text-muted"
                    onPageChange={(p, rowsPerPage) => handlePageChange(p, rowsPerPage)}
                    emptyMessage={'no records found'}
                    tableLoader
                    showSelectAllOption={true}
                    handleSelectedData={handleSelectedData}
                    // showSelectAllOption={true}
                />
            </Container>
        </div>
    );
};

export default Payment;
