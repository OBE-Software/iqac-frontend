import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import ActionsTable from '../../Components/Common/ActionsTable';
import { sendNotificationIntialValues } from './notificationUtils';
import SendNotification from './SendNotification';
import { notificationAddSchema } from '../../common/data/TableSchema';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { GetAllNotificationsAPI } from '../../helpers/APIs/CommonAPIs';
import { DataKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { callAPIAction } from '../../Store/callAPI/actions';
import NotificationTableHeader from './NotificationTableHeader';

const Notification = () => {
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsMode] = useState(false);
    const [formIntialValues, setFormIntialValues] = useState({ ...sendNotificationIntialValues });
    const [notificationsList, setNotificationsList] = useState([]);
    const [selectedData, setSelectedData] = useState([]);

    const GetAllNotificationsAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllNotificationsAPI));

    useEffect(() => {
        callAPIAction(GetAllNotificationsAPI, null, null, {
            page: 1,
            pageSize: 10
        });
    }, []);

    useEffect(() => {
        if (GetAllNotificationsAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllNotificationsAPIData?.[DataKey]?.data;
            setNotificationsList(data);
        } else {
            setNotificationsList([]);
        }
    }, [GetAllNotificationsAPIData]);

    const handleModalClose = () => {
        setShowModal(false);
        setFormIntialValues({ ...sendNotificationIntialValues });
    };

    const handlePageChange = (p, rowsPerPage) => {
        const queryParams = {
            page: p,
            pageSize: rowsPerPage
        };
        callAPIAction(GetAllNotificationsAPI, null, null, queryParams);
    };

    // const handleSelectedData = (data) => {
    //     const rowData = [];

    //     Object.keys(data).map((item) => {
    //         rowData.push(branches[item]);
    //     });
    //     setSelectedData(rowData);
    // };

    return (
        <div className="p-5">
            <Container fluid className="p-0">
                <h4 className="mt-0">Notification</h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Notification',
                            isLink: false
                        }
                    ]}
                    rightContainer={() => (
                        <button
                            className="btn btn-soft-primary btn-sm d-flex align-items-center fw-bold"
                            onClick={() => setShowModal(true)}
                        >
                            <i class="ri-send-plane-line me-2"></i> Send Notification
                        </button>
                    )}
                />
                <ActionsTable
                    cardHeader={() => <NotificationTableHeader selectedData={selectedData} />}
                    tabelID="orgUsersTable"
                    columns={notificationAddSchema}
                    data={notificationsList}
                    allDataObj={GetAllNotificationsAPIData?.[DataKey]}
                    loading={GetAllNotificationsAPIData?.[FetchingKey]}
                    customPageSize={10}
                    divClass="table-responsive table-card ref-mgmt-table-ht"
                    tableClass="table table-borderless table-centered align-middle"
                    theadClass="default-table-header text-muted"
                    onPageChange={(p, rowsPerPage) => handlePageChange(p, rowsPerPage)}
                    emptyMessage={'no records found'}
                    tableLoader

                    // handleActionClick={handleActionClick}
                />

                {showModal && <SendNotification onCloseClick={handleModalClose} formValues={formIntialValues} />}
            </Container>
        </div>
    );
};

export default Notification;
