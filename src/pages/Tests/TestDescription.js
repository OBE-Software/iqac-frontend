import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AddCkEditorPoints } from './PrepareAddpointsComponent';
import { GetAllTestsWithoutParamsAPI, GetTestDetailsByIdAPI, getTestDescriptionByIdAPI } from '../../helpers/APIs/CommonAPIs';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { callAPIAction } from '../../Store/callAPI/actions';
import { DataKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { useSelector } from 'react-redux';
import { getTestDescriptionIdURL, getTestDetailsByIdURL } from '../../helpers/APIs/CustomURL';
import { useParams } from 'react-router-dom';
import { CommonLoadingSkelton } from '../../Components/Common/skelton';

const TestDescription = () => {
    const { testId } = useParams();
    const [testData, setTestData] = useState('');
    const GetTestDetailsByIdAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetTestDetailsByIdAPI));
    useEffect(() => {
        callAPIAction(GetTestDetailsByIdAPI, getTestDescriptionIdURL(testId));
    }, []);

    useEffect(() => {
        if (GetTestDetailsByIdAPIData?.[DataKey]?.isSuccess) {
            const data = GetTestDetailsByIdAPIData?.[DataKey]?.data;
            setTestData(data);
        } else {
            setTestData([]);
        }
    }, [GetTestDetailsByIdAPIData]);

    if (GetTestDetailsByIdAPIData?.[FetchingKey])
        return (
            <div className="freeze-spinner">
                <CommonLoadingSkelton />
            </div>
        );

    return (
        <div className="p-5 layout-container">
            <Container fluid className="p-0">
                <h4 className="mt-0">Test Description</h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Test Description',
                            isLink: false
                        }
                    ]}
                />
                <div className="px-2">
                    <h4 className="mb-6 pb-2">{testData?.testName}</h4>
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
                            <Row className="mb-3">
                                <Col xs={6} sm={6} md={3} lg={3} xl={3} xxl={3} className="fs-16 text-muted">
                                    No.of tests
                                </Col>
                                <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="fs-16 text-muted">
                                    :
                                </Col>
                                <Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={4} className="fs-16 text-black">
                                    {testData?.subTests?.length > 0 ? `${testData.subTests.length} tests` : 'Na'}
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col xs={6} sm={6} md={3} lg={3} xl={3} xxl={3} className="fs-16 text-muted">
                                    Samples required
                                </Col>
                                <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="fs-16 text-muted">
                                    :
                                </Col>
                                <Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={4} className="fs-16 text-black">
                                    {testData?.testSamples?.length > 0
                                        ? testData?.testSamples.map((sample) => <p className="mb-1">{sample}</p>)
                                        : 'NA'}
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col xs={6} sm={6} md={3} lg={3} xl={3} xxl={3} className="fs-16 text-muted">
                                    Price
                                </Col>
                                <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="fs-16 text-muted">
                                    :
                                </Col>
                                <Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={4} className="fs-16 text-black">
                                    ₹ {testData?.testAmount}
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
                            <Row className="mb-3">
                                <Col xs={6} sm={6} md={3} lg={3} xl={3} xxl={3} className="fs-16 text-muted">
                                    Preparations
                                </Col>
                                <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="fs-16 text-muted">
                                    :
                                </Col>
                                <Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={4} className="fs-16 text-black">
                                    {testData?.preparations?.length > 0
                                        ? testData?.preparations.map((sample) => <p className="mb-1">{sample}</p>)
                                        : 'NA'}
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col xs={6} sm={6} md={3} lg={3} xl={3} xxl={3} className="fs-16 text-muted">
                                    Recommended for
                                </Col>
                                <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} className="fs-16 text-muted">
                                    :
                                </Col>
                                <Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={4} className="fs-16 text-black">
                                    {testData?.recommendedFor ? testData?.recommendedFor : 'NA'}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <div className="mt-7">
                        <h4>{testData.testName} test overview</h4>
                        {testData.testDescription ? (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: testData.testDescription
                                }}
                            />
                        ) : (
                            <p className="mt-3 ms-3 fs-16">No overview available. `</p>
                        )}
                    </div>
                    {!!testData?.testIncluded?.length && (
                        <div className="mt-7">
                            <h4>Test Included</h4>
                            <ul>
                                {testData?.testIncluded?.map((te) => (
                                    <li className="fs-15">{te}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default TestDescription;
