import React, { useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { dateInRequireFormate } from '../../Components/Common/Util';
import { Row, Col } from 'reactstrap';
import { Formik } from 'formik';
import { dateRangeTimeslotSchema } from '../../common/validationSchema';
import { dateRangeTimeSlotIntialValues, getSlotDurationDiff } from './timeSlotsUtils';
import moment from 'moment';
import { GetAllTimeSlotsAPI, createMultipleTImeSlotsAPI } from '../../helpers/APIs/CommonAPIs';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { useSelector } from 'react-redux';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import Select from 'react-select';
import { formSelectDefault } from '../../Components/constants/styles';
import { getErrorBorderForReactSelect } from '../../common/utils';
import { toast } from 'react-toastify';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';

const DateRangeSlots = ({ onCloseClick, popUpClose }) => {
    const [startValue, setStartValue] = useState(null);
    const [endValue, setEndValue] = useState(null);
    const [valueErrors, setValueErrors] = useState('');

    const createMultipleTImeSlotsAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, createMultipleTImeSlotsAPI));

    useEffect(() => {
        if (createMultipleTImeSlotsAPIData?.[DataKey]?.isSuccess) {
            popUpClose();
            toast.success('Slots Created Successfully');
            removeAPIDataAction('createMultipleTImeSlotsAPI');
            callAPIAction(GetAllTimeSlotsAPI);
        } else if (createMultipleTImeSlotsAPIData?.[ErrorKey] && !createMultipleTImeSlotsAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(createMultipleTImeSlotsAPIData, 'createMultipleTImeSlotsAPI');
        }
    }, [createMultipleTImeSlotsAPIData]);

    const handleAddSlot = (setFieldValue, values) => {
        const startTime = moment(startValue, 'ddd MMM DD YYYY HH:mm:ss ZZ');
        const endTime = moment(endValue, 'ddd MMM DD YYYY HH:mm:ss ZZ');

        // Calculate the difference in minutes between end time and start time
        const differenceInMinutes = endTime.diff(startTime, 'minutes');

        if (values.duration && values.duration.value && values.date && values.date.length === 2) {
            const durationInMinutes = values.duration.value;

            let timeSlots = [];

            for (let i = 0; i < differenceInMinutes / durationInMinutes; i++) {
                const slotStartTime = new Date(startTime).getTime() + i * durationInMinutes * 60000;
                const slotEndTime = new Date(slotStartTime).getTime() + durationInMinutes * 60000;

                timeSlots.push({
                    from: [slotStartTime],
                    to: [slotEndTime]
                });
            }

            setFieldValue('timeSlots', timeSlots);
            setFieldValue('timeSlots', timeSlots);
        }
    };

    const handleDelete = (setFieldValue, values, idx) => {
        setFieldValue(
            'timeSlots',
            values?.timeSlots?.filter((time, i) => i !== idx)
        );
    };

    const handleSave = (values) => {
        // Map time slots to required format for API payload
        const timeSlotsFormatted = values?.timeSlots.map((slot) => {
            return {
                from: moment(slot?.from[0]).format('hh:mm A'),
                to: moment(slot?.to[0]).format('hh:mm A')
            };
        });

        // Prepare payload for API call
        const payload = {
            startDate: new Date(values.date[0]), // Assuming 'date' is an array with start and end dates
            endDate: new Date(values.date[1]),
            generatedTimeSlots: timeSlotsFormatted
        };

        // Call the API to create multiple time slots
        callAPIAction(createMultipleTImeSlotsAPI, null, payload);
    };

    return (
        <Formik
            initialValues={dateRangeTimeSlotIntialValues}
            validationSchema={dateRangeTimeslotSchema}
            onSubmit={handleSave}
            enableReinitialize={true}
        >
            {({ setFieldValue, values, errors, handleSubmit, touched, handleBlur }) => (
                <div>
                    <div>
                        <label htmlFor="date" className="label-date">
                            Select Range <span className="text-danger">*</span>
                        </label>

                        <Flatpickr
                            id="Date"
                            className={`w-40 form-control ${!!errors?.date && touched.date ? 'border-danger' : ''}`}
                            value={''}
                            onChange={(e) => {
                                setFieldValue('date', e);
                            }}
                            placeholder="Date Range"
                            options={{
                                minDate: new Date(),
                                formatDate: (date) => {
                                    return dateInRequireFormate(date, 'm/d/y');
                                },
                                mode: 'range'
                            }}
                        />
                    </div>
                    <div className="mt-6">
                        <label htmlFor="date" className="label-date">
                            Select Duration <span className="text-danger">*</span>
                        </label>
                        <Select
                            value={values.duration}
                            onChange={(e) => {
                                setFieldValue('duration', e);
                                setStartValue('');
                                setEndValue('');
                            }}
                            className="w-40"
                            name="duration"
                            id="duration"
                            options={getSlotDurationDiff()}
                            placeholder="Select"
                            components={{
                                IndicatorSeparator: () => null
                            }}
                            styles={{
                                ...formSelectDefault,
                                ...getErrorBorderForReactSelect(!!errors.duration && touched.duration)
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
                                    className={`w-90 form-control ${valueErrors?.startValue ? 'border-danger' : ''}`}
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
                                    disabled={!values.date || !values.duration}
                                />
                            </Col>
                            <Col xs={12} sm={12} md={4} lg={4} xl={4} xxl={4}>
                                <Flatpickr
                                    id="to"
                                    className={`w-90 form-control ${valueErrors?.endValue ? 'border-danger' : ''}`}
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
                                        minTime:
                                            startValue && new Date(new Date(startValue[0])?.getTime() + values?.duration?.value * 60000)
                                    }}
                                    disabled={!values.date || !values.duration}
                                />
                            </Col>
                            <Col xs={12} sm={12} md={2} lg={2} xl={2} xxl={2}>
                                <button
                                    className="btn btn-md btn-outline-primary"
                                    type="submit"
                                    onClick={() => handleAddSlot(setFieldValue, values)}
                                    disabled={!values.date || !values.duration}
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
                            disabled={createMultipleTImeSlotsAPIData?.[FetchingKey]}
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="btn btn-md ms-3 btn-outline-primary"
                            id="cancel"
                            onClick={onCloseClick}
                            disabled={createMultipleTImeSlotsAPIData?.[FetchingKey]}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </Formik>
    );
};

export default DateRangeSlots;
