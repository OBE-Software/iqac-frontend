import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import InputComponent from '../../Components/Common/InputComponent';
import Select from 'react-select';
import { formSelectDefault, getSelectErrorBorder, multiSelectScroll } from '../../Components/constants/styles';
import { getErrorBorderForReactSelect } from '../../common/utils';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import {
    GetAllRolesAPI,
    GetAllTestsAPI,
    GetAllTestsWithoutParamsAPI,
    UpdateRoleAPI,
    UpdateTestAPI,
    createTestAPI
} from '../../helpers/APIs/CommonAPIs';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import { getUpdateRoleURL, getUpdateTestURL } from '../../helpers/APIs/CustomURL';
import MultiSelect from '../../Components/Common/MultiSelect';
import { AddtestCategorySchema } from '../../common/validationSchema/testSchema';
import { AddCkEditorPoints, FaqsComponent, PrepareAddpoints } from './PrepareAddpointsComponent';
import { TestGendersListOptions } from './testUtils';

const AddTest = ({ onCloseClick, formValues, isEditMode, testCategoriesList, testSamplesList, testDepartmentsList, alltests }) => {
    const createTestAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, createTestAPI));
    const UpdateTestAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, UpdateTestAPI));

    useEffect(() => {
        if (createTestAPIData?.[DataKey]?.isSuccess) {
            onCloseClick();
            toast.success('Test Created Successfully');
            removeAPIDataAction('createTestAPI');
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            callAPIAction(GetAllTestsAPI, null, null, queryParams);
            callAPIAction(GetAllTestsWithoutParamsAPI);
        } else if (createTestAPIData?.[ErrorKey] && !createTestAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(createTestAPIData, 'createTestAPI');
        }
    }, [createTestAPIData]);

    useEffect(() => {
        if (UpdateTestAPIData?.[DataKey]?.isSuccess) {
            toast.success('Test Updated Successfully');
            onCloseClick();
            removeAPIDataAction('UpdateTestAPI');
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            callAPIAction(GetAllTestsAPI, null, null, queryParams);
            callAPIAction(GetAllTestsWithoutParamsAPI);
        } else if (UpdateTestAPIData?.[ErrorKey] && !UpdateTestAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(UpdateTestAPIData, 'UpdateTestAPI');
        }
    }, [UpdateTestAPIData]);

    const handleSave = (values) => {
        const Obj = {
            ...values
        };

        Obj['departmentName'] = values?.departmentName?.departmentName;
        Obj['testCategory'] = values?.testCategory?.testCategoryName;
        Obj['testSamples'] = values?.testSamples?.map((sam) => sam.testSampleName);
        Obj['recommendedFor'] = values?.recommendedFor ? values?.recommendedFor.name : '';
        Obj['testIncluded'] = values?.testIncluded?.length ? values?.testIncluded?.map((test) => test.testName) : [];

        isEditMode ? callAPIAction(UpdateTestAPI, getUpdateTestURL(values._id), Obj) : callAPIAction(createTestAPI, null, Obj);
    };

    return (
        <Modal isOpen={true} toggle={onCloseClick} centered={true} size="lg">
            <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                <p className="mb-0">Add Test </p>
                <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer " onClick={onCloseClick}></i>
            </ModalHeader>

            <ModalBody className="py-3 px-5">
                <Formik initialValues={formValues} validationSchema={AddtestCategorySchema} onSubmit={handleSave}>
                    {({ setFieldValue, values, errors, handleSubmit, touched, handleBlur }) => (
                        <>
                            <Row>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Test Name
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="testName"
                                        type="text"
                                        name="testName"
                                        className="input-default w-60"
                                        placeholder="Test Name"
                                        value={values.testName}
                                        invalid={!!errors?.testName && touched.testName}
                                        onChange={(e) => setFieldValue('testName', e.target.value)}
                                        validations={['required']}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Test ID
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="testID"
                                        type="text"
                                        name="testID"
                                        className="input-default w-60"
                                        placeholder="Test ID"
                                        value={values.testID}
                                        invalid={!!errors?.testID && touched.testID}
                                        onChange={(e) => setFieldValue('testID', e.target.value)}
                                        validations={['required']}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Test Amount
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="testAmount"
                                        type="number"
                                        name="testAmount"
                                        className="input-default w-60"
                                        placeholder="Test Amount"
                                        value={values.testAmount}
                                        invalid={!!errors?.testAmount && touched.testAmount}
                                        onChange={(e) => setFieldValue('testAmount', e.target.value)}
                                        validations={['required']}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Test Category <span className="text-danger">*</span>
                                    </Label>
                                    <Select
                                        value={values.testCategory}
                                        onChange={(e) => {
                                            setFieldValue('testCategory', e);
                                        }}
                                        className="w-60"
                                        name="testCategory"
                                        id="testCategory"
                                        options={testCategoriesList}
                                        placeholder="Select"
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        styles={{
                                            ...formSelectDefault,
                                            ...getErrorBorderForReactSelect(!!errors.testCategory && touched.testCategory)
                                        }}
                                        getOptionLabel={(e) => e.testCategoryName}
                                        getOptionValue={(e) => e._id}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Test Department <span className="text-danger">*</span>
                                    </Label>
                                    <Select
                                        value={values.departmentName}
                                        onChange={(e) => {
                                            setFieldValue('departmentName', e);
                                            setFieldValue('testIncluded', []);
                                        }}
                                        className="w-60"
                                        name="departmentName"
                                        id="departmentName"
                                        options={testDepartmentsList}
                                        placeholder="Select"
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        styles={{
                                            ...formSelectDefault,
                                            ...getErrorBorderForReactSelect(!!errors.departmentName && touched.departmentName)
                                        }}
                                        getOptionLabel={(e) => e.departmentName}
                                        getOptionValue={(e) => e._id}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Test Samples <span className="text-danger">*</span>
                                    </Label>
                                    <MultiSelect
                                        id="testSamples"
                                        value={values.testSamples}
                                        onChange={(e) => {
                                            setFieldValue('testSamples', e);
                                        }}
                                        options={testSamplesList}
                                        placeholder="Select"
                                        isMulti
                                        // isLoading={getCountiesByStatesAPIData?.[FetchingKey]}
                                        className="w-60 ht-fitcontent"
                                        isClearable
                                        closeMenuOnSelect={false}
                                        hideSelectedOptions={false}
                                        styles={{
                                            ...formSelectDefault,
                                            menu: (provided) => ({ ...provided, zIndex: 2 }),
                                            ...getSelectErrorBorder(!!errors.testSamples && touched.testSamples),
                                            ...multiSelectScroll(true, !!errors.testSamples && touched.testSamples)
                                        }}
                                        hideAll
                                        getOptionLabel={(e) => e.testSampleName}
                                        getOptionValue={(e) => e._id}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">Estimated Time For Result</Label>
                                    <InputComponent
                                        id="estimatedResultTime"
                                        type="text"
                                        name="estimatedResultTime"
                                        className="input-default w-60"
                                        placeholder="Estimated Time For Result"
                                        value={values.estimatedResultTime}
                                        invalid={!!errors?.estimatedResultTime && touched.estimatedResultTime}
                                        onChange={(e) => setFieldValue('estimatedResultTime', e.target.value)}
                                        validations={['required']}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">Recommended For</Label>
                                    <Select
                                        value={values.recommendedFor}
                                        onChange={(e) => {
                                            setFieldValue('recommendedFor', e);
                                        }}
                                        className="w-60"
                                        name="recommendedFor"
                                        id="recommendedFor"
                                        options={TestGendersListOptions}
                                        placeholder="Select"
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        styles={{
                                            ...formSelectDefault,
                                            ...getErrorBorderForReactSelect(!!errors.recommendedFor && touched.recommendedFor)
                                        }}
                                        getOptionLabel={(e) => e.name}
                                        getOptionValue={(e) => e.id}
                                    />
                                </Col>
                                {values?.departmentName?.departmentName === 'packages' && (
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                        <Label className="col-form-label w-40">Tests Included</Label>
                                        <MultiSelect
                                            id="testIncluded"
                                            value={values.testIncluded}
                                            onChange={(e) => {
                                                setFieldValue('testIncluded', e);
                                            }}
                                            options={alltests}
                                            placeholder="Select"
                                            isMulti
                                            // isLoading={getCountiesByStatesAPIData?.[FetchingKey]}
                                            className="w-60 ht-fitcontent"
                                            isClearable
                                            closeMenuOnSelect={false}
                                            hideSelectedOptions={false}
                                            styles={{
                                                ...formSelectDefault,
                                                menu: (provided) => ({ ...provided, zIndex: 2 }),
                                                ...getSelectErrorBorder(!!errors.testIncluded && touched.testIncluded),
                                                ...multiSelectScroll(true, !!errors.testIncluded && touched.testIncluded)
                                            }}
                                            hideAll
                                            getOptionLabel={(e) => e.testName}
                                            getOptionValue={(e) => e._id}
                                        />
                                    </Col>
                                )}

                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className="mb-4 ">
                                    <PrepareAddpoints
                                        label="Sub Tests"
                                        holder="Test Name"
                                        setFieldValue={setFieldValue}
                                        name="subTests"
                                        data={values.subTests}
                                        title="Add Test"
                                        nomessage="No tests are included."
                                        isDeleteable
                                        values={values}
                                    />
                                </Col>

                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className="mb-4 ">
                                    <PrepareAddpoints
                                        label="Preparations"
                                        holder="Add Preparatoin"
                                        setFieldValue={setFieldValue}
                                        name="preparations"
                                        data={values.preparations}
                                        title="Add Preparation"
                                        nomessage="No preparations are added."
                                        isDeleteable
                                        values={values}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className="mb-4 ">
                                    <FaqsComponent
                                        label="FAQ'S"
                                        setFieldValue={setFieldValue}
                                        name="testFAQ"
                                        data={values.testFAQ}
                                        title="Add FAQ"
                                        quesHolder={'Question'}
                                        ansHolder="Answer"
                                        nomessage="No FAQ's are added."
                                        isDeleteable
                                        values={values}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className="mb-4 ">
                                    <AddCkEditorPoints
                                        label="Test Overview"
                                        setFieldValue={setFieldValue}
                                        name="testDescription"
                                        data={values.testDescription}
                                    />
                                </Col>
                            </Row>
                            <div className=" float-right d-flex">
                                <button
                                    type="button"
                                    className="btn btn-md btn-primary "
                                    data-bs-dismiss="modal"
                                    onClick={handleSubmit}
                                    id="test save"
                                    disabled={createTestAPIData?.[FetchingKey] || UpdateTestAPIData?.[FetchingKey]}
                                >
                                    Save
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-md ms-3 btn-outline-primary"
                                    id="testCancel"
                                    onClick={onCloseClick}
                                    disabled={createTestAPIData?.[FetchingKey] || UpdateTestAPIData?.[FetchingKey]}
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

export default AddTest;
