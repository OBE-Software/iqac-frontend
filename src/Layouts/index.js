import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import { useSelector } from 'react-redux';
import { SelectSearchValInStore } from '../Store/commonStore/selectors';

const Layout = (props) => {
    const userData = useSelector((state) => SelectSearchValInStore(state, 'userData'));
    // const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            {userData ? (
                <div className="layout-wrapper">
                    {isSidebarOpen && <Sidebar setterSidebar={setIsSidebarOpen} />}
                    <section className={` ${isSidebarOpen ? 'main-content' : 'main-content-full'} bg-white`}>
                        <Header toggleSidebar={toggleSidebar} />
                        {props.children}
                    </section>
                </div>
            ) : (
                props.children
            )}
        </>
    );
};

export default Layout;
