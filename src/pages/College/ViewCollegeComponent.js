import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import { getCollegeDetailsAPI } from '../../helpers/APIs/CommonAPIs';
import { callAPIAction } from '../../Store/callAPI/actions';
import { getCollegeDetailsAPIURL } from '../../helpers/APIs/CustomURL';
import { DataKey } from '../../Store/callAPI/allAPIs';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Col, Container, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { Divider } from '@mui/material';

const ViewCollegeComponent = () => {
    const { id } = useParams();
    const [collegeDetails, setCollegeDetails] = useState({});
    const GetCollegeDetailsApiData = useSelector((state) => SelectFullStateOfThisAPI(state, getCollegeDetailsAPI));
    const currentNavSub = useSelector((state) => SelectSearchValInStore(state, 'currentNavSub'));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));
    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));
    const permissionData = profileData?.permissionData && profileData.permissionData.find((item) => item.module.toLowerCase() === 'logs');
    const [isAccordionOpen, setAccordionOpen] = useState('');

    useEffect(() => {
        callAPIAction(getCollegeDetailsAPI, getCollegeDetailsAPIURL(id), null);
    }, []);

    useEffect(() => {
        if (GetCollegeDetailsApiData?.[DataKey]?.isSuccess) {
            const data = GetCollegeDetailsApiData?.[DataKey]?.data;
            setCollegeDetails(data);
            // console.log(')))))))', data);
        } else {
            setCollegeDetails({});
        }
    }, [GetCollegeDetailsApiData]);

    const toggleAccordion = (accordionId) => {
        if (isAccordionOpen === accordionId) {
            setAccordionOpen();
        } else {
            setAccordionOpen(accordionId);
        }
    };

    return (
        <section className="p-5 layout-cotainer">
            <Container fluid className="p-0">
                <h4 className="mt-0">College Details</h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Colleges',
                            isLink: true,
                            link: '/Colleges'
                        },
                        {
                            label: collegeDetails?._id,
                            isLink: false
                        }
                    ]}
                />
                <Row>
                    <Col>
                        <Col>
                            <p className="title-info">Name</p>
                            <p className="body-info">{collegeDetails?.collegeName || '-'}</p>
                        </Col>
                        <Col>
                            <p className="title-info">Phone Number</p>
                            <p className="body-info">{collegeDetails?.countryCode + collegeDetails?.phoneNumber || '-'}</p>
                        </Col>
                        <Col>
                            <p className="title-info">Email</p>
                            <p className="body-info">{collegeDetails?.email || '-'}</p>
                        </Col>
                    </Col>
                    <Col>
                        <Col>
                            <p className="title-info">Country</p>
                            <p className="body-info">{collegeDetails?.country || '-'}</p>
                        </Col>
                        <Col>
                            <p className="title-info">State</p>
                            <p className="body-info">{collegeDetails?.state || '-'}</p>
                        </Col>
                        <Col>
                            <p className="title-info">City</p>
                            <p className="body-info">{collegeDetails?.city || '-'}</p>
                        </Col>
                        <Col>
                            <p className="title-info">Address</p>
                            <p className="body-info">{collegeDetails?.address || '-'}</p>
                        </Col>
                    </Col>
                </Row>
                <Divider className="mb-5" />
                <Accordion open={isAccordionOpen} toggle={toggleAccordion}>
                    <AccordionItem>
                        <AccordionHeader targetId="1">University Details</AccordionHeader>
                        <AccordionBody accordionId="1"></AccordionBody>
                    </AccordionItem>
                </Accordion>
            </Container>
        </section>
    );
};

export default ViewCollegeComponent;
