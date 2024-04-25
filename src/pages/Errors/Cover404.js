import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

// Import Images
import error400cover from '../../assets/images/error400-cover.png';
import { allRoutesOfApplication } from '../../Routes/allRoutes';
import { addCurrentNavToStore, addCurrentSubNavToStore } from '../../Store/commonStore/actions';

const Cover404 = () => {
    const { pathname } = useLocation();

    const isOurRoute = allRoutesOfApplication().find((route) => route.path === pathname);

    return (
        <div className="layout-container d-flex align-items-center justify-content-center">
            <Container>
                <Row className="justify-content-center">
                    {isOurRoute ? (
                        <Col xl={12} lg={12}>
                            <div className="text-center w-100">
                                {/* <img src={error400cover} alt="error img" className="img-fluid" /> */}
                                <div className="mt-3">
                                    <h3 className="text-uppercase mb-4"> Your not authorized 😎😎</h3>
                                    {/* <p className="text-muted mb-4">{t('notAvail')}</p> */}
                                    <Link
                                        to="/workspace"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            addCurrentNavToStore('Dashboard');
                                            addCurrentSubNavToStore('');
                                        }}
                                    >
                                        <i className="mdi mdi-home me-1"></i>
                                        Back To Home
                                    </Link>
                                </div>
                            </div>
                        </Col>
                    ) : (
                        <Col xl={7} lg={8}>
                            <div className="text-center">
                                <img src={error400cover} alt="error img" className="img-fluid" />
                                <div className="mt-3">
                                    <h3 className="text-uppercase">Page Not Found 😎😎</h3>
                                    <p className="text-muted mb-4">Not Available</p>
                                    <Link
                                        to="/dashboard"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            addCurrentNavToStore('Dashboard');
                                            addCurrentSubNavToStore('');
                                        }}
                                    >
                                        <i className="mdi mdi-home me-1"></i>
                                        Back To Home
                                    </Link>
                                </div>
                            </div>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    );
};

export default Cover404;
