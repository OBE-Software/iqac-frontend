import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { addCurrentNavToStore, addCurrentSubNavToStore } from '../../Store/commonStore/actions';
import { updateActiveNavInSidebar } from '../../pages/Login/loginUtil';

const BreadCrumb = ({ pageTitle, rightContainer, crumbs }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = (crum) => {
        navigate(crum?.link);
    };
    useEffect(() => {
        updateActiveNavInSidebar(location, addCurrentNavToStore, addCurrentSubNavToStore);
    }, [location]);

    return (
        <React.Fragment>
            <Row>
                <Col xs={12}>
                    <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <i
                                class="ri-home-2-fill text-black cursor-pointer"
                                onClick={() => {
                                    navigate('/dashboard');
                                    addCurrentNavToStore('Dashboard');
                                    addCurrentSubNavToStore('');
                                }}
                            ></i>
                            {crumbs?.length > 0 &&
                                crumbs?.map((crum) => (
                                    <>
                                        <p className={`${crum.isLink ? 'text-black' : 'text-muted'} mb-0 fw-bold fs-16 mx-2`}>{'>'}</p>
                                        <p
                                            className={`${crum.isLink ? 'cursor-pointer text-black fw-bold' : 'text-muted'} mb-0 `}
                                            onClick={() => {
                                                crum.isLink && handleClick(crum);
                                            }}
                                        >
                                            {crum.label}
                                        </p>
                                    </>
                                ))}
                        </div>
                        {rightContainer && rightContainer()}
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default BreadCrumb;
