import React from 'react';
import { Container, Row } from 'reactstrap';
import noentry from '../../assets/images/gif/no-entry.gif';
import { useTrans } from '../../Components/Hooks/UserHooks';

const BrowserError = ({ error, errorInfo }) => {
    const t = useTrans('translation');

    return (
        <React.Fragment>
            <div className="auth-page-content">
                <div className="auth-page-wrapper py-5 d-flex justify-content-center align-items-center min-vh-100">
                    <div className="auth-page-content overflow-hidden p-0">
                        <Container>
                            <Row className="justify-content-center">
                                <div className="text-center">
                                    <img src={noentry} alt="no entry"/>

                                    <h1 id="unsupportBrowser">{t('unsupportBrowser')}</h1>

                                    <div className="mt-3" id="browserHelpText">
                                        <p className="mx-auto fs-16">{t('browserHelpText')}</p>
                                    </div>
                                </div>
                            </Row>
                        </Container>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default BrowserError;
