import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import loader1 from '../../assets/images/gif/loader.gif';

const Loader = () => {
    return (
        <React.Fragment>
            <Container>
                <Row className="justify-content-center page-content">
                    <Col xl={7} lg={8}>
                        <div className="text-center">
                            <img src={loader1} alt="loader" width={'40%'} height={'40%'} />
                        </div>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default Loader;
