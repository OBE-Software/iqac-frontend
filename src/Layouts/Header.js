import React from 'react';
import NotificationDropdown from '../Components/Common/NotificationDropdown';
import ProfileDropdown from '../Components/Common/ProfileDropdown';

const Header = ({ headerClass }) => {
    return (
        <React.Fragment>
            <header id="page-topbar" className="bg-white w-100 d-flex justify-content-end header">
                <div className="d-flex align-items-center">
                    <NotificationDropdown />
                    <ProfileDropdown />
                </div>
            </header>
        </React.Fragment>
    );
};

export default Header;
