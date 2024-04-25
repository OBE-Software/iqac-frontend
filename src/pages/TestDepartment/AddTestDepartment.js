import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import InputComponent from '../../Components/Common/InputComponent';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { createTestDepartmentAPI, UpdateTestDepartmentAPI } from '../../helpers/APIs/CommonAPIs';
import { DataKey, ErrorKey } from '../../Store/callAPI/allAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import { getUpdateTestDepartmentURL } from '../../helpers/APIs/CustomURL';
import { AddtestDepartmentSchema } from '../../common/validationSchema/testDepartmentSchema';

const AddTestDepartment = ({ onCloseClick, formValues, isEditMode, callDepartments }) => {
    const CreateTestDepartmentAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, createTestDepartmentAPI));
    const UpdateTestDepartmentAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateTestDepartmentAPI));

    useEffect(() => {
        if (CreateTestDepartmentAPIData?.[DataKey]?.isSuccess) {
            onCloseClick();
            toast.success('Test Department Created Successfully');
            removeAPIDataAction('createTestDepartmentAPI');
            callDepartments();
        } else if (CreateTestDepartmentAPIData?.[ErrorKey] && !CreateTestDepartmentAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(CreateTestDepartmentAPIData, 'createTestDepartmentAPI');
        }
    }, [CreateTestDepartmentAPIData]);

    useEffect(() => {
        if (UpdateTestDepartmentAPIData?.[DataKey]?.isSuccess) {
            // toast.success('Test Category Updated Successfully');
            onCloseClick();
            removeAPIDataAction('UpdateTestDepartmentAPI');
            callDepartments();
        } else if (UpdateTestDepartmentAPIData?.[ErrorKey] && !UpdateTestDepartmentAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateTestDepartmentAPIData, 'UpdateTestDepartmentAPI');
        }
    }, [UpdateTestDepartmentAPIData]);
    const handleSave = (values) => {
        const data = {
            departmentName: values.departmentName,
            status: values.status ? values.status : 1
        };
        isEditMode
            ? callAPIAction(UpdateTestDepartmentAPI, getUpdateTestDepartmentURL(values._id), data)
            : callAPIAction(createTestDepartmentAPI, null, data);
    };

    return (
        <Modal isOpen={true} toggle={onCloseClick} centered={true} size="lg">
            <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                <p className="mb-0">{isEditMode ? 'Update' : 'Add'} Test Department </p>
                <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer " onClick={onCloseClick}></i>
            </ModalHeader>

            <ModalBody className="py-3 px-5">
                <Formik initialValues={formValues} validationSchema={AddtestDepartmentSchema} onSubmit={handleSave}>
                    {({ setFieldValue, values, errors, handleSubmit, touched, handleBlur }) => (
                        <>
                            <Row>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Department Name
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="departmentName"
                                        type="text"
                                        name="departmentName"
                                        className="input-default w-65"
                                        placeholder="Department Name"
                                        value={values.departmentName}
                                        invalid={!!errors?.departmentName && touched.departmentName}
                                        onChange={(e) => setFieldValue('departmentName', e.target.value)}
                                        validations={['required']}
                                        title={values.departmentName}
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

export default AddTestDepartment;
