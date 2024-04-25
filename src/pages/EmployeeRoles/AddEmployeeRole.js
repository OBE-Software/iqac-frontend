import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { AddRoleSchema } from '../../common/validationSchema';
import InputComponent from '../../Components/Common/InputComponent';
import Select from 'react-select';
import { formSelectDefault, getSelectErrorBorder } from '../../Components/constants/styles';
import { getErrorBorderForReactSelect } from '../../common/utils';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import {
    CreateRoleAPI,
    GetAllCentersAPI,
    GetAllEmpDepartmentAPI,
    GetAllRolesAPI,
    GetBranchRolesAPI,
    UpdateRoleAPI
} from '../../helpers/APIs/CommonAPIs';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import { getBranchRolesURL, getUpdateRoleURL } from '../../helpers/APIs/CustomURL';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';

const AddEmpRole = ({ onCloseClick, formValues, empDepartmentList, isEditMode }) => {
    const GetAllEmpDeparmentAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllEmpDepartmentAPI));
    const CreateRoleAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, CreateRoleAPI));
    const UpdateRoleAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateRoleAPI));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));
    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));
    const queryParams = {
        page: 1,
        pageSize: 10
    };
    useEffect(() => {
        if (CreateRoleAPIData?.[DataKey]?.isSuccess) {
            onCloseClick();
            toast.success('Role Created Successfully');
            removeAPIDataAction('CreateRoleAPI');
            roleData !== 1
                ? callAPIAction(GetBranchRolesAPI, getBranchRolesURL(profileData?.branchId), null, queryParams)
                : callAPIAction(GetAllRolesAPI, null, null, queryParams);
        } else if (CreateRoleAPIData?.[ErrorKey] && !CreateRoleAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(CreateRoleAPIData, 'CreateRoleAPI');
        }
    }, [CreateRoleAPIData]);

    useEffect(() => {
        if (UpdateRoleAPIData?.[DataKey]?.isSuccess) {
            toast.success('Role Updated Successfully');
            onCloseClick();
            removeAPIDataAction('UpdateRoleAPI');
            roleData !== 1
                ? callAPIAction(GetBranchRolesAPI, getBranchRolesURL(profileData?.branchId), null, queryParams)
                : callAPIAction(GetAllRolesAPI, null, null, queryParams);
        } else if (UpdateRoleAPIData?.[ErrorKey] && !UpdateRoleAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateRoleAPIData, 'UpdateRoleAPI');
        }
    }, [UpdateRoleAPIData]);
    const handleSave = (values) => {
        const data = {
            roleName: values.roleName,
            employeeDepartmentId: values.employeeDepartmentId?._id,
            status: values.status ? values.status : 1,
            branchId: profileData?.branchId ? profileData?.branchId : null
        };

        isEditMode ? callAPIAction(UpdateRoleAPI, getUpdateRoleURL(values._id), data) : callAPIAction(CreateRoleAPI, null, data);
    };

    return (
        <Modal isOpen={true} toggle={onCloseClick} centered={true} size="lg">
            <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                <p className="mb-0">Add Role </p>
                <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer " onClick={onCloseClick}></i>
            </ModalHeader>

            <ModalBody className="py-3 px-5">
                <Formik initialValues={formValues} validationSchema={AddRoleSchema} onSubmit={handleSave}>
                    {({ setFieldValue, values, errors, handleSubmit, touched, handleBlur }) => (
                        <>
                            <Row>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Department <span className="text-danger">*</span>
                                    </Label>
                                    <Select
                                        value={values.employeeDepartmentId}
                                        onChange={(e) => {
                                            setFieldValue('employeeDepartmentId', e);
                                        }}
                                        className="w-65"
                                        name="employeeDepartmentId"
                                        id="employeeDepartmentId"
                                        options={empDepartmentList}
                                        placeholder="Select"
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        styles={{
                                            ...formSelectDefault,
                                            ...getErrorBorderForReactSelect(!!errors.employeeDepartmentId && touched.employeeDepartmentId)
                                        }}
                                        isLoading={GetAllEmpDeparmentAPIData?.[FetchingKey]}
                                        getOptionLabel={(e) => e.employeeDepartmentName}
                                        getOptionValue={(e) => e._id}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Role Name
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="roleName"
                                        type="text"
                                        name="roleName"
                                        className="input-default w-60"
                                        placeholder="Select"
                                        value={values.roleName}
                                        invalid={!!errors?.roleName && touched.roleName}
                                        onChange={(e) => setFieldValue('roleName', e.target.value)}
                                        validations={['required']}
                                        title={values.roleName}
                                    />
                                </Col>
                            </Row>
                            <div className=" float-right d-flex">
                                <button
                                    type="button"
                                    className="btn btn-md btn-primary "
                                    data-bs-dismiss="modal"
                                    onClick={handleSubmit}
                                    id="medsSave"
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

export default AddEmpRole;
