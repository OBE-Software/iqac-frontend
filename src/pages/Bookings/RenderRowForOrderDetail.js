import React from 'react';
import { Col, Row } from 'reactstrap';

const RenderRowForOrderDetailexport = ({ title, value }) => (
    <Row>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="">
            <p className="mb-1 text-muted fs-14">{title}</p>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="">
            <h6 className="mb-1 text-black fs-13">
                <span className="me-3">:</span> {value ? value : 'NA'}
            </h6>
        </Col>
    </Row>
);
export default RenderRowForOrderDetailexport;
