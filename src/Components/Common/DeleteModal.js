import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import PropTypes from 'prop-types';

const DeleteModal = ({ show, onDeleteClick, onCloseClick, disableButton }) => {
    return (
        <Modal isOpen={show} toggle={onCloseClick} centered={true}>
            <ModalBody className="py-3 px-5">
                <div className="mt-2 text-center">
                    <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                        <h4>Are you sure ?</h4>
                        <p className="text-muted mx-4 mb-0">Are you sure you want to remove this record ?</p>
                    </div>
                </div>
                <div className="d-flex gap-2 justify-content-end mt-4 mb-2">
                    <button
                        type="button"
                        className="btn btn-md btn-primary "
                        id="delete-record"
                        onClick={onDeleteClick}
                        disabled={disableButton}
                    >
                        Yes, Delete It!
                    </button>
                    <button
                        type="button"
                        id="close"
                        className="btn w-sm btn-outline-primary"
                        data-bs-dismiss="modal"
                        onClick={onCloseClick}
                    >
                        Close
                    </button>
                </div>
            </ModalBody>
        </Modal>
    );
};

DeleteModal.propTypes = {
    onCloseClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    show: PropTypes.any
};

export default DeleteModal;
