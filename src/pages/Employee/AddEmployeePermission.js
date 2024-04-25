import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { toast } from 'react-toastify';
import Select from 'react-select';

import { GetAllEmployeeAPI, GetBranchEmployeesByBranchId, putPermissionManagementAPI } from '../../helpers/APIs/CommonAPIs';
import InputComponent from '../../Components/Common/InputComponent';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import { getBranchEmployeesByBranchIdURL, putPermissionModuleByEmployeeIdURL } from '../../helpers/APIs/CustomURL';
import { ApplicatoinModulesList, branchAdminRoleName } from '../../Components/constants/Constants';
import { permissionAddSchema } from '../../common/data/TableSchema';
import { formSelectDefault } from '../../Components/constants/styles';

const AddEmployeePermission = ({ data, onCloseClick }) => {
    const [permissionData, setPermissionData] = useState([]);
    const putPermissionManagementAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, putPermissionManagementAPI));
    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));

    useEffect(() => {
        // if (data?.permissionData?.length > 0) setPermissionData(data?.permissionData[0].permission);
        if (data?.permissionData?.length > 0) setPermissionData(data?.permissionData[0]);
    }, [data]);

    useEffect(() => {
        if (putPermissionManagementAPIData?.[DataKey]?.isSuccess) {
            toast.success('permission updated successfully');
            removeAPIDataAction('putPermissionManagementAPI');
            onCloseClick();
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            roleData?.roleName === branchAdminRoleName
                ? callAPIAction(GetBranchEmployeesByBranchId, getBranchEmployeesByBranchIdURL(profileData?.branchId), null, queryParams)
                : callAPIAction(GetAllEmployeeAPI, null, null, queryParams);
        } else if (putPermissionManagementAPIData?.[ErrorKey] && !putPermissionManagementAPIData[DataKey]?.isSuccess) {
            ShowErrMsg(putPermissionManagementAPIData, 'putPermissionManagementAPI');
        }
    }, [putPermissionManagementAPIData]);

    const handleCheck = (idx, type, e) => {
        const dataObj = JSON.parse(JSON.stringify(permissionData));
        let updateObj = permissionData[idx];
        const updateActions = {
            ...permissionData[idx].actions,
            [type]: e.target.checked ? 1 : 0
        };
        updateObj = {
            ...permissionData[idx],
            actions: updateActions
        };
        dataObj[idx] = updateObj;
        setPermissionData(dataObj);
    };

    const handleSave = () => {
        callAPIAction(putPermissionManagementAPI, putPermissionModuleByEmployeeIdURL(data._id), { permissionData: permissionData });
    };
    const handleDropDownValues = (e) => {
        const findModule = permissionData.find((per) => per.module.toLowerCase() === e.module.toLowerCase());
        if (findModule) {
            toast.error('Module already added.');
            return;
        }
        setPermissionData((p) => [...p, e]);
    };
    const showDeleteCheckBox = (moduleName) => {
        moduleName = moduleName && moduleName.toLowerCase();
        if (moduleName === 'dashboard' || moduleName === 'dayments' || moduleName === 'bookings') {
            return false;
        }
        return true;
    };

    const showEditCheckBox = (moduleName) => {
        moduleName = moduleName && moduleName.toLowerCase();
        if (moduleName === 'dashboard' || moduleName === 'payments') {
            return false;
        }
        return true;
    };

    const showCreateCheckBox = (moduleName) => {
        moduleName = moduleName && moduleName.toLowerCase();

        if (moduleName === 'dashboard' || moduleName === 'payments') {
            return false;
        }
        return true;
    };

    return (
        <Modal isOpen={true} toggle={onCloseClick} centered={true} size="lg">
            <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                <p className="mb-0">Edit Permissions </p>
                <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer" onClick={onCloseClick}></i>
            </ModalHeader>
            <ModalBody>
                <div className=" mb-4 d-flex align-items-center  justify-content-between">
                    <h6 className="mb-0">
                        Permission for <span className="text-bold fs-18 text-capitalize">{data?.roleName}</span>
                    </h6>
                    <Select
                        value={''}
                        onChange={handleDropDownValues}
                        className="w-30"
                        name="state"
                        id="state"
                        options={ApplicatoinModulesList}
                        placeholder="Add Permission"
                        components={{
                            IndicatorSeparator: () => null
                        }}
                        styles={{
                            ...formSelectDefault
                        }}
                        getOptionLabel={(e) => e.module}
                        getOptionValue={(e) => e.module}
                    />
                </div>
                <div className="d-flex align-items-center bg-light p-3 permission-table">
                    {permissionAddSchema.map((item) => (
                        <p className={`mb-0 fs-16 ${item.classess} text-dark fw-bold`}>{item.Header}</p>
                    ))}
                </div>
                <div className="permission-ansers">
                    {permissionData?.length > 0 ? (
                        permissionData?.map((item, idx) => (
                            <div className="d-flex align-items-center p-3" key={item?._id}>
                                <p className="b-0 fs-16 mb-0 w-40">{item?.module}</p>
                                {/* <p className="b-0 fs-16 mb-0 w-15">{item?.actions?.create ? 'Yes' : 'No'}</p> */}
                                <div className="w-15">
                                    {showCreateCheckBox(item.module) && (
                                        <InputComponent
                                            className="form-check-input"
                                            type="checkbox"
                                            name="insuranceProgram"
                                            id={'create'}
                                            checked={item?.actions?.create === 1}
                                            value={1}
                                            onChange={(e) => handleCheck(idx, 'create', e)}
                                            disabled={false}
                                        />
                                    )}
                                </div>
                                <div className="w-15">
                                    {showEditCheckBox(item.module) && (
                                        <InputComponent
                                            className="form-check-input"
                                            type="checkbox"
                                            name="insuranceProgram"
                                            id={'edit'}
                                            checked={item?.actions?.edit === 1}
                                            value={1}
                                            onChange={(e) => handleCheck(idx, 'edit', e)}
                                            disabled={false}
                                        />
                                    )}
                                </div>
                                <div className="w-15">
                                    <InputComponent
                                        className="form-check-input"
                                        type="checkbox"
                                        name="insuranceProgram"
                                        id={'view'}
                                        checked={item?.actions?.view === 1}
                                        value={1}
                                        onChange={(e) => handleCheck(idx, 'view', e)}
                                        disabled={false}
                                    />
                                </div>
                                <div className="w-15">
                                    {showDeleteCheckBox(item.module) && (
                                        <InputComponent
                                            className="form-check-input"
                                            type="checkbox"
                                            name="insuranceProgram"
                                            id={'delete'}
                                            checked={item?.actions?.delete === 1}
                                            value={1}
                                            onChange={(e) => handleCheck(idx, 'delete', e)}
                                            disabled={false}
                                        />
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No records found</p>
                    )}
                </div>

                <div>
                    <div className=" float-right d-flex mt-8">
                        <button
                            type="button"
                            className="btn btn-md btn-primary "
                            data-bs-dismiss="modal"
                            onClick={handleSave}
                            id="branch save"
                            disabled={putPermissionManagementAPIData?.[FetchingKey]}
                        >
                            Save
                        </button>

                        <button
                            type="button"
                            className="btn btn-md ms-3 btn-outline-primary"
                            id="medsCancel"
                            onClick={onCloseClick}
                            disabled={putPermissionManagementAPIData?.[FetchingKey]}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default AddEmployeePermission;
