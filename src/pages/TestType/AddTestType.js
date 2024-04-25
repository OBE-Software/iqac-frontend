import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import InputComponent from '../../Components/Common/InputComponent';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { CreateTestTypeAPI, GetAllTestTypeAPI, UpdateTestTypeAPI } from '../../helpers/APIs/CommonAPIs';
import { DataKey, ErrorKey } from '../../Store/callAPI/allAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import { getUpdateTestTypeURL } from '../../helpers/APIs/CustomURL';
import { AddtestTypeSchema } from '../../common/validationSchema/testTypeSchema';

const AddTestType = ({ onCloseClick, formValues, isEditMode }) => {
    const CreateTestTypeAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, CreateTestTypeAPI));
    const UpdateTestTypeAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateTestTypeAPI));

    useEffect(() => {
        if (CreateTestTypeAPIData?.[DataKey]?.isSuccess) {
            onCloseClick();
            toast.success('Test Type Created Successfully');
            removeAPIDataAction('CreateTestTypeAPI');
            callAPIAction(GetAllTestTypeAPI);
        } else if (CreateTestTypeAPIData?.[ErrorKey] && !CreateTestTypeAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(CreateTestTypeAPIData, 'CreateTestTypeAPI');
        }
    }, [CreateTestTypeAPIData]);

    useEffect(() => {
        if (UpdateTestTypeAPIData?.[DataKey]?.isSuccess) {
            // toast.success('Test Category Updated Successfully');
            onCloseClick();
            removeAPIDataAction('UpdateTestTypeAPI');
            callAPIAction(GetAllTestTypeAPI);
        } else if (UpdateTestTypeAPIData?.[ErrorKey] && !UpdateTestTypeAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateTestTypeAPIData, 'UpdateTestTypeAPI');
        }
    }, [UpdateTestTypeAPIData]);
    const handleSave = (values) => {
        const data = {
            testTypeName: values.testTypeName,
            status: values.status ? values.status : 1
        };
        isEditMode
            ? callAPIAction(UpdateTestTypeAPI, getUpdateTestTypeURL(values._id), data)
            : callAPIAction(CreateTestTypeAPI, null, data);
    };

    return (
        <Modal isOpen={true} toggle={onCloseClick} centered={true} size="lg">
            <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                <p className="mb-0">{isEditMode ? 'Update' : 'Add'} Test Type </p>
                <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer " onClick={onCloseClick}></i>
            </ModalHeader>

            <ModalBody className="py-3 px-5">
                <Formik initialValues={formValues} validationSchema={AddtestTypeSchema} onSubmit={handleSave}>
                    {({ setFieldValue, values, errors, handleSubmit, touched, handleBlur }) => (
                        <>
                            <Row>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Test Type
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="testTypeName"
                                        type="text"
                                        name="testTypeName"
                                        className="input-default w-65"
                                        placeholder="Test Type"
                                        value={values.testTypeName}
                                        invalid={!!errors?.testTypeName && touched.testTypeName}
                                        onChange={(e) => setFieldValue('testTypeName', e.target.value)}
                                        validations={['required']}
                                        title={values.testTypeName}
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

export default AddTestType;
