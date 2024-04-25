import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { AddBranchSchema } from '../../common/validationSchema';
import InputComponent from '../../Components/Common/InputComponent';
import Select from 'react-select';
import { formSelectDefault } from '../../Components/constants/styles';
import { getErrorBorderForReactSelect } from '../../common/utils';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { CreateBranchAPI, GetAllBranchesAPI, GetAllCentersAPI, UpdateBranchAPI } from '../../helpers/APIs/CommonAPIs';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { indianStatesWithId } from './branchUtils';
import { toast } from 'react-toastify';

import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import { getUpdateBranchUrl } from '../../helpers/APIs/CustomURL';

const AddBranch = ({ onCloseClick, formValues, centersList, isEditMode, pageNumber, rowsPerPage }) => {
    const CreateBranchAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, CreateBranchAPI));
    const GetAllCentersAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllCentersAPI));
    const UpdateBranchAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateBranchAPI));

    const handleSave = (values) => {
        const formData = new FormData();
        formData.append('centerId', values.centerId._id);
        formData.append('branchName', values.branchName);
        formData.append('email', values.email);
        formData.append('state', values.state?.id);
        formData.append('phoneNumber', values.phoneNumber);
        formData.append('address', values.address);
        formData.append('city', values.city);
        formData.append('pinCode', values.pinCode);
        // formData.append('photos', values.photos ? values.photos : null);

        isEditMode
            ? callAPIAction(UpdateBranchAPI, getUpdateBranchUrl(values._id), formData)
            : callAPIAction(CreateBranchAPI, null, formData);
    };

    useEffect(() => {
        if (CreateBranchAPIData?.[DataKey]?.isSuccess) {
            onCloseClick();
            toast.success('Branch Created Successfully');
            removeAPIDataAction('CreateBranchAPI');
            const queryParams = {
                page: pageNumber,
                pageSize: rowsPerPage
            };
            callAPIAction(GetAllBranchesAPI, null, null, queryParams);
        } else if (CreateBranchAPIData?.[ErrorKey] && !CreateBranchAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(CreateBranchAPIData, 'CreateBranchAPI');
        }
    }, [CreateBranchAPIData]);

    useEffect(() => {
        if (UpdateBranchAPIData?.[DataKey]?.isSuccess) {
            toast.success('Branch Updated Successfully');
            onCloseClick();
            removeAPIDataAction('UpdateBranchAPI');
            const queryParams = {
                page: pageNumber,
                pageSize: rowsPerPage
            };
            callAPIAction(GetAllBranchesAPI, null, null, queryParams);
        } else if (UpdateBranchAPIData?.[ErrorKey] && !UpdateBranchAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateBranchAPIData, 'UpdateBranchAPI');
        }
    }, [UpdateBranchAPIData]);

    return (
        <Modal isOpen={true} toggle={onCloseClick} centered={true} size="lg">
            <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                <p className="mb-0">{isEditMode ? 'Edit' : 'Add'} Branch </p>
                <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer " onClick={onCloseClick}></i>
            </ModalHeader>

            <ModalBody className="py-3 px-5">
                <Formik initialValues={formValues} validationSchema={AddBranchSchema} onSubmit={handleSave} enableReinitialize={true}>
                    {({ setFieldValue, values, errors, handleSubmit, touched, handleBlur }) => (
                        <>
                            <Row>
                                {/* <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 align-items-center">
                                    <Label className="col-form-label w-40">Profile Image</Label>
                                    <div>
                                        <label htmlFor="upload-input" className="d-flex align-items-center w-100">
                                            <i className="ri-upload-2-line text-primary fs-18 me-1"></i>
                                            {isEditMode ? (
                                                ''
                                            ) : values.photos ? (
                                                <>
                                                    <img
                                                        src={URL.createObjectURL(values.photos)}
                                                        alt="Preview"
                                                        className="image-selected me-1"
                                                    />
                                                    <small>
                                                        {values.photos?.name.slice(0, 14) ? `${values.photos?.name.slice(0, 14)}...` : null}
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
                                                setFieldValue('photos', e.target?.files[0]);
                                            }}
                                        />
                                    </div>
                                </Col> */}
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Center
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <Select
                                        id="centerId"
                                        value={values.centerId}
                                        onChange={(e) => {
                                            setFieldValue('centerId', e);
                                        }}
                                        className="w-60"
                                        name="centerId"
                                        isLoading={GetAllCentersAPIData?.[FetchingKey]}
                                        options={centersList}
                                        placeholder="Select"
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        styles={{
                                            ...formSelectDefault,
                                            ...getErrorBorderForReactSelect(!!errors.centerId && touched.centerId)
                                        }}
                                        isClearable
                                        getOptionLabel={(e) => e.centerName}
                                        getOptionValue={(e) => e._id}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="d-flex mb-4">
                                    <Label className="col-form-label w-40">
                                        Branch Name
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="firstName"
                                        type="text"
                                        name="branchName"
                                        className="input-default w-60"
                                        placeholder="Select"
                                        value={values.branchName}
                                        invalid={!!errors?.branchName && touched.branchName}
                                        onChange={(e) => setFieldValue('branchName', e.target.value)}
                                        validations={['required']}
                                        title={values.branchName}
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
                                        value={values.address}
                                        maxLength={100}
                                        invalid={!!errors?.address && touched.address}
                                        onChange={(e) => setFieldValue('address', e.target.value)}
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
                            </Row>
                            <div className=" float-right d-flex">
                                <button
                                    type="button"
                                    className="btn btn-md btn-primary "
                                    data-bs-dismiss="modal"
                                    onClick={handleSubmit}
                                    id="branch save"
                                    disabled={CreateBranchAPIData?.[FetchingKey] || UpdateBranchAPIData?.[FetchingKey]}
                                >
                                    Save
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-md ms-3 btn-outline-primary"
                                    id="medsCancel"
                                    onClick={onCloseClick}
                                    disabled={CreateBranchAPIData?.[FetchingKey] || UpdateBranchAPIData?.[FetchingKey]}
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

export default AddBranch;
