import React, { useEffect, useState } from 'react';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { ModalBody, Card } from 'reactstrap';
import moment from 'moment';
import { GetAllTimeSlotsAPI, dayOffSlotsAPI, deleteTimeSlotsAPI } from '../../helpers/APIs/CommonAPIs';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { CommonLoadingSkelton } from '../../Components/Common/skelton';
import IOSSwitch from '../../Components/Common/IosSwitch';
import AddSlot from './AddSlot';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import { dateInRequireFormate } from '../../Components/Common/Util';
import Flatpickr from 'react-flatpickr';
import { deleteTimeSlotIdURL } from '../../helpers/APIs/CustomURL';
import { Tooltip } from '@mui/material';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';

const TimeSlots = () => {
    const [showSlotModal, setShowSlotModal] = useState(false);
    const [getDate, setGetDate] = useState([]);
    const [slotsData, setSlotsData] = useState([]);
    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));

    const GetAllTimeSlotsData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllTimeSlotsAPI));
    const dayOffSlotsAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, dayOffSlotsAPI));
    const deleteTimeSlotsAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, deleteTimeSlotsAPI));
    const permissiondata = profileData.permissionData?.find((item) => item.module === 'Time Slots');

    useEffect(() => {
        callAPIAction(GetAllTimeSlotsAPI);
    }, []);

    useEffect(() => {
        if (GetAllTimeSlotsData?.[DataKey]?.isSuccess) {
            const data = GetAllTimeSlotsData?.[DataKey]?.data;
            setSlotsData(data);
        } else {
            setSlotsData([]);
        }
    }, [GetAllTimeSlotsData]);

    useEffect(() => {
        if (deleteTimeSlotsAPIData?.[DataKey]?.isSuccess) {
            toast.success('Time slot is deleted');
            removeAPIDataAction('deleteTimeSlotsAPI');

            callAPIAction(GetAllTimeSlotsAPI);
        } else if (deleteTimeSlotsAPIData?.[ErrorKey] && !deleteTimeSlotsAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(deleteTimeSlotsAPIData, 'deleteTimeSlotsAPI');
        }
    }, [deleteTimeSlotsAPIData]);

    const handleDayOff = (isChecked, id) => {
        const data = {
            date: id,
            dayOff: isChecked
        };
        callAPIAction(dayOffSlotsAPI, null, data);
    };

    const handleDeleteTimeSlot = (dateID, slotsID) => {
        callAPIAction(deleteTimeSlotsAPI, deleteTimeSlotIdURL(dateID, slotsID));
    };

    const handleDate = (e) => {
        let queryParams = null;
        // const startValue = moment(e[0], 'ddd MMM DD YYYY HH:mm:ss ZZ').format('YYYY-MM-DD');
        // const endValue = moment(e[1], 'ddd MMM DD YYYY HH:mm:ss ZZ').fromat('YYYY-MM-DD');
        if (e.length > 0) {
            queryParams = {
                // startDate: startValue,
                // endDate: endValue === 'Invalid date' ? startValue : endValue
                startDate: e[0],
                endDate: e[1]
            };
            // queryParams['startDate'] = e[0];
            // queryParams['endDate'] = e[1];
        }

        callAPIAction(GetAllTimeSlotsAPI, null, null, queryParams);
    };

    useEffect(() => {
        if (dayOffSlotsAPIData?.[DataKey]?.isSuccess) {
            toast.success('Day is updated');
            removeAPIDataAction('dayOffSlotsAPI');
            callAPIAction(GetAllTimeSlotsAPI);
        } else if (dayOffSlotsAPIData?.[ErrorKey] && !dayOffSlotsAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(dayOffSlotsAPIData, 'deleteTimeSlotsAPI');
        }
    }, [dayOffSlotsAPIData]);

    if (GetAllTimeSlotsData?.[FetchingKey])
        return (
            <div className="freeze-spinner">
                <CommonLoadingSkelton />
            </div>
        );
    return (
        <div className="p-5 layout-container">
            <h4 className="mt-3">TimeSLots</h4>
            <BreadCrumb
                crumbs={[
                    {
                        label: 'Time Slots',
                        isLink: false
                    }
                ]}
                rightContainer={() =>
                    (profileData.roleData === 1 || permissiondata.actions.create === 1) && (
                        <button
                            className="btn btn-soft-primary btn-sm d-flex align-items-center fw-bold"
                            onClick={() => setShowSlotModal(true)}
                        >
                            <i class="ri-add-fill fs-16 fw-bold"></i>Add TimeSlots
                        </button>
                    )
                }
            />

            <Card className="box-shadow-card">
                <ModalBody>
                    <div className="time-slots-container">
                        <div className="d-flex justify-content-end mb-4">
                            <div>
                                <label htmlFor="date" className="label-date">
                                    <Tooltip title="Mark the day as off">Filter Date</Tooltip>
                                </label>
                                <div className="d-flex gap-2">
                                    <Flatpickr
                                        id="Date"
                                        value={getDate}
                                        onClose={handleDate}
                                        onChange={(e) => {
                                            setGetDate(e);
                                        }}
                                        placeholder="From Date and To Date"
                                        options={{
                                            formatDate: (date) => {
                                                return dateInRequireFormate(date, 'm/d/y');
                                            },
                                            mode: 'range'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {slotsData?.length > 0 ? (
                            slotsData?.map((timeSlotsData) => (
                                <div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h3 className="text-primary">
                                            {timeSlotsData?.date && moment(timeSlotsData?.date).format('DD-MM-YYYY')}
                                        </h3>
                                        <Tooltip title="Mark the day as off">
                                            <div>
                                                {(profileData.roleData === 1 || permissiondata?.actions.edit === 1) && (
                                                    <IOSSwitch
                                                        checked={timeSlotsData?.isDayOff}
                                                        onChange={(e) => handleDayOff(e.target.checked, timeSlotsData?._id)}
                                                    />
                                                )}
                                            </div>
                                        </Tooltip>
                                    </div>

                                    {!timeSlotsData?.isDayOff ? (
                                        <div className="d-flex gap-4 overflow-auto">
                                            {timeSlotsData?.timeSlots?.length > 0 ? (
                                                timeSlotsData?.timeSlots?.map((timeSlot) => {
                                                    return (
                                                        <div className="textWrap">
                                                            <p className="border border-warning p-2 d-flex align-items-center">
                                                                <span>
                                                                    {timeSlot?.from} - {timeSlot?.to}
                                                                </span>
                                                                <Tooltip title="Delete the time slot">
                                                                    <div>
                                                                        {(profileData.roleData === 1 ||
                                                                            permissiondata?.actions.delete === 1) && (
                                                                            <i
                                                                                class="ri-close-line fs-18 text-danger ms-3 cursor-pointer"
                                                                                onClick={() =>
                                                                                    handleDeleteTimeSlot(timeSlotsData?._id, timeSlot?._id)
                                                                                }
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </Tooltip>
                                                            </p>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="border p-4 text-danger text-lg fw-bold">No timeslots found</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="border p-4 text-danger text-lg fw-bold">Day is off</p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No slots are available</p>
                        )}
                    </div>
                </ModalBody>
            </Card>

            {showSlotModal && <AddSlot onCloseClick={() => setShowSlotModal(false)} />}
        </div>
    );
};

export default TimeSlots;
