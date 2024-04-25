import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import { useSelector } from 'react-redux';
import { SelectSearchValInStore } from '../Store/commonStore/selectors';

const Layout = (props) => {
    const userData = useSelector((state) => SelectSearchValInStore(state, 'userData'));
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    return (
        <>
            {userData ? (
                <div className="layout-wrapper">
                    {isSidebarOpen ? (
                        <Sidebar setterSidebar={setIsSidebarOpen} />
                    ) : (
                        <div className="hide-sidebar-view" onClick={() => setIsSidebarOpen(true)}>
                            <SwapHorizontalCircleIcon sx={{ width: '32px', height: '32px' }} className="icon-collapsble" />
                        </div>
                    )}

                    <section className={` ${isSidebarOpen ? 'main-content' : 'main-content-full'} bg-white`}>
                        <Header />
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
