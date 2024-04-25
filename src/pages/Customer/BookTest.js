import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { bookTestSchema } from '../../common/validationSchema/bookTestSchema';
import InputComponent from '../../Components/Common/InputComponent';
import MultiSelect from '../../Components/Common/MultiSelect';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import { formSelectDefault, getSelectErrorBorder, multiSelectScroll } from '../../Components/constants/styles';
import { getErrorBorderForReactSelect } from '../../common/utils';
import AddRelative from './AddRelative';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import {
    GetBranchEmployeesByBranchId,
    GetCustomerRelativesById,
    GetCustomersBookings,
    createOrderForCustomerAPI
} from '../../helpers/APIs/CommonAPIs';
import { getBranchEmployeesByBranchIdURL, getCustomerBookingsURL, getCustomerRelativesByIdURL } from '../../helpers/APIs/CustomURL';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { BookingTypesList, PaymentTypesList, phlebotomistRoleName } from '../../Components/constants/Constants';
import moment from 'moment';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import { useNavigate, useParams } from 'react-router-dom';
import { addCurrentSubNavToStore } from '../../Store/commonStore/actions';

const BookTest = ({ formValuesBookTest, onCloseClick, getAllTest, customerDetails, branchList }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [showAddRelative, setShowAddRelative] = useState(false);
    const [relativesList, setRelativesList] = useState([]);
    const [employeesList, setEmployeesList] = useState([]);
    const GetCustomerRelativesByIdData = useSelector((state) => SelectFullStateOfThisAPI(state, GetCustomerRelativesById));
    const createOrderForCustomerAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, createOrderForCustomerAPI));

    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));
    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));

    const currentNavSub = useSelector((state) => SelectSearchValInStore(state, 'currentNavSub'));
    const GetBranchEmployeesByBranchIdData = useSelector((state) => SelectFullStateOfThisAPI(state, GetBranchEmployeesByBranchId));

    let isLead = currentNavSub === 'Leads';

    useEffect(() => {
        callAPIAction(GetCustomerRelativesById, getCustomerRelativesByIdURL(customerDetails?._id));
    }, []);

    useEffect(() => {
        if (GetCustomerRelativesByIdData?.[DataKey]?.isSuccess) {
            const data = GetCustomerRelativesByIdData?.[DataKey]?.data;
            setRelativesList(data);
        } else {
            setRelativesList([]);
        }
    }, [GetCustomerRelativesByIdData]);

    useEffect(() => {
        if (GetBranchEmployeesByBranchIdData?.[DataKey]?.isSuccess) {
            const data = GetBranchEmployeesByBranchIdData?.[DataKey]?.data.filter((i) => i.roleName !== phlebotomistRoleName);
            setEmployeesList(data);
        } else {
            setEmployeesList([]);
        }
    }, [GetBranchEmployeesByBranchIdData]);

    useEffect(() => {
        if (createOrderForCustomerAPIData?.[DataKey]?.isSuccess) {
            onCloseClick();
            toast.success('Test booked Successfully');
            removeAPIDataAction('createOrderForCustomerAPI');
            if (isLead) {
                navigate('/patients/' + id);
                addCurrentSubNavToStore('Patients');
            }
            callAPIAction(GetCustomersBookings, getCustomerBookingsURL(id));
        } else if (createOrderForCustomerAPIData?.[ErrorKey] && !createOrderForCustomerAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(createOrderForCustomerAPIData, 'createOrderForCustomerAPI');
        }
    }, [createOrderForCustomerAPIData]);

    const handleSave = (values) => {
        const tests = values.tests.map((te) => te._id);
        const formData = new FormData();
        formData.append('customerId', customerDetails?._id);
        formData.append('address', values.address);
        formData.append('paymentType', values.paymentType.name);
        formData.append('bookingType', values.bookingType.id);
        formData.append('bookedOn', values.bookedOn[0]);
        // formData.append('branchId', '66169ea2600b03adb81474cb');

        //  branch id it should be dynamic--------------------->
        formData.append('branchId', values.branchId._id);
        values?.employeeId && formData.append('employeeId', values?.employeeId?._id);
        values?.patientId && formData.append('patientId', values.patient ? values.patient?._id : '');
        formData.append('tests', JSON.stringify(tests));

        values?.testPrescription && formData.append('testPrescription', values.testPrescription ? values.testPrescription : null);

        callAPIAction(createOrderForCustomerAPI, null, formData);
    };

    return (
        <>
            <Modal isOpen={true} centered={true} toggle={onCloseClick} size="lg">
                <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                    <p className="mb-0">Book Test </p>
                    <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer" onClick={onCloseClick}></i>
                </ModalHeader>
                <ModalBody className="py-3 px-5">
                    <Formik
                        initialValues={formValuesBookTest}
                        validationSchema={bookTestSchema}
                        onSubmit={handleSave}
                        enableReinitialize={true}
                    >
                        {({ setFieldValue, values, errors, handleSubmit, touched, handleBlur, submitForm }) => (
                            <Form>
                                <Row>
                                    <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                        <Label className="col-form-label w-40">
                                            Test
                                            <span className="text-danger">*</span>
                                        </Label>
                                        <MultiSelect
                                            id="tests"
                                            value={values.tests}
                                            onChange={(e) => {
                                                setFieldValue('tests', e);
                                            }}
                                            options={getAllTest}
                                            placeholder="Select"
                                            isMulti
                                            // isLoading={getCountiesByStatesAPIData?.[FetchingKey]}
                                            className="w-60 ht-fitcontent"
                                            isClearable
                                            closeMenuOnSelect={false}
                                            hideSelectedOptions={false}
                                            styles={{
                                                ...formSelectDefault,
                                                menu: (provided) => ({ ...provided, zIndex: 2 }),
                                                ...getSelectErrorBorder(!!errors.tests && touched.tests),
                                                ...multiSelectScroll(true, !!errors.tests && touched.tests)
                                            }}
                                            hideAll
                                            getOptionLabel={(e) => e.testName}
                                            getOptionValue={(e) => e._id}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="d-flex mb-4 align-items-center">
                                        <Label className="col-form-label w-40">
                                            Test for self
                                            <span className="text-danger">*</span>
                                        </Label>
                                        <InputComponent
                                            onBlur={handleBlur}
                                            className="form-check-input"
                                            type="radio"
                                            name="insuranceProgram"
                                            id={'yes'}
                                            checked={values.testFor === 'yes'}
                                            value={'yes'}
                                            onChange={(e) => {
                                                setFieldValue('testFor', e.target.value);
                                            }}
                                            invalid={errors?.insuranceProgram && touched.insuranceProgram}
                                        />
                                        <label className={'my-auto ms-2 me-4'} htmlFor={'yes'}>
                                            Yes
                                        </label>
                                        <InputComponent
                                            onBlur={handleBlur}
                                            className="form-check-input"
                                            type="radio"
                                            name="insuranceProgram"
                                            id={'no'}
                                            checked={values.testFor === 'no'}
                                            value={'no'}
                                            onChange={(e) => {
                                                setFieldValue('testFor', e.target.value);
                                            }}
                                            invalid={errors?.insuranceProgram && touched.insuranceProgram}
                                        />
                                        <label className={'my-auto ms-2 '} htmlFor={'no'}>
                                            No
                                        </label>
                                    </Col>
                                    {values.testFor === 'no' && (
                                        <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                            <Label className="col-form-label w-40">
                                                patient <span className="text-danger">*</span>
                                            </Label>
                                            <Select
                                                value={values.patient}
                                                onChange={(e) => {
                                                    setFieldValue('patient', e);
                                                }}
                                                className="w-65"
                                                name="patient"
                                                id="patient"
                                                options={relativesList}
                                                placeholder="Select"
                                                components={{
                                                    IndicatorSeparator: () => null
                                                }}
                                                styles={{
                                                    ...formSelectDefault,
                                                    ...getErrorBorderForReactSelect(!!errors.patient && touched.patient)
                                                }}
                                                getOptionLabel={(e) => e.fullName}
                                                getOptionValue={(e) => e._id}
                                                isLoading={GetCustomerRelativesByIdData?.[FetchingKey]}
                                            />
                                        </Col>
                                    )}
                                    <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                        <Label className="col-form-label w-40">
                                            Booking Type <span className="text-danger">*</span>
                                        </Label>
                                        <Select
                                            value={values.bookingType}
                                            onChange={(e) => {
                                                e.id === 1 &&
                                                    roleData !== 1 &&
                                                    callAPIAction(
                                                        GetBranchEmployeesByBranchId,
                                                        getBranchEmployeesByBranchIdURL(profileData?.branchId),
                                                        null
                                                    );
                                                setFieldValue('bookingType', e);
                                            }}
                                            className="w-65"
                                            name="bookingType"
                                            id="bookingType"
                                            options={BookingTypesList}
                                            placeholder="Select"
                                            components={{
                                                IndicatorSeparator: () => null
                                            }}
                                            styles={{
                                                ...formSelectDefault,
                                                ...getErrorBorderForReactSelect(!!errors.bookingType && touched.bookingType)
                                            }}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        />
                                    </Col>
                                    {/* {roleData?.roleName !== branchAdminRoleName && ( */}
                                    {roleData === 1 && (
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
                                                    callAPIAction(
                                                        GetBranchEmployeesByBranchId,
                                                        getBranchEmployeesByBranchIdURL(e._id),
                                                        null
                                                    );
                                                }}
                                                className="w-65"
                                                name="branchId"
                                                // isLoading={GetAllEmployeesAPIData?.[FetchingKey]}
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

                                    {values.bookingType?.id === 1 && (
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
                                                isLoading={GetBranchEmployeesByBranchIdData?.[FetchingKey]}
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
                                    )}

                                    <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                        <Label className="col-form-label w-40">
                                            Payment Type <span className="text-danger">*</span>
                                        </Label>
                                        <Select
                                            value={values.paymentType}
                                            onChange={(e) => {
                                                setFieldValue('paymentType', e);
                                            }}
                                            className="w-65"
                                            name="paymentType"
                                            id="paymentType"
                                            options={PaymentTypesList}
                                            placeholder="Select"
                                            components={{
                                                IndicatorSeparator: () => null
                                            }}
                                            styles={{
                                                ...formSelectDefault,
                                                ...getErrorBorderForReactSelect(!!errors.paymentType && touched.paymentType)
                                            }}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        />
                                    </Col>

                                    <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="d-flex mb-4">
                                        <Label className="col-form-label w-40">
                                            Appointment Date & Time <span className="text-danger">*</span>
                                        </Label>

                                        <Flatpickr
                                            id="bookedOn"
                                            className={`w-65 form-control ${!!errors.bookedOn && touched.bookedOn && 'input__error'}`}
                                            value={values.bookedOn}
                                            onChange={(e) => {
                                                setFieldValue('bookedOn', e?.length > 0 ? e : null);
                                            }}
                                            placeholder="bookedOn"
                                            options={{
                                                minDate: new Date(),
                                                enableTime: true,
                                                formatDate: (date) => moment(date).format('DD/MM/YYYY h:mm a')
                                            }}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={4} lg={12} xl={12} xxl={12} className="d-flex mb-4 ">
                                        <Label className="col-form-label w-23">
                                            Address <span className="text-danger">*</span>
                                        </Label>
                                        <InputComponent
                                            type="text"
                                            id="address"
                                            name="address"
                                            className="input-default w-100"
                                            placeholder="Address"
                                            value={values.address}
                                            maxLength={100}
                                            invalid={!!errors?.address && touched.address}
                                            onChange={(e) => setFieldValue('address', e.target.value)}
                                            validations={['required']}
                                        />
                                    </Col>

                                    <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 align-items-center">
                                        <Label className="col-form-label w-40">Test Prescription</Label>
                                        <div>
                                            <label htmlFor="upload-input" className="d-flex align-items-center w-100">
                                                <i className="ri-upload-2-line text-primary fs-18 me-1"></i>
                                                {values.testPrescription ? (
                                                    <>
                                                        <img
                                                            src={URL.createObjectURL(values.testPrescription)}
                                                            alt="Preview"
                                                            className="image-selected me-1"
                                                        />
                                                        <small>
                                                            {values.testPrescription?.name.slice(0, 14)
                                                                ? `${values.testPrescription?.name.slice(0, 14)}...`
                                                                : null}
                                                        </small>
                                                    </>
                                                ) : (
                                                    <small>No File Chosen</small>
                                                )}
                                            </label>
                                            <input
                                                type="file"
                                                id="upload-input"
                                                className="d-none"
                                                onChange={(e) => {
                                                    setFieldValue('testPrescription', e.target?.files[0]);
                                                }}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-between">
                                    {values.testFor === 'no' ? (
                                        <button
                                            type="button"
                                            className="btn btn-md btn-primary "
                                            data-bs-dismiss="modal"
                                            onClick={() => setShowAddRelative(true)}
                                            id="Center Save"
                                        >
                                            Add Relative
                                        </button>
                                    ) : (
                                        <div></div>
                                    )}

                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-md btn-primary "
                                            data-bs-dismiss="modal"
                                            onClick={submitForm}
                                            disabled={createOrderForCustomerAPIData?.[FetchingKey]}
                                            id="Center Save"
                                        >
                                            Save
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-md ms-3 btn-outline-primary"
                                            id="CenterCancel"
                                            disabled={profileData?.employeeId?.[FetchingKey]}
                                            onClick={onCloseClick}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </ModalBody>
            </Modal>
            {showAddRelative && <AddRelative onCloseClick={() => setShowAddRelative(false)} customerDetails={customerDetails} />}
        </>
    );
};

export default BookTest;
