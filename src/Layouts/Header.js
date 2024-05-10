import React from 'react';
import NotificationDropdown from '../Components/Common/NotificationDropdown';
import ProfileDropdown from '../Components/Common/ProfileDropdown';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ toggleSidebar }) => {
    return (
        <React.Fragment>
            <header id="page-topbar" className="bg-white w-100 d-flex align-items-center justify-content-between header">
                <IconButton className="ms-5" onClick={toggleSidebar}>
                    <MenuIcon color="primary" />
                </IconButton>
                <div className="d-flex align-items-center">
                    <NotificationDropdown />
                    <ProfileDropdown />
                </div>
            </header>
        </React.Fragment>
    );
};

export default Header;
