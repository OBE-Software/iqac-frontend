import { Formik } from 'formik';
import React from 'react';
import { Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import InputComponent from '../../Components/Common/InputComponent';
import { callAPIAction } from '../../Store/callAPI/actions';
import { createDepartmentAPI, getAllCollegesAPI, updateDepartmentAPI } from '../../helpers/APIs/CommonAPIs';
import { updateDepartmentAPIURL } from '../../helpers/APIs/CustomURL';
import { AddDepartmentSchema } from '../../common/validationSchema/departmentSchema';
import { formSelectDefault } from '../../Components/constants/styles';
import { getErrorBorderForReactSelect } from '../../common/utils';
import { FetchingKey } from '../../Store/callAPI/allAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import Select from 'react-select';

const AddDepartment = ({ onCloseClick, formValues, isEditMode, collegeList }) => {
    const GetAllCollegesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, getAllCollegesAPI));

    const handleSave = (values) => {
        const data = {
            employeeDepartmentName: values.employeeDepartmentName,
            status: values.status ? values.status : 1
        };
        isEditMode
            ? callAPIAction(updateDepartmentAPI, updateDepartmentAPIURL(values._id), data)
            : callAPIAction(createDepartmentAPI, null, data);
    };

    return (
        <Modal isOpen={true} toggle={onCloseClick} centered={true} size="lg">
            <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                <p className="mb-0">Add Department </p>
                <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer " onClick={onCloseClick}></i>
            </ModalHeader>

            <ModalBody className="py-3 px-5">
                <Formik initialValues={formValues} validationSchema={AddDepartmentSchema} onSubmit={handleSave}>
                    {({ setFieldValue, values, errors, handleSubmit, touched, handleBlur }) => (
                        <>
                            <Row>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Department Name
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="employeeDepartmentName"
                                        type="text"
                                        name="employeeDepartmentName"
                                        className="input-default w-60"
                                        placeholder="Select"
                                        value={values.employeeDepartmentName}
                                        invalid={!!errors?.employeeDepartmentName && touched.employeeDepartmentName}
                                        onChange={(e) => setFieldValue('employeeDepartmentName', e.target.value)}
                                        validations={['required']}
                                        title={values.employeeDepartmentName}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        College
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <Select
                                        id="collegeId"
                                        value={values.collegeId}
                                        onChange={(e) => {
                                            setFieldValue('collegeId', e);
                                        }}
                                        className="w-60"
                                        name="collegeId"
                                        isLoading={GetAllCollegesAPIData?.[FetchingKey]}
                                        options={collegeList}
                                        placeholder="Select"
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        styles={{
                                            ...formSelectDefault,
                                            ...getErrorBorderForReactSelect(!!errors.collegeId && touched.collegeId)
                                        }}
                                        isClearable
                                        getOptionLabel={(e) => e.collegeName}
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

export default AddDepartment;
