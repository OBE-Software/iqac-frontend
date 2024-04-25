import React, { useEffect, useState } from 'react';
import { Badge, Col, Dropdown, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';

import { callAPIAction } from '../../Store/callAPI/actions';

import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import { useSelector } from 'react-redux';
import { countBy } from 'lodash';
import NotificationItem from './NotificatoinItem';
import { getGeneralNotificationAllAPi } from '../../helpers/APIs/CommonAPIs';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { getGenralNotificationByBranchIdURL } from '../../helpers/APIs/CustomURL';
import { branchAdminRoleName } from '../constants/Constants';

const NotificationDropdown = () => {
    const allRolesData = useSelector((state) => SelectSearchValInStore(state, 'allRolesData'));
    let userid = allRolesData?.length > 0 ? allRolesData[0]?.userID || 0 : 0;

    const [markAllAsRead, setMarkAllAsRead] = useState(false);

    const getAllGeneralNotificationAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, getGeneralNotificationAllAPi));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));
    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));

    useEffect(() => {
        roleData?.roleName === branchAdminRoleName
            ? callAPIAction(getGeneralNotificationAllAPi, getGenralNotificationByBranchIdURL(profileData?._id), null, null)
            : callAPIAction(getGeneralNotificationAllAPi, getGenralNotificationByBranchIdURL(profileData?._id), null, null);
    }, []);

    // Dropdown Toggle
    const [isNotificationDropdown, setIsNotificationDropdown] = useState(false);
    const [allNotificationList, setAllNotificationList] = useState([]);

    const toggleNotificationDropdown = () => {
        setIsNotificationDropdown(!isNotificationDropdown);
    };

    const handleMarkAllAsRead = () => {
        setMarkAllAsRead(true);
    };

    return (
        <React.Fragment>
            <Dropdown
                isOpen={isNotificationDropdown}
                toggle={toggleNotificationDropdown}
                className="topbar-head-dropdown header-item me-3 mb-0 bg-white"
                id="notifSelect"
            >
                <DropdownToggle type="button" tag="button" className="btn btn-soft-primary btn-icon btn-sm sm-btn">
                    <i className="ri-notification-3-line fs-22"></i>
                    <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
                        {/* 3<span className="visually-hidden">unread messages</span> */}
                    </span>

                    <Badge color="danger" className="notification-badge">
                        {/* {`${countBy(allNotificationList, 'isRead').false}`} */}2
                    </Badge>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                    <div className="dropdown-head bg-primary bg-pattern rounded-top">
                        <div className="p-3">
                            <Row className="align-items-center">
                                <Col>
                                    <h6 className="m-0 fs-16 fw-semibold text-white"> Notifications</h6>
                                </Col>
                                <div className="col-auto dropdown-tabs">
                                    {/* <span className="badge badge-soft-light fs-13"> 4 New</span> */}
                                </div>
                            </Row>
                        </div>
                    </div>
                    {!allNotificationList.length ? (
                        <p className="text-muted p-4 pb-0">No Notifications</p>
                    ) : (
                        <>
                            <SimpleBar className="pe-2 mh-20 notification-container">
                                {allNotificationList.map((notification) => {
                                    return (
                                        <NotificationItem
                                            notification={notification}
                                            toggleNotificationDropdown={toggleNotificationDropdown}
                                            isPreview
                                            key={notification.notificationId}
                                            markAllAsRead={markAllAsRead}
                                        />
                                    );
                                })}
                            </SimpleBar>
                            <div className="my-3 text-center">
                                <button type="button" className="btn btn-link" onClick={handleMarkAllAsRead}>
                                    Mark all as read
                                </button>
                            </div>
                            <div className="my-3 text-center">
                                <Link to="/notifications" onClick={toggleNotificationDropdown}>
                                    <button type="button" className="btn btn-soft-success waves-effect waves-light">
                                        View All Notifications <i className="ri-arrow-right-line align-middle"></i>
                                    </button>
                                </Link>
                            </div>
                        </>
                    )}
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default NotificationDropdown;
