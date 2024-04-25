import React, { useEffect, useState } from 'react';
import { Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { AddCustomerSchema } from '../../common/validationSchema/CustomerSchema';
import { Formik } from 'formik';
import InputComponent from '../../Components/Common/InputComponent';
import Select from 'react-select';
import { GenderList, patientTypeList } from './customerUtils';
import Flatpickr from 'react-flatpickr';
import { dateInRequireFormate } from '../../Components/Common/Util';
import { formSelectDefault } from '../../Components/constants/styles';
import { getErrorBorderForReactSelect } from '../../common/utils';
import { CreateCustomerAPI, GetCustomerAPI, UpdateCustomerAPI } from '../../helpers/APIs/CommonAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import { toast } from 'react-toastify';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { getCustomerURL, getUpdateCustomerURL } from '../../helpers/APIs/CustomURL';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';

const AddCustomer = ({ onCloseClick, isEditMode, formValues, branchList, isLead }) => {
    const CreateCustomerAPIdata = useSelector((state) => SelectFullStateOfThisAPI(state, CreateCustomerAPI));
    const updateCustomerAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateCustomerAPI));
    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));
    const [saveClicked, setSaveClicked] = useState(false);

    useEffect(() => {
        if (CreateCustomerAPIdata?.[DataKey]?.isSuccess) {
            onCloseClick();
            toast.success('Customer Created Successfully');
            removeAPIDataAction('CreateCustomerAPI');
            const queryParams = {
                page: 1,
                pageSize: 10,
                customerType: isLead ? 'lead' : 'patient'
            };
            callAPIAction(GetCustomerAPI, getCustomerURL(profileData?.branchId), null, queryParams);
        } else if (CreateCustomerAPIdata?.[ErrorKey] && !CreateCustomerAPIdata[DataKey]?.isSuccess) {
            ShowErrMsg(CreateCustomerAPIdata, 'CreateEmployeeAPI');
        }
    }, [CreateCustomerAPIdata]);

    useEffect(() => {
        if (updateCustomerAPIData?.[DataKey]?.isSuccess && saveClicked) {
            toast.success('Customer Updated Successfully');
            onCloseClick();
            removeAPIDataAction('UpdateCustomerAPI');
            const queryParams = {
                page: 1,
                pageSize: 10,
                customerType: isLead ? 'lead' : 'patient'
            };
            callAPIAction(GetCustomerAPI, getCustomerURL(profileData?.branchId), null, queryParams);
            setSaveClicked(false);
        } else if (updateCustomerAPIData?.[ErrorKey] && !updateCustomerAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(updateCustomerAPIData, 'UpdateCustomerAPI');
            setSaveClicked(false);
        }
    }, [updateCustomerAPIData]);

    const handleSave = (values) => {
        const data = {
            fullName: values.fullName,
            age: values.age,
            gender: values.gender.name,
            dob: values.dob[0],
            area: values.area,
            city: values.city,
            mobile: values.mobile,
            email: values.email,
            designation: values.designation,
            patientType: values.patientType?.name,
            branchId: values.branchId?._id
        };
        setSaveClicked(true);
        isEditMode
            ? callAPIAction(UpdateCustomerAPI, getUpdateCustomerURL(values._id), data)
            : callAPIAction(CreateCustomerAPI, null, data);
    };

    return (
        <Modal isOpen={true} toggle={onCloseClick} centered={true} size="lg">
            <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                <p className="mb-0">{`${isEditMode ? 'Update' : 'Add'} Customer`} </p>
                <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer " onClick={onCloseClick}></i>
            </ModalHeader>
            <ModalBody className="py-3 px-5">
                <Formik initialValues={formValues} validationSchema={AddCustomerSchema} onSubmit={handleSave} enableReinitialize={true}>
                    {({ setFieldValue, values, errors, handleSubmit, touched, handleBlur }) => (
                        <>
                            <Row>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Full Name
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="fullName"
                                        type="text"
                                        name="fullName"
                                        className="input-default w-60"
                                        placeholder="Select"
                                        value={values.fullName}
                                        invalid={!!errors?.fullName && touched.fullName}
                                        onChange={(e) => setFieldValue('fullName', e.target.value)}
                                        validations={['required']}
                                        title={values.fullName}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Age
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="age"
                                        type="number"
                                        name="age"
                                        className="input-default w-60"
                                        placeholder="Age"
                                        value={values.age}
                                        invalid={!!errors?.age && touched.age}
                                        onChange={(e) => setFieldValue('age', e.target.value)}
                                        validations={['required']}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="d-flex mb-4">
                                    <Label className="col-form-label w-40">
                                        Email
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="email"
                                        type="email"
                                        name="email"
                                        className="input-default w-60"
                                        placeholder="Select"
                                        value={values.email}
                                        invalid={!!errors?.email && touched.email}
                                        onChange={(e) => setFieldValue('email', e.target.value)}
                                        validations={['required']}
                                        // title={values.email}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="d-flex mb-4">
                                    <Label className="col-form-label w-40">
                                        Date of birth
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <Flatpickr
                                        id="dob"
                                        name="dob"
                                        className={`w-65 form-control ${!!errors.dob && touched.dob && 'input__error'}`}
                                        value={values.dob}
                                        onChange={(e) => {
                                            setFieldValue('dob', e?.length > 0 ? e : null);
                                        }}
                                        placeholder="dob"
                                        options={{
                                            maxDate: new Date(),
                                            formatDate: (date) => {
                                                return dateInRequireFormate(date, 'm/d/y');
                                            }
                                        }}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Gender <span className="text-danger">*</span>
                                    </Label>
                                    <Select
                                        value={values.gender}
                                        onChange={(e) => {
                                            setFieldValue('gender', e);
                                        }}
                                        className="w-65"
                                        name="gender"
                                        id="gender"
                                        options={GenderList}
                                        placeholder="Select gender"
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        styles={{
                                            ...formSelectDefault,
                                            ...getErrorBorderForReactSelect(!!errors.gender && touched.gender)
                                        }}
                                        getOptionLabel={(e) => e.name}
                                        getOptionValue={(e) => e.id}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Phone Number <span className="text-danger">*</span>
                                    </Label>

                                    <InputComponent
                                        id="mobile"
                                        type="number"
                                        name="mobile"
                                        className="input-default w-65"
                                        maxLength={10}
                                        minLength={10}
                                        placeholder="Phone Number"
                                        value={values.mobile}
                                        invalid={!!errors?.mobile && touched.mobile}
                                        onChange={(e) => {
                                            setFieldValue('mobile', e.target.value);
                                        }}
                                        validations={['required']}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Area <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="area"
                                        type="text"
                                        name="area"
                                        className="w-65"
                                        placeholder="Area"
                                        value={values.area}
                                        onChange={(e) => setFieldValue('area', e.target.value)}
                                        invalid={!!errors?.area && touched.area}
                                        validations={['required']}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Patient Type <span className="text-danger">*</span>
                                    </Label>
                                    <Select
                                        value={values.patientType}
                                        onChange={(e) => {
                                            setFieldValue('patientType', e);
                                        }}
                                        className="w-65"
                                        name="patientType"
                                        id="patientType"
                                        options={patientTypeList}
                                        placeholder="Select"
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        styles={{
                                            ...formSelectDefault,
                                            ...getErrorBorderForReactSelect(!!errors.patientType && touched.patientType)
                                        }}
                                        getOptionLabel={(e) => e.name}
                                        getOptionValue={(e) => e.id}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        City <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        type="text"
                                        name="city"
                                        id="city"
                                        className="input-default w-65"
                                        placeholder="City"
                                        value={values.city}
                                        invalid={!!errors?.city && touched.city}
                                        onChange={(e) => {
                                            setFieldValue('city', e.target.value);
                                        }}
                                        validations={['required']}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Designation <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        type="text"
                                        name="designation"
                                        id="designation"
                                        className="input-default w-65"
                                        placeholder="Designation"
                                        minLength={6}
                                        maxLength={6}
                                        value={values.designation}
                                        invalid={!!errors?.designation && touched.designation}
                                        onChange={(e) => setFieldValue('designation', e.target.value)}
                                        validations={['required']}
                                    />
                                </Col>
                                {roleData === 1 && (
                                    <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                        <Label className="col-form-label w-40">
                                            Select Branch
                                            <span className="text-danger">*</span>
                                        </Label>
                                        <Select
                                            value={values.branchId}
                                            onChange={(e) => {
                                                setFieldValue('branchId', e);
                                            }}
                                            className="w-65"
                                            name="branchId"
                                            id="branchId"
                                            options={branchList}
                                            placeholder="Select"
                                            components={{
                                                IndicatorSeparator: () => null
                                            }}
                                            styles={{
                                                ...formSelectDefault,
                                                ...getErrorBorderForReactSelect(!!errors.branchId && touched.branchId)
                                            }}
                                            getOptionLabel={(e) => e.branchName}
                                            getOptionValue={(e) => e.id}
                                        />
                                    </Col>
                                )}
                                {/* <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Customer Type <span className="text-danger">*</span>
                                    </Label>
                                    <Select
                                        value={values.gender}
                                        onChange={(e) => {
                                            setFieldValue('gender', e);
                                        }}
                                        className="w-65"
                                        name="gender"
                                        id="gender"
                                        options={CustomerType}
                                        placeholder="Select Type"
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        styles={{
                                            ...formSelectDefault,
                                            ...getErrorBorderForReactSelect(!!errors.gender && touched.gender)
                                        }}
                                        getOptionLabel={(e) => e.name}
                                        getOptionValue={(e) => e.id}
                                    />
                                </Col> */}
                            </Row>
                            <div className=" float-right d-flex">
                                <button
                                    type="button"
                                    className="btn btn-md btn-primary "
                                    data-bs-dismiss="modal"
                                    onClick={handleSubmit}
                                    disabled={CreateCustomerAPIdata?.[FetchingKey] || updateCustomerAPIData?.[FetchingKey]}
                                    id="Center Save"
                                >
                                    Save
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-md ms-3 btn-outline-primary"
                                    id="CenterCancel"
                                    // disabled={CreateCenterAPIData?.[FetchingKey] || UpdateCenterAPIData?.[FetchingKey]}
                                    onClick={onCloseClick}
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}
                </Formik>
            </ModalBody>
        </Modal>
    );
};

export default AddCustomer;
