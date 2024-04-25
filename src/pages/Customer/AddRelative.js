import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import InputComponent from '../../Components/Common/InputComponent';
import { GenderList, RelationTypeList } from './customerUtils';
import { formSelectDefault } from '../../Components/constants/styles';
import { getErrorBorderForReactSelect } from '../../common/utils';
import Select from 'react-select';
import { addRelativeSchema } from '../../common/validationSchema/bookTestSchema';
import Flatpickr from 'react-flatpickr';
import { dateInRequireFormate } from '../../Components/Common/Util';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { AddRelativeForCustomer, GetCustomerRelativesById } from '../../helpers/APIs/CommonAPIs';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { useSelector } from 'react-redux';
import { DataKey, ErrorKey } from '../../Store/callAPI/allAPIs';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import { getCustomerRelativesByIdURL } from '../../helpers/APIs/CustomURL';

const AddRelative = ({ onCloseClick, customerDetails }) => {
    const AddRelativeForCustomerData = useSelector((state) => SelectFullStateOfThisAPI(state, AddRelativeForCustomer));

    useEffect(() => {
        if (AddRelativeForCustomerData?.[DataKey]?.isSuccess) {
            onCloseClick();
            toast.success('Relative Created Successfully');
            removeAPIDataAction('AddRelativeForCustomer');
            callAPIAction(GetCustomerRelativesById, getCustomerRelativesByIdURL(customerDetails?._id));
        } else if (AddRelativeForCustomerData?.[ErrorKey] && !AddRelativeForCustomerData[DataKey]?.isSuccess) {
            ShowErrMsg(AddRelativeForCustomerData, 'CreateEmployeeAPI');
        }
    }, [AddRelativeForCustomerData]);

    const handleSave = (values) => {
        const dataObj = {
            customerId: customerDetails._id,
            fullName: values.fullName,
            age: values.age,
            gender: values.gender?.name,
            dob: values.dob?.length ? values.dob[0] : '',
            relationType: values.relationType?.name
        };

        callAPIAction(AddRelativeForCustomer, null, dataObj);
    };

    return (
        <Modal isOpen={true} centered={true} toggle={onCloseClick} size="lg">
            <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                <p className="mb-0">Add Relative </p>
                <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer" onClick={onCloseClick}></i>
            </ModalHeader>
            <ModalBody className="py-3 px-5">
                <Formik
                    initialValues={{ fullName: '', age: '', gender: '', dob: '', relationType: '' }}
                    enableReinitialize
                    validationSchema={addRelativeSchema}
                    onSubmit={handleSave}
                >
                    {({ setFieldValue, values, errors, submitForm, touched }) => (
                        <Form>
                            <Row>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Full Name
                                        <span className="text-danger">*</span>
                                    </Label>
                                    <InputComponent
                                        id="fullName"
                                        type="text"
                                        name="fullName"
                                        className="input-default w-60"
                                        placeholder="Select"
                                        value={values.fullName}
                                        invalid={!!errors?.fullName && touched.fullName}
                                        onChange={(e) => setFieldValue('fullName', e.target.value)}
                                        validations={['required']}
                                        title={values.fullName}
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
                                        options={GenderList}
                                        placeholder="Select"
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
                                        Relationship Type <span className="text-danger">*</span>
                                    </Label>
                                    <Select
                                        value={values.relationType}
                                        onChange={(e) => {
                                            setFieldValue('relationType', e);
                                        }}
                                        className="w-65"
                                        name="relationType"
                                        id="relationType"
                                        options={RelationTypeList}
                                        placeholder="Select"
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                        styles={{
                                            ...formSelectDefault,
                                            ...getErrorBorderForReactSelect(!!errors.relationType && touched.relationType)
                                        }}
                                        getOptionLabel={(e) => e.name}
                                        getOptionValue={(e) => e.id}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">
                                        Age <span className="text-danger">*</span>
                                    </Label>

                                    <InputComponent
                                        id="age"
                                        type="number"
                                        name="age"
                                        className="input-default w-65"
                                        max={100}
                                        min={1}
                                        maxLength={3}
                                        placeholder="Age"
                                        value={values.age}
                                        invalid={!!errors?.age && touched.age}
                                        onChange={(e) => {
                                            setFieldValue('age', e.target.value);
                                        }}
                                        validations={['required']}
                                    />
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 ">
                                    <Label className="col-form-label w-40">Date Of Birth</Label>
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
                            </Row>
                            <div className=" float-right d-flex">
                                <button
                                    type="button"
                                    className="btn btn-md btn-primary "
                                    data-bs-dismiss="modal"
                                    onClick={submitForm}
                                    id="Center Save"
                                >
                                    Save
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-md ms-3 btn-outline-primary"
                                    id="CenterCancel"
                                    onClick={onCloseClick}
                                >
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </ModalBody>
        </Modal>
    );
};

export default AddRelative;
