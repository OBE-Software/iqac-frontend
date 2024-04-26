import React, { useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

import { useTrans } from '../Hooks/UserHooks';

import { logoutAction } from '../../Store/callAPI/actions';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import { useSelector } from 'react-redux';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const ProfileDropdown = () => {
    const navigate = useNavigate();

    // Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const userData = useSelector((state) => SelectSearchValInStore(state, 'userData'));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));

    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };
    let welComeName = profileData?.roleData === 1 ? `${profileData?.firstName} ${profileData?.lastName}` : profileData?.employeeName;

    return (
        <React.Fragment>
            <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="mb-0 header-item topbar-user" id="profileSelect">
                <DropdownToggle tag="button" type="button" className="btn">
                    <span className="d-flex align-items-center">
                        <div className="avatar-group-item">
                            <div className="avatar-xs">
                                <div className="avatar-title rounded-circle text-light">
                                    {/* {userData?.profileData?.roleData === 1 */}
                                    {profileData?.roleData !== 1
                                        ? profileData?.employeeName?.split(' ')?.length === 2
                                            ? profileData?.employeeName?.split(' ')[0][0].toLocaleUpperCase() +
                                              profileData?.employeeName?.split(' ')[1][0].toLocaleUpperCase()
                                            : profileData?.employeeName?.split(' ')[0][0].toLocaleUpperCase()
                                        : `${profileData?.firstName && profileData?.firstName[0]?.toLocaleUpperCase()}${
                                              profileData?.lastName && profileData?.lastName[0]?.toLocaleUpperCase()
                                          }`}
                                </div>
                            </div>
                        </div>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    <h6 className="dropdown-header">Welcome {welComeName}</h6>
                    <DropdownItem
                        onClick={() => {
                            // history.push('/');
                            navigate('/profile');
                        }}
                        className="d-flex align-items-center justify-content-between"
                    >
                        <span className="align-middle" data-key="t-logout">
                            Profile
                        </span>
                        {/* <i className="ri-logout-box-r-line text-muted fs-16 align-middle me-1"></i> */}
                        <AccountCircleOutlinedIcon />
                    </DropdownItem>
                    <DropdownItem
                        onClick={() => {
                            // history.push('/');
                            navigate('/login');
                            logoutAction();
                        }}
                        className="d-flex align-items-center justify-content-between"
                    >
                        <span className="align-middle" data-key="t-logout">
                            Logout
                        </span>
                        <LogoutOutlinedIcon />
                        {/* <i className="ri-logout-box-r-line text-muted fs-16 align-middle me-1"></i> */}
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;
