import React, { useEffect } from 'react';
import { Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { notificationSchema } from '../../common/validationSchema/notificationSchema';
import { Formik } from 'formik';
import InputComponent from '../../Components/Common/InputComponent';
import { indianStatesWithId } from '../Employee/employeeUtils';
import Select from 'react-select';
import { formSelectDefault } from '../../Components/constants/styles';
import { getErrorBorderForReactSelect } from '../../common/utils';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { GetAllNotificationsAPI, SaveNotificationAPI } from '../../helpers/APIs/CommonAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';

const SendNotification = ({ formValues, onCloseClick }) => {
    const SaveNotificationAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, SaveNotificationAPI));

    useEffect(() => {
        if (SaveNotificationAPIData?.[DataKey]?.isSuccess) {
            onCloseClick();
            toast.success('Notification sent Successfully');
            removeAPIDataAction('SaveNotificationAPI');
            callAPIAction(GetAllNotificationsAPI, null, null, {
                page: 1,
                pageSize: 10
            });
        } else if (SaveNotificationAPIData?.[ErrorKey] && !SaveNotificationAPI[DataKey]?.isSuccess) {
            ShowErrMsg(SaveNotificationAPIData, 'SaveNotificationAPI');
        }
    }, [SaveNotificationAPIData]);

    const handleSave = (values) => {
        const data = {
            notificationType: values.notificationType.name,
            notificationTitle: values.notificationTitle,
            notificationDataLabel: values.notificationDataLabel,
            notificationBody: values.notificationBody,
            userType: values.userType.name,
            notificationLink: values.notificationLink,
            photos: ''
        };
        callAPIAction(SaveNotificationAPI, null, data);
    };

    return (
        <div>
            <Modal isOpen={true} toggle={onCloseClick} centered={true} size="lg">
                <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                    <p className="mb-0">Send Notification </p>
                    <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer" onClick={onCloseClick}></i>
                </ModalHeader>
                <ModalBody className="py-3 px-5">
                    <Formik
                        initialValues={formValues}
                        validationSchema={notificationSchema}
                        onSubmit={handleSave}
                        enableReinitialize={true}
                    >
                        {({ setFieldValue, values, errors, handleSubmit, touched, handleBlur }) => (
                            <>
                                <Row>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="d-flex mb-4">
                                        <Label className="col-form-label w-40">
                                            Notification Type
                                            <span className="text-danger">*</span>
                                        </Label>
                                        <Select
                                            value={values.notificationType}
                                            onChange={(e) => {
                                                setFieldValue('notificationType', e);
                                            }}
                                            className="w-65"
                                            name="notificationType"
                                            id="notificationType"
                                            options={indianStatesWithId}
                                            placeholder="Select Notification type"
                                            components={{
                                                IndicatorSeparator: () => null
                                            }}
                                            styles={{
                                                ...formSelectDefault,
                                                ...getErrorBorderForReactSelect(!!errors.notificationType && touched.notificationType)
                                            }}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="d-flex mb-4">
                                        <Label className="col-form-label w-40">
                                            Notification Title
                                            <span className="text-danger">*</span>
                                        </Label>
                                        <InputComponent
                                            id="notificationTitle"
                                            type="text"
                                            name="notificationTitle"
                                            className="input-default w-65"
                                            placeholder="title"
                                            value={values.notificationTitle}
                                            invalid={!!errors?.notificationTitle && touched.notificationTitle}
                                            onChange={(e) => setFieldValue('notificationTitle', e.target.value)}
                                            validations={['required']}
                                            title={values.notificationTitle}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="d-flex mb-4">
                                        <Label className="col-form-label w-40">
                                            Notification Data label
                                            <span className="text-danger">*</span>
                                        </Label>
                                        <InputComponent
                                            id="notificationDataLabel"
                                            type="text"
                                            name="notificationDataLabel"
                                            className="input-default w-65"
                                            placeholder="label"
                                            value={values.notificationDataLabel}
                                            invalid={!!errors?.notificationDataLabel && touched.notificationDataLabel}
                                            onChange={(e) => setFieldValue('notificationDataLabel', e.target.value)}
                                            validations={['required']}
                                            title={values.notificationDataLabel}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="d-flex mb-4">
                                        <Label className="col-form-label w-40">
                                            Notification Body
                                            <span className="text-danger">*</span>
                                        </Label>
                                        <InputComponent
                                            id="notificationBody"
                                            type="text"
                                            name="notificationBody"
                                            className="input-default w-65"
                                            placeholder="body"
                                            value={values.notificationBody}
                                            invalid={!!errors?.notificationBody && touched.notificationBody}
                                            onChange={(e) => setFieldValue('notificationBody', e.target.value)}
                                            validations={['required']}
                                            title={values.notificationBody}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="d-flex mb-4">
                                        <Label className="col-form-label w-40">
                                            User Type
                                            <span className="text-danger">*</span>
                                        </Label>
                                        <Select
                                            value={values.userType}
                                            onChange={(e) => {
                                                setFieldValue('userType', e);
                                            }}
                                            className="w-65"
                                            name="userType"
                                            id="userType"
                                            options={indianStatesWithId}
                                            placeholder="Select User type"
                                            components={{
                                                IndicatorSeparator: () => null
                                            }}
                                            styles={{
                                                ...formSelectDefault,
                                                ...getErrorBorderForReactSelect(!!errors.userType && touched.userType)
                                            }}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} className="d-flex mb-4">
                                        <Label className="col-form-label w-40">
                                            Notification Link
                                            <span className="text-danger">*</span>
                                        </Label>
                                        <InputComponent
                                            id="notificationLink"
                                            type="text"
                                            name="notificationLink"
                                            className="input-default w-65"
                                            placeholder="notification link"
                                            value={values.notificationLink}
                                            invalid={!!errors?.notificationLink && touched.notificationLink}
                                            onChange={(e) => {
                                                setFieldValue('notificationLink', e.target.value);
                                            }}
                                            validations={['required']}
                                            title={values.notificationLink}
                                        />
                                    </Col>
                                    {/* <Col xs={12} sm={12} md={4} lg={6} xl={6} xxl={6} className="d-flex mb-4 align-items-center">
                                        <Label className="col-form-label w-40">Notification Image</Label>
                                        <div>
                                            <label htmlFor="upload-input" className="d-flex align-items-center w-100">
                                                <i className="ri-upload-2-line text-primary fs-18 me-1"></i>
                                                {values.photos ? (
                                                    <>
                                                        <img
                                                            src={URL.createObjectURL(values.photos)}
                                                            alt="Preview"
                                                            className="image-selected me-1"
                                                        />
                                                        <small>
                                                            {values.photos?.name.slice(0, 14)
                                                                ? `${values.photos?.name.slice(0, 14)}...`
                                                                : null}
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
                                </Row>
                                <div className=" d-flex justify-content-end">
                                    <button
                                        type="button"
                                        className="btn btn-md btn-primary "
                                        data-bs-dismiss="modal"
                                        onClick={handleSubmit}
                                        disabled={SaveNotificationAPIData?.[FetchingKey]}
                                    >
                                        Send
                                    </button>
                                </div>
                            </>
                        )}
                    </Formik>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default SendNotification;
