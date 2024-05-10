import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import { getUniversityDetailsAPI } from '../../helpers/APIs/CommonAPIs';
import { callAPIAction } from '../../Store/callAPI/actions';
import { getUniversityDetailsAPIURL } from '../../helpers/APIs/CustomURL';
import { DataKey } from '../../Store/callAPI/allAPIs';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Col, Container, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { Divider } from '@mui/material';

const ViewUniversityComponent = () => {
    const { id } = useParams();
    const [universityDetails, setUniversityDetails] = useState({});
    const getUniversityDetailsApiData = useSelector((state) => SelectFullStateOfThisAPI(state, getUniversityDetailsAPI));
    const currentNavSub = useSelector((state) => SelectSearchValInStore(state, 'currentNavSub'));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));
    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));
    const permissionData = profileData?.permissionData && profileData.permissionData.find((item) => item.module.toLowerCase() === 'logs');
    const [isAccordionOpen, setAccordionOpen] = useState('1');

    useEffect(() => {
        callAPIAction(getUniversityDetailsAPI, getUniversityDetailsAPIURL(id), null);
    }, []);

    useEffect(() => {
        if (getUniversityDetailsApiData?.[DataKey]?.isSuccess) {
            const data = getUniversityDetailsApiData?.[DataKey]?.data;
            setUniversityDetails(data);
            console.log(')))))))', data);
        } else {
            setUniversityDetails({});
        }
    }, [getUniversityDetailsApiData]);

    const toggleAccordion = (id) => {
        if (open === id) {
            setAccordionOpen();
        } else {
            setAccordionOpen(id);
        }
    };

    return (
        <section className="p-5 layout-cotainer">
            <Container fluid className="p-0">
                <h4 className="mt-0">University Details</h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Universities',
                            isLink: true,
                            link: '/Universities'
                        },
                        {
                            label: universityDetails?._id,
                            isLink: false
                        }
                    ]}
                />
                <Row>
                    <Col>
                        <Col>
                            <p className="title-info">Name</p>
                            <p className="body-info">{universityDetails?.universityName || '-'}</p>
                        </Col>
                        <Col>
                            <p className="title-info">Phone Number</p>
                            <p className="body-info">{universityDetails?.countryCode + universityDetails?.phoneNumber || '-'}</p>
                        </Col>
                        <Col>
                            <p className="title-info">Email</p>
                            <p className="body-info">{universityDetails?.email || '-'}</p>
                        </Col>
                    </Col>
                    <Col>
                        <Col>
                            <p className="title-info">Country</p>
                            <p className="body-info">{universityDetails?.country || '-'}</p>
                        </Col>
                        <Col>
                            <p className="title-info">State</p>
                            <p className="body-info">{universityDetails?.state || '-'}</p>
                        </Col>
                        <Col>
                            <p className="title-info">City</p>
                            <p className="body-info">{universityDetails?.city || '-'}</p>
                        </Col>
                        <Col>
                            <p className="title-info">Address</p>
                            <p className="body-info">{universityDetails?.address || '-'}</p>
                        </Col>
                    </Col>
                </Row>
                <Divider className="mb-5" />
                <Accordion open={isAccordionOpen} toggle={toggleAccordion}>
                    <AccordionItem>
                        <AccordionHeader targetId="1">University Colleges</AccordionHeader>
                        <AccordionBody accordionId="1"></AccordionBody>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionHeader targetId="2">University Employees</AccordionHeader>
                        <AccordionBody accordionId="2"></AccordionBody>
                    </AccordionItem>
                </Accordion>
            </Container>
        </section>
    );
};

export default ViewUniversityComponent;

// address: 'B-2, near Dhoon Public School, Kusum Vihar, Koyla Nagar, Dhanbad, Jharkhand 826005, India';
// city: 'Dhanbad';
// country: 'India';
// countryCode: '+91';
// createdAt: '2024-05-10T07:10:16.983Z';
// email: 'info@BBMKU.in';
// phoneNumber: '9304138016';
// state: '10';
// status: 1;
// universityColleges: [];
// universityEmployees: [];
// universityName: 'BBMKU University';
// updatedAt: '2024-05-10T07:10:16.983Z';
