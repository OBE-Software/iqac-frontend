import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Col, Label, Modal, ModalBody, ModalHeader } from 'reactstrap';
import RenderRowForOrderDetailexport from './RenderRowForOrderDetail';
import { AddBookingToBranchSchema } from '../../common/validationSchema/bookingSchema';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import {
    AddbookingToBranchAPI,
    AddbookingToPhlebotomistAPI,
    GetAllBranchesAPI,
    GetBookingDetailsByIdAllAPI,
    GetBranchEmployeesByBranchId
} from '../../helpers/APIs/CommonAPIs';
import { getErrorBorderForReactSelect } from '../../common/utils';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { formSelectDefault } from '../../Components/constants/styles';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import { getBookingDetailsByIdURL, getBranchEmployeesByBranchIdURL } from '../../helpers/APIs/CustomURL';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import { branchAdminRoleName, phlebotomistRoleName } from '../../Components/constants/Constants';

const AssignComponent = ({ onCloseClick, orderData, bookingId }) => {
    const [branchList, setBranchList] = useState([]);
    const [employeesList, setEmployeesList] = useState([]);

    const GetAllBranchesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllBranchesAPI));
    const AddbookingToBranchAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, AddbookingToBranchAPI));
    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));

    const GetBranchEmployeesByBranchIdData = useSelector((state) => SelectFullStateOfThisAPI(state, GetBranchEmployeesByBranchId));
    const AddbookingToPhlebotomistAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, AddbookingToPhlebotomistAPI));

    useEffect(() => {
        roleData?.roleName === branchAdminRoleName &&
            callAPIAction(GetBranchEmployeesByBranchId, getBranchEmployeesByBranchIdURL(profileData?.branchId), null);
    }, []);

    useEffect(() => {
        if (GetAllBranchesAPIData?.[DataKey]?.isSuccess) {
            const data = GetAllBranchesAPIData?.[DataKey]?.data;
            setBranchList(data);
        } else {
            setBranchList([]);
        }
    }, [GetAllBranchesAPIData]);

    useEffect(() => {
        if (GetBranchEmployeesByBranchIdData?.[DataKey]?.isSuccess) {
            const data = GetBranchEmployeesByBranchIdData?.[DataKey]?.data.filter((i) => i.roleName === phlebotomistRoleName);
            setEmployeesList(data);
        } else {
            setEmployeesList([]);
        }
    }, [GetBranchEmployeesByBranchIdData]);

    useEffect(() => {
        if (AddbookingToBranchAPIData?.[DataKey]?.isSuccess) {
            onCloseClick();
            toast.success('Assigned branch Successfully');
            removeAPIDataAction('AddbookingToBranchAPI');
            callAPIAction(GetBookingDetailsByIdAllAPI, getBookingDetailsByIdURL(bookingId));
        } else if (AddbookingToBranchAPIData?.[ErrorKey] && !AddbookingToBranchAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(AddbookingToBranchAPIData, 'AddbookingToBranchAPI');
        }
    }, [AddbookingToBranchAPIData]);

    useEffect(() => {
        if (AddbookingToPhlebotomistAPIData?.[DataKey]?.isSuccess) {
            onCloseClick();
            toast.success('Assigned phlebotomist successfully');
            removeAPIDataAction('AddbookingToPhlebotomistAPI');
            callAPIAction(GetBookingDetailsByIdAllAPI, getBookingDetailsByIdURL(bookingId));
        } else if (AddbookingToPhlebotomistAPIData?.[ErrorKey] && !AddbookingToPhlebotomistAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(AddbookingToPhlebotomistAPIData, 'AddbookingToPhlebotomistAPI');
        }
    }, [AddbookingToPhlebotomistAPIData]);

    const handleSave = (values) => {
        roleData?.roleName === branchAdminRoleName
            ? callAPIAction(AddbookingToPhlebotomistAPI, null, { orderId: orderData._id, employeeId: values.employeeId?._id })
            : callAPIAction(AddbookingToBranchAPI, null, { orderId: orderData._id, branchId: values.branchId?._id });
    };

    return (
        <Modal isOpen={true} centered={true} size="lg" toggle={onCloseClick}>
            <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                <p className="mb-0">{roleData?.roleName === branchAdminRoleName ? 'Assign Phlematalogist' : 'Assign Branch'} </p>
                <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer " onClick={onCloseClick}></i>
            </ModalHeader>

            <ModalBody className="py-3 px-5">
                <div>
                    <RenderRowForOrderDetailexport title="Ordered ID" value={orderData?.orderId} />
                    <RenderRowForOrderDetailexport title="Customer Name" value={orderData?.customer?.fullName} />
                    <RenderRowForOrderDetailexport title="Phone Number" value={orderData?.customer?.mobile} />
                    <RenderRowForOrderDetailexport title="Sample Collection Address" value={orderData?.address} />
                </div>
                <Formik
                    initialValues={{ branchId: '', employeeId: '' }}
                    onSubmit={handleSave}
                    enableReinitialize={true}
                    validationSchema={AddBookingToBranchSchema(roleData?.roleName)}
                    className="border-1 border-top"
                >
                    {({ setFieldValue, values, errors, handleSubmit, touched, handleBlur }) => (
                        <div className="border-1 border-top my-4 py-4">
                            {roleData?.roleName === branchAdminRoleName ? (
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Phlematalogist
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <Select
                                        id="employeeId"
                                        value={values.employeeId}
                                        onChange={(e) => {
                                            setFieldValue('employeeId', e);
                                        }}
                                        className="w-65"
                                        name="employeeId"
                                        isLoading={GetAllBranchesAPIData?.[FetchingKey]}
                                        options={employeesList}
                                        placeholder="Select Phlematalogist"
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        styles={{
                                            ...formSelectDefault,
                                            ...getErrorBorderForReactSelect(!!errors.employeeId && touched.employeeId)
                                        }}
                                        isClearable
                                        getOptionLabel={(e) => e.employeeName}
                                        getOptionValue={(e) => e._id}
                                    />
                                </Col>
                            ) : (
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Branch
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <Select
                                        id="branchId"
                                        value={values.branchId}
                                        onChange={(e) => {
                                            setFieldValue('branchId', e);
                                        }}
                                        className="w-65"
                                        name="branchId"
                                        isLoading={GetAllBranchesAPIData?.[FetchingKey]}
                                        options={branchList}
                                        placeholder="Select Branch"
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        styles={{
                                            ...formSelectDefault,
                                            ...getErrorBorderForReactSelect(!!errors.branchId && touched.branchId)
                                        }}
                                        isClearable
                                        getOptionLabel={(e) => e.branchName}
                                        getOptionValue={(e) => e._id}
                                    />
                                </Col>
                            )}

                            <div className=" float-right d-flex">
                                <button
                                    type="button"
                                    className="btn btn-md btn-primary "
                                    data-bs-dismiss="modal"
                                    onClick={handleSubmit}
                                    disabled={AddbookingToBranchAPIData?.[FetchingKey] || AddbookingToPhlebotomistAPIData?.[FetchingKey]}
                                >
                                    Save
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-md ms-3 btn-outline-primary"
                                    id="medsCancel"
                                    onClick={onCloseClick}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </Formik>
            </ModalBody>
        </Modal>
    );
};

export default AssignComponent;
