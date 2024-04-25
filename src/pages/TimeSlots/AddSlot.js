import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SingleDateSlots from './SingleDateSlots';
import DateRangeSlots from './DateRangeSlots';

const AddSlot = ({ onCloseClick }) => {
    const [showSingleDateSlot, setShowSingleDateSlot] = useState(false);
    const [showDateRangeSlot, setShowDateRangeSlot] = useState(false);
    const [isSlotCreateClicked, setIsSlotCreatCliked] = useState(false);
    const handleCancel = () => {
        setIsSlotCreatCliked(false);
    };
    return (
        <>
            <Modal isOpen={true} toggle={onCloseClick} centered={true} size="lg">
                <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                    {isSlotCreateClicked ? (
                        <p className="mb-0 me-3">Add Time Slots </p>
                    ) : (
                        <p className="mb-0">How do you want to add slot ? </p>
                    )}

                    <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer " onClick={onCloseClick}></i>
                </ModalHeader>

                {isSlotCreateClicked ? (
                    <ModalBody className="py-3 px-5">
                        {(showSingleDateSlot && <SingleDateSlots onCloseClick={handleCancel} popUpClose={onCloseClick} />) ||
                            (showDateRangeSlot && <DateRangeSlots onCloseClick={handleCancel} popUpClose={onCloseClick} />)}
                    </ModalBody>
                ) : (
                    <ModalBody className="py-3 px-5 d-flex align-items-center justify-content-center">
                        <div className="d-flex">
                            <button
                                className="btn-slots individual-slots-btn me-3"
                                onClick={() => {
                                    setShowSingleDateSlot(true);
                                    setShowDateRangeSlot(false);
                                    setIsSlotCreatCliked(true);
                                }}
                            >
                                <AdsClickIcon className="icon" />
                                <span className="fs-16 mt-2">Add Time slots</span>
                                <p className="text-muted">Add custom slots manually</p>
                            </button>
                            <button
                                className="btn-slots multiple-slots-btn"
                                onClick={() => {
                                    setShowSingleDateSlot(false);
                                    setShowDateRangeSlot(true);
                                    setIsSlotCreatCliked(true);
                                }}
                            >
                                <AutoAwesomeIcon className="icon" />

                                <span className="fs-16 mt-2">Generate Time slots</span>
                                <p className="text-muted mb-2">Generate common slots for a set number of days.</p>
                            </button>
                        </div>
                    </ModalBody>
                )}
            </Modal>
        </>
    );
};

export default AddSlot;
