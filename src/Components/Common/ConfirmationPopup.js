import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import React from 'react';

import { useTrans } from '../../Components/Hooks/UserHooks';

const ConfirmationPopup = ({ show, onCloseClick, confirmText, handleSubmit, hideButtons, headerText, dangerText }) => {
    const t = useTrans('referral');

    return (
        <Modal isOpen={show} toggle={onCloseClick} centered={true} size="lg">
            {hideButtons ? (
                <ModalHeader className="bg-soft-primary" toggle={onCloseClick}>
                    {headerText ? headerText : t('Confirm')}
                </ModalHeader>
            ) : (
                <ModalHeader className="bg-soft-primary">{headerText ? headerText : t('Confirm')}</ModalHeader>
            )}
            <ModalBody className="py-3 px-5">
                {dangerText ? (
                    <div>
                        <p className="heavy-wt text-danger"> {confirmText}</p>
                    </div>
                ) : (
                    <div>
                        <p className="heavy-wt">{confirmText}</p>
                    </div>
                )}
                {!hideButtons && (
                    <div className=" float-right">
                        <button
                            id="continue"
                            type="button"
                            className="btn btn-md btn-primary "
                            data-bs-dismiss="modal"
                            onClick={handleSubmit}
                        >
                            {t('translation:continue')}
                        </button>
                        <button id="cancel" type="button" className="btn btn-md ms-3 btn-outline-primary" onClick={onCloseClick}>
                            {t('translation:cancel')}
                        </button>
                    </div>
                )}
            </ModalBody>
        </Modal>
    );
};

ConfirmationPopup.propTypes = {
    onCloseClick: PropTypes.func,
    handleSubmit: PropTypes.func,
    show: PropTypes.any
};

export default ConfirmationPopup;
