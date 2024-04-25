import React from 'react';
import { defineLordIconElement } from 'lord-icon-element';
import { ToastContainer } from 'react-toastify';
import { loadAnimation } from 'lottie-web';
import ScrollToTop from './Components/Common/ScrollToTop';
import './assets/scss/themes.scss';
import Route from './Routes';
import Loader from './pages/Errors/Loader';
import { SelectFullStateOfThisAPI } from './Store/callAPI/selectors';
import { DeleteBranchAPI, DeleteCenterAPI, DeleteRoleAPI } from './helpers/APIs/CommonAPIs';
import { useSelector } from 'react-redux';
import { FetchingKey } from './Store/callAPI/allAPIs';
import './App.css';

// register lottie and define custom element
defineLordIconElement(loadAnimation);

function App() {
    const DeleteBranchAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, DeleteBranchAPI));
    const DeleteCenterAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, DeleteCenterAPI));
    const DeleteRoleAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, DeleteRoleAPI));

    return (
        <>
            {(DeleteBranchAPIData?.[FetchingKey] || DeleteCenterAPIData?.[FetchingKey] || DeleteRoleAPIData?.[FetchingKey]) && (
                <div className="freeze-spinner">
                    <Loader />
                </div>
            )}
            <ToastContainer />
            <ScrollToTop />
            <Route />
        </>
    );
}

export default App;
