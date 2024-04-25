import React from 'react';
import { Col, Container, Row } from 'reactstrap';

// Import Images
import error500 from '../../assets/images/error500.png';

const Error500 = ({ error, errorInfo }) => {
    return (
        <React.Fragment>
            <Container fluid={true}>
                <Row className="justify-content-center page-content">
                    <Col xl={6} className="text-center">
                        <div className="error-500 position-relative">
                            <img src={error500} alt="" className="img-fluid error-500-img error-img" />
                            <h1 className="title text-muted">500</h1>
                        </div>
                        <div>
                            {/* <h3>{t('ise')}</h3> */}
                            <p className="text-muted w-75 mx-auto">Try Again</p>
                            <details>
                                {error && error.toString()}
                                <br />
                                {errorInfo.componentStack}
                            </details>
                        </div>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default Error500;
