import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import InputComponent from '../../Components/Common/InputComponent';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { createDepartmentAPI, getAllCollegesAPI, getAllDepartmentsAPI, updateDepartmentAPI } from '../../helpers/APIs/CommonAPIs';
import { updateDepartmentAPIURL } from '../../helpers/APIs/CustomURL';
import { AddDepartmentSchema } from '../../common/validationSchema/departmentSchema';
import { formSelectDefault } from '../../Components/constants/styles';
import { getErrorBorderForReactSelect } from '../../common/utils';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';

const AddDepartment = ({ onCloseClick, formValues, isEditMode, collegeList, pageNumber, rowsPerPage }) => {
    const CreateDepartmentAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, createDepartmentAPI));
    const GetAllCollegesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, getAllCollegesAPI));
    const UpdateDepartmentAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, updateDepartmentAPI));

    const handleSave = (values) => {
        // const data = {
        //     departmentName: values.departmentName,
        //     status: values.status ? values.status : 1
        // };
        const formData = new FormData();
        formData.append('departmentName', values.departmentName);
        formData.append('collegeId', values.collegeId._id);
        console.log('add department form values', formData);

        isEditMode
            ? callAPIAction(updateDepartmentAPI, updateDepartmentAPIURL(values._id), formData)
            : callAPIAction(createDepartmentAPI, null, formData);
    };

    useEffect(() => {
        if (CreateDepartmentAPIData?.[DataKey]?.isSuccess) {
            onCloseClick();
            toast.success('Department Created Successfully');
            removeAPIDataAction('createDepartmentAPI');
            const queryParams = {
                page: pageNumber,
                pageSize: rowsPerPage
            };
            callAPIAction(getAllDepartmentsAPI, null, null, queryParams);
        } else if (CreateDepartmentAPIData?.[ErrorKey] && !CreateDepartmentAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(CreateDepartmentAPIData, 'createDepartmentAPI');
        }
    }, [CreateDepartmentAPIData]);

    useEffect(() => {
        if (UpdateDepartmentAPIData?.[DataKey]?.isSuccess) {
            toast.success('Department Updated Successfully'); // 1
            onCloseClick();
            removeAPIDataAction('updateDepartmentAPI');
            const queryParams = {
                page: pageNumber,
                pageSize: rowsPerPage
            };
            callAPIAction(getAllDepartmentsAPI, null, null, queryParams);
        } else if (UpdateDepartmentAPIData?.[ErrorKey] && !UpdateDepartmentAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateDepartmentAPIData, 'updateDepartmentAPI');
        }
    }, [UpdateDepartmentAPIData]);

    return (
        <Modal isOpen={true} toggle={onCloseClick} centered={true} size="lg">
            <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                <p className="mb-0">Add Department </p>
                <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer " onClick={onCloseClick}></i>
            </ModalHeader>

            <ModalBody className="py-3 px-5">
                <Formik initialValues={formValues} validationSchema={AddDepartmentSchema} onSubmit={handleSave} enableReinitialize={true}>
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
                                        className="input-default w-60"
                                        placeholder="Department Name"
                                        value={values.departmentName}
                                        invalid={!!errors?.departmentName && touched.departmentName}
                                        onChange={(e) => setFieldValue('departmentName', e.target.value)}
                                        validations={['required']}
                                        title={values.departmentName}
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
