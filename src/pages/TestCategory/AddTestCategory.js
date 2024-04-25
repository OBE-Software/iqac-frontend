import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import InputComponent from '../../Components/Common/InputComponent';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { CreateTestCategoryAPI, GetAllTestCategoryAPI, UpdateTestCategoryAPI } from '../../helpers/APIs/CommonAPIs';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import {  getUpdateTestCategoryURL } from '../../helpers/APIs/CustomURL';
import { AddTestCategorySchema } from '../../common/validationSchema/testCategorySchema';

const AddTestCategory = ({ onCloseClick, formValues, isEditMode }) => {
    const CreateTestCategoryAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, CreateTestCategoryAPI));
    const UpdateTestCategoryAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateTestCategoryAPI));

    useEffect(() => {
        if (CreateTestCategoryAPIData?.[DataKey]?.isSuccess) {
            onCloseClick();
            toast.success('Test Category Created Successfully');
            removeAPIDataAction('CreateTestCategoryAPI');
            callAPIAction(GetAllTestCategoryAPI);
        } else if (CreateTestCategoryAPIData?.[ErrorKey] && !CreateTestCategoryAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(CreateTestCategoryAPIData, 'CreateTestCategoryAPI');
        }
    }, [CreateTestCategoryAPIData]);

    useEffect(() => {
        if (UpdateTestCategoryAPIData?.[DataKey]?.isSuccess) {
            // toast.success('Test Category Updated Successfully');
            onCloseClick();
            removeAPIDataAction('UpdateTestCategoryAPI');
            callAPIAction(GetAllTestCategoryAPI);
        } else if (UpdateTestCategoryAPIData?.[ErrorKey] && !UpdateTestCategoryAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateTestCategoryAPIData, 'UpdateTestCategoryAPI');
        }
    }, [UpdateTestCategoryAPIData]);
    const handleSave = (values) => {
        const data = {
            testCategoryName: values.testCategoryName,
            status: values.status ? values.status : 1
        };
        isEditMode
            ? callAPIAction(UpdateTestCategoryAPI, getUpdateTestCategoryURL(values._id), data)
            : callAPIAction(CreateTestCategoryAPI, null, data);
    };

    return (
        <Modal isOpen={true} toggle={onCloseClick} centered={true} size="lg">
            <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                <p className="mb-0">{isEditMode ? 'Update' : 'Add'} Test Category </p>
                <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer " onClick={onCloseClick}></i>
            </ModalHeader>

            <ModalBody className="py-3 px-5">
                <Formik initialValues={formValues} validationSchema={AddTestCategorySchema} onSubmit={handleSave}>
                    {({ setFieldValue, values, errors, handleSubmit, touched, handleBlur }) => (
                        <>
                            <Row>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Category Name
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="testCategoryName"
                                        type="text"
                                        name="testCategoryName"
                                        className="input-default w-65"
                                        placeholder="Category Name"
                                        value={values.testCategoryName}
                                        invalid={!!errors?.testCategoryName && touched.testCategoryName}
                                        onChange={(e) => setFieldValue('testCategoryName', e.target.value)}
                                        validations={['required']}
                                        title={values.testCategoryName}
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

export default AddTestCategory;
