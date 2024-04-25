import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

const CreateOrder = ({ onCloseClick, isEditMode }) => {
    return (
        <Modal isOpen={true} toggle={onCloseClick} centered={true} size="lg">
            <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                <p className="mb-0">{`${isEditMode ? 'Update' : 'Create'} Order`} </p>
                <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer " onClick={onCloseClick}></i>
            </ModalHeader>
            <ModalBody className="py-3 px-5">
                {/* <Formik initialValues={formValues} validationSchema={AddCustomerSchema} onSubmit={handleSave} enableReinitialize={true}> */}
                {/* {({ setFieldValue, values, errors, handleSubmit, touched, handleBlur }) => <></>}  */}
                {/* </Formik> */}
                hello
            </ModalBody>
        </Modal>
    );
};

export default CreateOrder;
