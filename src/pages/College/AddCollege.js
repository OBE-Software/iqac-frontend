import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { Formik } from 'formik';
import Select from 'react-select';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { createCollegeAPI, getAllCollegesAPI, getAllUniversitiesAPI, updateCollegeAPI } from '../../helpers/APIs/CommonAPIs';
import InputComponent from '../../Components/Common/InputComponent';
import { indianStatesWithId } from './collegeUtils';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { formSelectDefault } from '../../Components/constants/styles';
import { getErrorBorderForReactSelect } from '../../common/utils';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import { toast } from 'react-toastify';
import { updateCollegeAPIURL } from '../../helpers/APIs/CustomURL';
import { AddCollegeSchema } from '../../common/validationSchema/collegeSchema';

const AddCollege = ({ onCloseClick, formValues, isEditMode, pageNumber, rowsPerPage, universityList }) => {
    // const [getAllColleges, setAllColleges] = useState([]);

    const CreateCollegeAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, createCollegeAPI));
    const GetAllCollegesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, getAllCollegesAPI));
    const UpdateCollegeAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, updateCollegeAPI));
    const GetAllUniversitiesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, getAllUniversitiesAPI));

    const handleSave = (values) => {
        const formData = new FormData();
        formData.append('collegeName', values.collegeName);
        formData.append('address', values.address);
        formData.append('city', values.city);
        formData.append('state', values.state?.name);
        formData.append('country', values.country);
        formData.append('countryCode', values.countryCode);
        formData.append('phoneNumber', values.phoneNumber);
        formData.append('email', values.email);
        formData.append('universityId', values.universityId._id);
        // formData.append('photos', values.photos ? values.photos : null);

        isEditMode
            ? callAPIAction(updateCollegeAPI, updateCollegeAPIURL(values._id), formData)
            : callAPIAction(createCollegeAPI, null, formData);
    };

    useEffect(() => {
        if (CreateCollegeAPIData?.[DataKey]?.isSuccess) {
            onCloseClick();
            toast.success('College Created Successfully');
            removeAPIDataAction('createCollegeAPI');
            const queryParams = {
                page: pageNumber,
                pageSize: rowsPerPage
            };
            callAPIAction(getAllCollegesAPI, null, null, queryParams);
        } else if (CreateCollegeAPIData?.[ErrorKey] && !CreateCollegeAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(CreateCollegeAPIData, 'createCollegeAPI');
        }
    }, [CreateCollegeAPIData]);

    useEffect(() => {
        if (UpdateCollegeAPIData?.[DataKey]?.isSuccess) {
            toast.success('College Updated Successfully'); // 1
            onCloseClick();
            removeAPIDataAction('updateCollegeAPI');
            const queryParams = {
                page: pageNumber,
                pageSize: rowsPerPage
            };
            callAPIAction(getAllCollegesAPI, null, null, queryParams);
        } else if (UpdateCollegeAPIData?.[ErrorKey] && !UpdateCollegeAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateCollegeAPIData, 'updateCollegeAPI');
        }
    }, [UpdateCollegeAPIData]);

    return (
        <Modal isOpen={true} toggle={onCloseClick} centered={true} size="lg">
            <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                <p className="mb-0">{isEditMode ? 'Edit' : 'Add'} College </p>
                <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer " onClick={onCloseClick}></i>
            </ModalHeader>
            <ModalBody className="py-3 px-5">
                <Formik initialValues={formValues} validationSchema={AddCollegeSchema} onSubmit={handleSave} enableReinitialize={true}>
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
                                <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="d-flex mb-4">
                                    <Label className="col-form-label w-40">
                                        College Name
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="collegeName"
                                        type="text"
                                        name="collegeName"
                                        className="input-default w-60"
                                        placeholder="College Name"
                                        value={values.collegeName}
                                        invalid={!!errors?.collegeName && touched.collegeName}
                                        onChange={(e) => setFieldValue('collegeName', e.target.value)}
                                        validations={['required']}
                                        title={values.collegeName}
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
                                        placeholder="Email Address"
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
                                        Country Code<span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        type="text"
                                        name="countryCode"
                                        id="countryCode"
                                        className="input-default w-65"
                                        maxLength={5}
                                        minLength={3}
                                        placeholder="CountryCode"
                                        value={values.countryCode}
                                        invalid={!!errors?.countryCode && touched.countryCode}
                                        onChange={(e) => setFieldValue('countryCode', e.target.value)}
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
                                        Country <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        type="text"
                                        name="country"
                                        id="country"
                                        className="input-default w-65"
                                        placeholder="Country"
                                        value={values.country}
                                        invalid={!!errors?.country && touched.country}
                                        onChange={(e) => setFieldValue('country', e.target.value)}
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
                                        getOptionValue={(e) => e.name}
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
                                {/* <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
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
                                </Col> */}
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        University
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <Select
                                        id="universityId"
                                        value={values.universityId}
                                        onChange={(e) => {
                                            setFieldValue('universityId', e);
                                        }}
                                        className="w-60"
                                        name="universityId"
                                        isLoading={GetAllUniversitiesAPIData?.[FetchingKey]}
                                        options={universityList}
                                        placeholder="Select"
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        styles={{
                                            ...formSelectDefault,
                                            ...getErrorBorderForReactSelect(!!errors.universityId && touched.universityId)
                                        }}
                                        isClearable
                                        getOptionLabel={(e) => e.universityName}
                                        getOptionValue={(e) => e._id}
                                    />
                                </Col>
                            </Row>
                            <div className=" float-right d-flex">
                                <button
                                    type="button"
                                    className="btn btn-md btn-primary "
                                    data-bs-dismiss="modal"
                                    onClick={handleSubmit}
                                    id="college save"
                                    // disabled={CreateUniversityAPIData?.[FetchingKey] || UpdateBranchAPIData?.[FetchingKey]}
                                    disabled={CreateCollegeAPIData?.[FetchingKey]}
                                >
                                    Save
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-md ms-3 btn-outline-primary"
                                    id="medsCancel"
                                    onClick={onCloseClick}
                                    // disabled={CreateBranchAPIData?.[FetchingKey] || UpdateBranchAPIData?.[FetchingKey]}
                                    disabled={CreateCollegeAPIData?.[FetchingKey]}
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

export default AddCollege;
