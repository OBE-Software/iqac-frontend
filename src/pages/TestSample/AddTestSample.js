import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import InputComponent from '../../Components/Common/InputComponent';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { CreateTestSampleAPI, GetAllTestSampleAPI, UpdateTestSampleAPI } from '../../helpers/APIs/CommonAPIs';
import { DataKey, ErrorKey } from '../../Store/callAPI/allAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import { getUpdateTestSampleURL } from '../../helpers/APIs/CustomURL';
import { AddtestSampleSchema } from '../../common/validationSchema/testSampleSchema';

const AddTestSample = ({ onCloseClick, formValues, isEditMode }) => {
    const CreateTestSampleAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, CreateTestSampleAPI));
    const UpdateTestSampleAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateTestSampleAPI));

    useEffect(() => {
        if (CreateTestSampleAPIData?.[DataKey]?.isSuccess) {
            onCloseClick();
            toast.success('Test Sample Created Successfully');
            removeAPIDataAction('CreateTestSampleAPI');
            callAPIAction(GetAllTestSampleAPI);
        } else if (CreateTestSampleAPIData?.[ErrorKey] && !CreateTestSampleAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(CreateTestSampleAPIData, 'CreateTestSampleAPI');
        }
    }, [CreateTestSampleAPIData]);

    useEffect(() => {
        if (UpdateTestSampleAPIData?.[DataKey]?.isSuccess) {
            // toast.success('Test Category Updated Successfully');
            onCloseClick();
            removeAPIDataAction('UpdateTestSampleAPI');
            callAPIAction(GetAllTestSampleAPI);
        } else if (UpdateTestSampleAPIData?.[ErrorKey] && !UpdateTestSampleAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateTestSampleAPIData, 'UpdateTestSampleAPI');
        }
    }, [UpdateTestSampleAPIData]);
    const handleSave = (values) => {
        const data = {
            testSampleName: values.testSampleName,
            status: values.status ? values.status : 1
        };
        isEditMode
            ? callAPIAction(UpdateTestSampleAPI, getUpdateTestSampleURL(values._id), data)
            : callAPIAction(CreateTestSampleAPI, null, data);
    };

    return (
        <Modal isOpen={true} toggle={onCloseClick} centered={true} size="lg">
            <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                <p className="mb-0">{isEditMode ? 'Update' : 'Add'} Test Sample </p>
                <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer " onClick={onCloseClick}></i>
            </ModalHeader>

            <ModalBody className="py-3 px-5">
                <Formik initialValues={formValues} validationSchema={AddtestSampleSchema} onSubmit={handleSave}>
                    {({ setFieldValue, values, errors, handleSubmit, touched, handleBlur }) => (
                        <>
                            <Row>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Test Sample
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="testSampleName"
                                        type="text"
                                        name="testSampleName"
                                        className="input-default w-65"
                                        placeholder="Test Sample"
                                        value={values.testSampleName}
                                        invalid={!!errors?.testSampleName && touched.testSampleName}
                                        onChange={(e) => setFieldValue('testSampleName', e.target.value)}
                                        validations={['required']}
                                        title={values.testSampleName}
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

export default AddTestSample;
