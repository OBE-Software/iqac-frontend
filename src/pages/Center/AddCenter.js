import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { AddCenterSchema } from '../../common/validationSchema';
import InputComponent from '../../Components/Common/InputComponent';
import Select from 'react-select';
import { formSelectDefault } from '../../Components/constants/styles';
import { getErrorBorderForReactSelect } from '../../common/utils';
import { GenderList, indianStatesWithId, isHomeBranchList, prepareCreateCenterObj } from './centerUtils';
import { CreateCenterAPI, GetAllCentersAPI, UpdateCenterAPI } from '../../helpers/APIs/CommonAPIs';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import { getUpdateCenterhURL } from '../../helpers/APIs/CustomURL';

const AddCenter = ({ onCloseClick, formValues, isEditMode }) => {
    const CreateCenterAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, CreateCenterAPI));
    const UpdateCenterAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateCenterAPI));

    useEffect(() => {
        if (CreateCenterAPIData?.[DataKey]?.isSuccess) {
            onCloseClick();
            toast.success('Branch Created Successfully');
            removeAPIDataAction('CreateCenterAPI');
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            callAPIAction(GetAllCentersAPI, null, null, queryParams);
        } else if (CreateCenterAPIData?.[ErrorKey] && !CreateCenterAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(CreateCenterAPIData, 'CreateCenterAPI');
        }
    }, [CreateCenterAPIData]);

    useEffect(() => {
        if (UpdateCenterAPIData?.[DataKey]?.isSuccess) {
            toast.success('Center Updated Successfully');
            onCloseClick();
            removeAPIDataAction('UpdateCenterAPI');
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            callAPIAction(GetAllCentersAPI, null, null, queryParams);
        } else if (UpdateCenterAPIData?.[ErrorKey] && !UpdateCenterAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateCenterAPIData, 'UpdateCenterAPI');
        }
    }, [UpdateCenterAPIData]);

    const handleSave = (values) => {
        isEditMode
            ? callAPIAction(UpdateCenterAPI, getUpdateCenterhURL(values._id), prepareCreateCenterObj(values))
            : callAPIAction(CreateCenterAPI, null, prepareCreateCenterObj(values));
    };

    return (
        <Modal isOpen={true} toggle={onCloseClick} centered={true} size="lg">
            <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                <p className="mb-0">{`${isEditMode ? 'Update' : 'Add'} Center`} </p>
                <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer " onClick={onCloseClick}></i>
            </ModalHeader>

            <ModalBody className="py-3 px-5">
                <Formik initialValues={formValues} validationSchema={AddCenterSchema} onSubmit={handleSave}>
                    {({ setFieldValue, values, errors, handleSubmit, touched, handleBlur }) => (
                        <>
                            <Row>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Center Name
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="centerName"
                                        type="text"
                                        name="centerName"
                                        className="input-default w-60"
                                        placeholder="Select"
                                        value={values.centerName}
                                        invalid={!!errors?.centerName && touched.centerName}
                                        onChange={(e) => setFieldValue('centerName', e.target.value)}
                                        validations={['required']}
                                        title={values.centerName}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Email
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="emailPro"
                                        type="email"
                                        name="loginID"
                                        className="input-default w-60"
                                        placeholder="Email ID"
                                        value={values.email}
                                        invalid={!!errors?.email && touched.email}
                                        onChange={(e) => setFieldValue('email', e.target.value)}
                                        validations={['required']}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="d-flex mb-4">
                                    <Label className="col-form-label w-40">
                                        First Name
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="firstName"
                                        type="text"
                                        name="firstName"
                                        className="input-default w-60"
                                        placeholder="Select"
                                        value={values.firstName}
                                        invalid={!!errors?.firstName && touched.firstName}
                                        onChange={(e) => setFieldValue('firstName', e.target.value)}
                                        validations={['required']}
                                        title={values.firstName}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="d-flex mb-4">
                                    <Label className="col-form-label w-40">
                                        Last Name
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="lastName"
                                        type="text"
                                        name="lastName"
                                        className="input-default w-60"
                                        placeholder="Select"
                                        value={values.lastName}
                                        invalid={!!errors?.lastName && touched.lastName}
                                        onChange={(e) => setFieldValue('lastName', e.target.value)}
                                        validations={['required']}
                                        title={values.lastName}
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
                                        placeholder="Select"
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
                                        id="phoneNumber"
                                        type="number"
                                        name="phoneNumber"
                                        className="input-default w-65"
                                        maxLength={10}
                                        minLength={10}
                                        placeholder="Phone Number"
                                        value={values.phoneNumber}
                                        invalid={!!errors?.phoneNumber && touched.phoneNumber}
                                        onChange={(e) => {
                                            setFieldValue('phoneNumber', e.target.value);
                                        }}
                                        validations={['required']}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Address <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        type="text"
                                        id="address"
                                        name="address"
                                        className="input-default w-65"
                                        placeholder="Address"
                                        value={values.area}
                                        maxLength={100}
                                        invalid={!!errors?.area && touched.area}
                                        onChange={(e) => setFieldValue('area', e.target.value)}
                                        validations={['required']}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        State <span className="text-danger">*</span>
                                    </Label>
                                    <Select
                                        value={values.state}
                                        onChange={(e) => {
                                            setFieldValue('state', e);
                                        }}
                                        className="w-65"
                                        name="state"
                                        id="state"
                                        options={indianStatesWithId}
                                        placeholder="Select"
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        styles={{
                                            ...formSelectDefault,
                                            ...getErrorBorderForReactSelect(!!errors.state && touched.state)
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
                                        onChange={(e) => setFieldValue('city', e.target.value)}
                                        validations={['required']}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Pin Code <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        type="number"
                                        name="pinCode"
                                        id="pinCode"
                                        className="input-default w-65"
                                        placeholder="Pin Code"
                                        minLength={6}
                                        maxLength={6}
                                        value={values.pinCode}
                                        invalid={!!errors?.pinCode && touched.pinCode}
                                        onChange={(e) => setFieldValue('pinCode', e.target.value)}
                                        validations={['required']}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Home Branch
                                        {/* <span className="text-danger">*</span> */}
                                    </Label>
                                    <Select
                                        value={values.isHomeBranch}
                                        onChange={(e) => {
                                            setFieldValue('isHomeBranch', e);
                                        }}
                                        className="w-65"
                                        name="isHomeBranch"
                                        id="isHomeBranch"
                                        options={isHomeBranchList}
                                        placeholder="Select"
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        styles={{
                                            ...formSelectDefault,
                                            ...getErrorBorderForReactSelect(!!errors.isHomeBranch && touched.isHomeBranch)
                                        }}
                                        getOptionLabel={(e) => e.name}
                                        getOptionValue={(e) => e.id}
                                    />
                                </Col>
                            </Row>
                            <div className=" float-right d-flex">
                                <button
                                    type="button"
                                    className="btn btn-md btn-primary "
                                    data-bs-dismiss="modal"
                                    onClick={handleSubmit}
                                    disabled={CreateCenterAPIData?.[FetchingKey] || UpdateCenterAPIData?.[FetchingKey]}
                                    id="Center Save"
                                >
                                    Save
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-md ms-3 btn-outline-primary"
                                    id="CenterCancel"
                                    disabled={CreateCenterAPIData?.[FetchingKey] || UpdateCenterAPIData?.[FetchingKey]}
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

export default AddCenter;
