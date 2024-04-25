import React, { useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { dateInRequireFormate } from '../../Components/Common/Util';
import { Row, Col } from 'reactstrap';
import { Formik } from 'formik';
import { singleDateTimeSlotIntialValues } from './timeSlotsUtils';
import { singleDateslotSchema } from '../../common/validationSchema';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { GetAllTimeSlotsAPI, createIndividualTimeSlotsAPI } from '../../helpers/APIs/CommonAPIs';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';

const SingleDateSlot = ({ onCloseClick, popUpClose }) => {
    const [startValue, setStartValue] = useState(null);
    const [endValue, setEndValue] = useState(null);
    const [valueErrors, setValueErrors] = useState('');

    const createIndividualTimeSlotsAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, createIndividualTimeSlotsAPI));

    useEffect(() => {
        if (createIndividualTimeSlotsAPIData?.[DataKey]?.isSuccess) {
            popUpClose();
            toast.success('Slots Created Successfully');
            removeAPIDataAction('createIndividualTimeSlotsAPI');
            callAPIAction(GetAllTimeSlotsAPI);
        } else if (createIndividualTimeSlotsAPIData?.[ErrorKey] && !createIndividualTimeSlotsAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(createIndividualTimeSlotsAPIData, 'createIndividualTimeSlotsAPI');
        }
    }, [createIndividualTimeSlotsAPIData]);

    const handleAddSlot = (setFieldValue, values) => {
        if (!startValue || !endValue) {
            setValueErrors({
                startValue: !startValue,
                endValue: !endValue
            });
            return;
        }
        setFieldValue('timeSlots', [...values.timeSlots, { from: startValue, to: endValue }]);
        setStartValue(null);
        setEndValue(null);
    };

    const handleDelete = (setFieldValue, values, idx) => {
        setFieldValue(
            'timeSlots',
            values?.timeSlots?.filter((time, i) => i !== idx)
        );
    };

    const handleSave = (values) => {
        let timeSlots = values?.timeSlots.map((slot) => {
            return {
                from: moment(slot?.from[0]).format('hh:mm A'),
                to: moment(slot?.to[0]).format('hh:mm A')
            };
        });
        callAPIAction(createIndividualTimeSlotsAPI, null, { date: new Date(values.date[0]), timeSlots });
    };

    return (
        <Formik
            initialValues={singleDateTimeSlotIntialValues}
            validationSchema={singleDateslotSchema}
            onSubmit={handleSave}
            enableReinitialize={true}
        >
            {({ setFieldValue, values, errors, handleSubmit, touched, handleBlur }) => (
                <div>
                    <div className="div-date-container">
                        <label htmlFor="date" className="label-date">
                            Select Date <span className="text-danger">*</span>
                        </label>

                        <Flatpickr
                            id="Date"
                            className={`w-40 form-control ${!!errors?.date && touched.date ? 'border-danger' : ''}`}
                            value={''}
                            onChange={(e) => {
                                setFieldValue('date', e);
                            }}
                            placeholder="Date"
                            options={{
                                minDate: new Date(),
                                formatDate: (date) => {
                                    return dateInRequireFormate(date, 'm/d/y');
                                }
                            }}
                        />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="date" className="label-date">
                            Create Time Slots
                        </label>

                        <Row>
                            <Col xs={12} sm={12} md={4} lg={4} xl={4} xxl={4}>
                                <Flatpickr
                                    id="from"
                                    className={`w-80 form-control ${valueErrors?.startValue ? 'border-danger' : ''}`}
                                    value={startValue}
                                    onChange={(e) => {
                                        setStartValue(e);
                                        setEndValue('');
                                        setValueErrors('');
                                    }}
                                    placeholder="From"
                                    options={{
                                        enableTime: true,
                                        noCalendar: true,
                                        dateFormat: 'h:i K'
                                    }}
                                />
                            </Col>
                            <Col xs={12} sm={12} md={4} lg={4} xl={4} xxl={4}>
                                <Flatpickr
                                    id="to"
                                    className={`w-80 form-control ${valueErrors?.endValue ? 'border-danger' : ''}`}
                                    value={endValue}
                                    onChange={(e) => {
                                        setEndValue(e);
                                        setValueErrors('');
                                    }}
                                    placeholder="To"
                                    options={{
                                        enableTime: true,
                                        noCalendar: true,
                                        dateFormat: 'h:i K',
                                        minTime: startValue && new Date(new Date(startValue[0])?.getTime() + 5 * 60000)
                                    }}
                                />
                            </Col>
                            <Col xs={12} sm={12} md={2} lg={2} xl={2} xxl={2}>
                                <button
                                    className="btn btn-md btn-outline-primary"
                                    type="submit"
                                    onClick={() => handleAddSlot(setFieldValue, values)}
                                >
                                    Add
                                </button>
                            </Col>
                        </Row>
                        {values.timeSlots?.length > 0 ? (
                            <>
                                <h5 className="mt-4">Selected Slots</h5>
                                <div className="show-all-time-slots-container d-flex ">
                                    {values.timeSlots?.map((timeSlot, index) => {
                                        return (
                                            <p
                                                className="d-flex align-items-center border border-1 rounded-2 px-2 py-2 w-max-content me-2"
                                                key={index}
                                            >
                                                <span>
                                                    {moment(timeSlot?.from[0]).format('hh:mm A')} -
                                                    {moment(timeSlot?.to[0]).format('hh:mm A')}
                                                </span>
                                                <i
                                                    class="ri-close-line fs-18 text-danger ms-3 cursor-pointer"
                                                    onClick={() => handleDelete(setFieldValue, values, index)}
                                                />
                                            </p>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            errors.timeSlots && touched.date && <p className="text-danger mt-9">{errors.timeSlots}</p>
                        )}
                    </div>
                    <div className="d-flex align-items-center justify-content-end mt-8">
                        <button
                            className="btn btn-md btn-primary"
                            type="submit"
                            onClick={handleSubmit}
                            disabled={createIndividualTimeSlotsAPIData?.[FetchingKey]}
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="btn btn-md ms-3 btn-outline-primary"
                            id="cancel"
                            onClick={onCloseClick}
                            disabled={createIndividualTimeSlotsAPIData?.[FetchingKey]}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </Formik>
    );
};

export default SingleDateSlot;
