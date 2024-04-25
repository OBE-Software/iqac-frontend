import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../Layouts/index';
import { allRoutesOfApplication } from './allRoutes';
import { useSelector } from 'react-redux';
import { SelectSearchValInStore } from '../Store/commonStore/selectors';
import { useNavigate } from 'react-router';

const Index = () => {
    const navigate = useNavigate();
    const userData = useSelector((state) => SelectSearchValInStore(state, 'userData'));
    // useEffect(() => {
    //     if (!userData) {
    //         navigate('/login');
    //     }
    // }, [userData]);

    return (
        <Layout>
            <Routes>
                {allRoutesOfApplication(userData).map(({ path, Component }) => (
                    <Route path={path} element={<Component />} />
                ))}
            </Routes>
        </Layout>
    );
};

export default Index;
