import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { callAPIAction } from '../../Store/callAPI/actions';
import { AddbookingToBranchAPI, GetBookingDetailsByIdAllAPI } from '../../helpers/APIs/CommonAPIs';
import { getBookingDetailsByIdURL } from '../../helpers/APIs/CustomURL';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { DataKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { CommonLoadingSkelton } from '../../Components/Common/skelton';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { dateInRequireFormate } from '../../Components/Common/Util';
import ActionsTable from '../../Components/Common/ActionsTable';
import { bookingSchema, showBookingDetailsSchema } from '../../common/data/TableSchema';
import { Stepper, Step, StepLabel } from '@mui/material';
import { getstepperStatusValue, stepsForBookinStepper } from './bookingUtils';
import AssignComponent from './AssignComponent';
import RenderRowForOrderDetailexport from './RenderRowForOrderDetail';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import { branchAdminRoleName } from '../../Components/constants/Constants';

const ViewBookingComponent = () => {
    const { bookingId } = useParams();
    const [orderData, setOrderData] = useState('');
    const [activeLable, setActiveLabel] = useState();
    const [showAssignModal, setShowAssignModal] = useState(false);
    const GetBookingDetailsByIdAllAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetBookingDetailsByIdAllAPI));
    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));

    useEffect(() => {
        callAPIAction(GetBookingDetailsByIdAllAPI, getBookingDetailsByIdURL(bookingId));
    }, []);

    useEffect(() => {
        if (GetBookingDetailsByIdAllAPIData?.[DataKey]?.isSuccess) {
            const data = GetBookingDetailsByIdAllAPIData?.[DataKey]?.data;
            setOrderData(data);
        } else {
            setOrderData([]);
        }
    }, [GetBookingDetailsByIdAllAPIData]);

    useEffect(() => {
        if (orderData.status) {
            setActiveLabel(getstepperStatusValue(orderData.status));
        }
    }, [orderData]);

    if (GetBookingDetailsByIdAllAPIData?.[FetchingKey])
        return (
            <div className="freeze-spinner">
                <CommonLoadingSkelton />
            </div>
        );

    return (
        <section className="p-5 layout-container">
            <Container fluid className="p-0">
                <h4 className="mt-3">{orderData?.orderId}</h4>
                <BreadCrumb
                    crumbs={[
                        {
                            label: 'Bookings',
                            isLink: true,
                            link: '/bookings'
                        },
                        {
                            label: orderData?.orderId,
                            isLink: false
                        }
                    ]}
                />
                <div className="px-10 pt-5">
                    <Stepper activeStep={activeLable} alternativeLabel>
                        {stepsForBookinStepper.map((label) => {
                            return (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    {/* <h4 className="mb-6 pb-2">{orderData?.testName}</h4> */}
                    <Card className="w-98 box-shadow-card mt-8">
                        <CardBody>
                            <Row>
                                <Col xs={12} sm={12} md={4} lg={4} xl={4} xxl={4} className="">
                                    <p className="text-muted mb-1 fs-14">Order Details</p>
                                    <RenderRowForOrderDetailexport title="Ordered ID" value={orderData?.orderId} />
                                    <RenderRowForOrderDetailexport title="Customer Name" value={orderData?.customer?.fullName} />
                                    <RenderRowForOrderDetailexport title="Patient Name" value={orderData?.patient?.fullName} />
                                    <RenderRowForOrderDetailexport title="Phone Number" value={orderData?.customer?.mobile} />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={4} xl={4} xxl={4} className="">
                                    <div>
                                        <p className="mb-1 text-muted fs-14">Sample Collection Address</p>
                                        <h6 className="mb-2 text-black fw-bold fs-13">{orderData?.address}</h6>
                                    </div>
                                    <div className="mt-6">
                                        <p className="text-muted fs-14 mb-1">Sample Collection Slot</p>
                                        <h6 className="text-black fw-bold fs-13">
                                            {`${dateInRequireFormate(orderData?.homeCollectionDate)} ${
                                                orderData?.sampleColletionTimings?.startTime
                                            }-${orderData?.sampleColletionTimings?.endTime}`}
                                        </h6>
                                    </div>
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={4} xl={4} xxl={4} className=" d-flex justify-content-center flex-column">
                                    <div>
                                        <p className="mb-1 text-muted fs-14">Service Type</p>
                                        <h6 className="mb-1 text-black fw-bold fs-13">{orderData?.address}</h6>
                                    </div>
                                    <div className="mt-6">
                                        <p className="mb-1 text-muted fs-14">Booked On</p>
                                        <h6 className="mb-1 text-black fw-bold fs-13">{dateInRequireFormate(orderData?.createdAt)}</h6>
                                    </div>
                                </Col>
                            </Row>
                            <div className="pt-5 mt-5">
                                <ActionsTable
                                    tabelID="orgUsersTable"
                                    columns={showBookingDetailsSchema}
                                    data={
                                        orderData?.test?.length
                                            ? orderData?.test?.map((te, idx) => {
                                                  return { ...te, slno: idx + 1, testAmount: '₹ ' + te.testAmount };
                                              })
                                            : []
                                    }
                                    customPageSize={10}
                                    divClass="table-responsive table-card ref-mgmt-table-ht"
                                    tableClass="table table-borderless table-centered align-middle"
                                    theadClass="default-table-header text-muted"
                                />
                                {/* //////////// */}
                                <div className="d-flex justify-content-end">
                                    <div className="">
                                        <p className="me-4">Sub Total</p>
                                        <p>Tax</p>
                                        <p>Discount</p>
                                    </div>
                                    <div>
                                        <p className="me-4">:</p>
                                        <p className="me-4">:</p>
                                        <p className="me-4">:</p>
                                    </div>
                                    <div>
                                        <p className="me-4 fw-bold ">₹ {orderData?.subTotalAmount}</p>
                                        <p className="fw-bold ">₹ {orderData?.gst}</p>
                                        <p className="fw-bold ">₹ {orderData?.discount}</p>
                                    </div>
                                </div>
                                {/* ///// GRAND TOTAL //////// */}

                                <div className="d-flex justify-content-end align-items-center py-3 ">
                                    <p className="pe-4 py-2 ps-2 mb-0 bg-soft-info ">Grand Total</p>
                                    <p className="pe-4 mb-0 py-2 bg-soft-info ">:</p>
                                    <p className="pe-4 mb-0 fw-bold bg-soft-info py-2">₹ {orderData?.totalAmount}</p>
                                </div>
                            </div>
                            {orderData?.status === 3 && roleData?.roleName !== branchAdminRoleName && (
                                <div className="d-flex justify-content-center">
                                    <button
                                        type="button"
                                        className="btn btn-md btn-primary "
                                        data-bs-dismiss="modal"
                                        onClick={() => setShowAssignModal(true)}
                                    >
                                        Assign branch
                                    </button>
                                </div>
                            )}
                            {orderData?.status === 4 && roleData?.roleName === branchAdminRoleName && (
                                <div className="d-flex justify-content-center">
                                    <button
                                        type="button"
                                        className="btn btn-md btn-primary "
                                        data-bs-dismiss="modal"
                                        onClick={() => setShowAssignModal(true)}
                                    >
                                        Assign Phematalogist
                                    </button>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
                {showAssignModal && (
                    <AssignComponent bookingId={bookingId} onCloseClick={() => setShowAssignModal(false)} orderData={orderData} />
                )}
            </Container>
        </section>
    );
};

export default ViewBookingComponent;
