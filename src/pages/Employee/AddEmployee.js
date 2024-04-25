import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import InputComponent from '../../Components/Common/InputComponent';
import Select from 'react-select';
import { formSelectDefault } from '../../Components/constants/styles';
import { getErrorBorderForReactSelect } from '../../common/utils';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import {
    CreateEmployeeAPI,
    GetAllBranchesAPI,
    GetAllEmployeeAPI,
    GetBranchEmployeesByBranchId,
    UpdateEmployeeAPI
} from '../../helpers/APIs/CommonAPIs';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { indianStatesWithId, genderList } from './employeeUtils';
import { toast } from 'react-toastify';
import Flatpickr from 'react-flatpickr';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import { getBranchEmployeesByBranchIdURL, getUpdateEmployeeURL } from '../../helpers/APIs/CustomURL';
import { AddEmployeeSchema } from '../../common/validationSchema/employeeSchema';
import { dateInRequireFormate } from '../../Components/Common/Util';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import { branchAdminRoleName } from '../../Components/constants/Constants';

const AddEmployee = ({ onCloseClick, formValues, branchList, isEditMode, roleList, empDepartmentList }) => {
    const CreateEmployeeAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, CreateEmployeeAPI));
    const GetAllEmployeesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllEmployeeAPI));
    const UpdateEmployeeAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateEmployeeAPI));
    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));

    const handleSave = (values) => {
        const formData = new FormData();
        formData.append('employeeCode', values.employeeCode);
        formData.append('employeeName', values.employeeName);
        formData.append('email', values.email);
        formData.append('state', values.state?.id);
        formData.append('phoneNumber', values.phoneNumber);
        formData.append('address', values.address);
        formData.append('city', values.city);
        formData.append('profilePic', values.profilePic ? values.profilePic : null);
        formData.append('employeeDepartmentId', values.employeeDepartmentId._id);
        if (values?.joiningDate) formData.append('joiningDate', values?.joiningDate);
        if (values?.dob) formData.append('dob', values?.dob);
        formData.append('roleType', values.roleType._id);
        formData.append('branchId', values.branchId._id);
        formData.append('gender', values.gender.name);

        isEditMode
            ? callAPIAction(UpdateEmployeeAPI, getUpdateEmployeeURL(values?._id), formData)
            : callAPIAction(CreateEmployeeAPI, null, formData);
    };

    useEffect(() => {
        if (CreateEmployeeAPIData?.[DataKey]?.isSuccess) {
            onCloseClick();
            toast.success('Employee Created Successfully');
            removeAPIDataAction('CreateEmployeeAPI');
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            roleData?.roleName === branchAdminRoleName
                ? callAPIAction(GetBranchEmployeesByBranchId, getBranchEmployeesByBranchIdURL(profileData?.branchId), null, queryParams)
                : callAPIAction(GetAllEmployeeAPI, null, null, queryParams);
        } else if (CreateEmployeeAPIData?.[ErrorKey] && !CreateEmployeeAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(CreateEmployeeAPIData, 'CreateEmployeeAPI');
        }
    }, [CreateEmployeeAPIData]);

    useEffect(() => {
        if (UpdateEmployeeAPIData?.[DataKey]?.isSuccess) {
            toast.success('Employee Updated Successfully');
            onCloseClick();
            removeAPIDataAction('UpdateEmployeeAPI');
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            roleData?.roleName === branchAdminRoleName
                ? callAPIAction(GetBranchEmployeesByBranchId, getBranchEmployeesByBranchIdURL(profileData?.branchId), null, queryParams)
                : callAPIAction(GetAllEmployeeAPI, null, null, queryParams);
        } else if (UpdateEmployeeAPIData?.[ErrorKey] && !UpdateEmployeeAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateEmployeeAPIData, 'UpdateEmployeeAPI');
        }
    }, [UpdateEmployeeAPIData]);

    return (
        <Modal isOpen={true} toggle={onCloseClick} centered={true} size="lg">
            <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                <p className="mb-0">{isEditMode ? 'Update' : 'Add'} Employee </p>
                <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer " onClick={onCloseClick}></i>
            </ModalHeader>

            <ModalBody className="py-3 px-5">
                <Formik initialValues={formValues} validationSchema={AddEmployeeSchema} onSubmit={handleSave} enableReinitialize={true}>
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
                                        Employee Name
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="employeeName"
                                        type="text"
                                        name="employeeName"
                                        className="input-default w-65"
                                        placeholder="Select"
                                        value={values.employeeName}
                                        invalid={!!errors?.employeeName && touched.employeeName}
                                        onChange={(e) => setFieldValue('employeeName', e.target.value)}
                                        validations={['required']}
                                        title={values.employeeName}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="d-flex mb-4">
                                    <Label className="col-form-label w-40">
                                        Employee Id
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="employeeCode"
                                        type="text"
                                        name="employeeCode"
                                        className="input-default w-65"
                                        placeholder="Select"
                                        value={values.employeeCode}
                                        invalid={!!errors?.employeeCode && touched.employeeCode}
                                        onChange={(e) => setFieldValue('employeeCode', e.target.value)}
                                        validations={['required']}
                                        title={values.employeeCode}
                                    />
                                </Col>
                                {roleData?.roleName !== branchAdminRoleName && (
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
                                            isLoading={GetAllEmployeesAPIData?.[FetchingKey]}
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
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Email
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="emailPro"
                                        type="email"
                                        name="loginID"
                                        className="input-default w-65"
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
                                        options={genderList}
                                        placeholder="Select Gender"
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
                                        Role <span className="text-danger">*</span>
                                    </Label>
                                    <Select
                                        value={values.roleType}
                                        onChange={(e) => {
                                            setFieldValue('roleType', e);
                                        }}
                                        className="w-65"
                                        name="roleType"
                                        id="roleType"
                                        options={roleList && roleList.filter((role) => role.status === 1)}
                                        placeholder="Select Role"
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        styles={{
                                            ...formSelectDefault,
                                            ...getErrorBorderForReactSelect(!!errors.roleType && touched.roleType)
                                        }}
                                        getOptionLabel={(e) => e.roleName}
                                        getOptionValue={(e) => e._id}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Employee Department <span className="text-danger">*</span>
                                    </Label>
                                    <Select
                                        value={values.employeeDepartmentId}
                                        onChange={(e) => {
                                            setFieldValue('employeeDepartmentId', e);
                                        }}
                                        className="w-65"
                                        name="employeeDepartmentId"
                                        id="employeeDepartmentId"
                                        options={empDepartmentList && empDepartmentList.filter((item) => item.status === 1)}
                                        placeholder="Select Emp Department"
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        styles={{
                                            ...formSelectDefault,
                                            ...getErrorBorderForReactSelect(!!errors.employeeDepartmentId && touched.employeeDepartmentId)
                                        }}
                                        getOptionLabel={(e) => e.employeeDepartmentName}
                                        getOptionValue={(e) => e._id}
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
                                        placeholder="Select State"
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
                                        Date of Birth <span className="text-danger"></span>
                                    </Label>
                                    <Flatpickr
                                        id="dob"
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
                                        Joining Date <span className="text-danger"></span>
                                    </Label>
                                    <Flatpickr
                                        id="joiningDate"
                                        className={`form-control w-65 ${!!errors.joiningDate && touched.joiningDate && 'input__error'}`}
                                        value={values.joiningDate}
                                        onChange={(e) => {
                                            setFieldValue('joiningDate', e?.length > 0 ? e : null);
                                        }}
                                        placeholder="joiningDate"
                                        options={{
                                            maxDate: new Date(),
                                            formatDate: (date) => {
                                                return dateInRequireFormate(date, 'm/d/y');
                                            }
                                        }}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className="flex mb-4 ">
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
                            </Row>
                            <div className=" float-right d-flex">
                                <button
                                    type="button"
                                    className="btn btn-md btn-primary "
                                    data-bs-dismiss="modal"
                                    onClick={handleSubmit}
                                    id="branch save"
                                    disabled={CreateEmployeeAPI?.[FetchingKey]}
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
                        </>
                    )}
                </Formik>
            </ModalBody>
        </Modal>
    );
};

export default AddEmployee;
