import React, { useEffect, useState } from 'react';
import { GetAllRolesAPI, GetBranchRolesAPI, getRoleByBranchID, putPermissionManagementAPI } from '../../helpers/APIs/CommonAPIs';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { useSelector } from 'react-redux';
import { DataKey, ErrorKey, FetchingKey } from '../../Store/callAPI/allAPIs';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { callAPIAction, removeAPIDataAction } from '../../Store/callAPI/actions';
import { getBranchRoleByBranchIDURL, getBranchRolesURL, putPermissionModuleByRoleIdURL } from '../../helpers/APIs/CustomURL';
import { toast } from 'react-toastify';
import { ShowErrMsg } from '../../Components/Hooks/UserHooks';
import { permissionAddSchema } from '../../common/data/TableSchema';
import InputComponent from '../../Components/Common/InputComponent';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import { ApplicatoinModulesList, branchAdminRoleName } from '../../Components/constants/Constants';
import Select from 'react-select';
import { formSelectDefault } from '../../Components/constants/styles';
import MultiSelect from '../../Components/Common/MultiSelect';

const AddPermission = ({ handleCancel, data }) => {
    const [permissionData, setPermissionData] = useState([]);

    const putPermissionManagementAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, putPermissionManagementAPI));
    const roleData = useSelector((state) => SelectSearchValInStore(state, 'roleData'));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));

    useEffect(() => {
        // if (data?.permissionData?.length > 0) setPermissionData(data?.permissionData[0].permission);
        if (data?.permissions?.length > 0) setPermissionData(data?.permissions);
    }, [data]);

    useEffect(() => {
        if (putPermissionManagementAPIData?.[DataKey]?.isSuccess) {
            toast.success('permission updated successfully');
            removeAPIDataAction('putPermissionManagementAPI');
            handleCancel();
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            roleData !== 1
                ? callAPIAction(GetBranchRolesAPI, getBranchRolesURL(profileData?.branchId), null, queryParams)
                : callAPIAction(GetAllRolesAPI, null, null, queryParams);
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

    const handleDropDownValues = (e) => {
        const findModule = permissionData.find((per) => per.module?.toLowerCase() === e.module?.toLowerCase());

        if (findModule) {
            toast.error('Module already added.');
            return;
        }
        setPermissionData((p) => [...p, e]);
    };

    const handleSave = () => {
        const bodyData = {
            permissions: permissionData,
            roleName: data?.roleName,
            employeeDepartmentId: data?.employeeDepartmentId,
            branchId: data?.branchData?._id,
            centerId: data?.centerData?._id,
            status: data?.status
        };
        callAPIAction(putPermissionManagementAPI, putPermissionModuleByRoleIdURL(data._id), bodyData);
    };

    const showDeleteCheckBox = (moduleName) => {
        moduleName = moduleName && moduleName?.toLowerCase();
        if (moduleName === 'dashboard' || moduleName === 'dayments' || moduleName === 'bookings') {
            return false;
        }
        return true;
    };

    const showEditCheckBox = (moduleName) => {
        moduleName = moduleName && moduleName?.toLowerCase();
        if (moduleName === 'dashboard' || moduleName === 'payments') {
            return false;
        }
        return true;
    };

    const showCreateCheckBox = (moduleName) => {
        moduleName = moduleName && moduleName?.toLowerCase();

        if (moduleName === 'dashboard' || moduleName === 'payments') {
            return false;
        }
        return true;
    };
    return (
        <Modal isOpen={true} toggle={handleCancel} centered={true} size="lg">
            <ModalHeader className="bg-soft-primary d-flex align-items-center custom-modal-header p-2">
                <p className="mb-0">Edit Permissions </p>
                <i class="ri-close-line fw-bold text-danger fs-20 cursor-pointer" onClick={handleCancel}></i>
            </ModalHeader>
            <ModalBody>
                <div className=" mb-4 d-flex align-items-center justify-content-between">
                    <h6 className="mb-0">
                        Permission for <span className="text-bold fs-18 text-capitalize">{data?.roleName}</span>
                    </h6>
                    {/* <button onClick={() => {}} type="button" className="btn btn-soft-primary btn-sm me-2 ms-2 rounded-pill sm-btn">
                        <i className="ri-add-fill fs-18 fw-bold"></i>
                    </button> */}
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

                    {/* <MultiSelect
                        name="state"
                        id="state"
                        value={[]}
                        onChange={handleDropDownValues}
                        options={ApplicatoinModulesList}
                        placeholder="Add Permission"
                        isMulti
                        // isLoading={getCountiesByStatesAPIData?.[FetchingKey]}
                        className="w-60 ht-fitcontent"
                        isClearable
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        // styles={{
                        //     ...formSelectDefault,
                        //     menu: (provided) => ({ ...provided, zIndex: 2 }),
                        //     ...getSelectErrorBorder(!!errors.testSamples && touched.testSamples),
                        //     ...multiSelectScroll(true, !!errors.testSamples && touched.testSamples)
                        // }}
                        hideAll
                        getOptionLabel={(e) => e.module}
                        getOptionValue={(e) => e.id}
                    /> */}
                </div>
                <div className="d-flex align-items-center bg-light p-3 permission-table">
                    {permissionAddSchema.map((item, idx) => (
                        <p className={`mb-0 fs-16 ${item.classess} text-dark fw-bold`} key={idx}>
                            {item.Header}
                        </p>
                    ))}
                </div>
                <div className="permission-ansers">
                    {permissionData?.length > 0 ? (
                        permissionData?.map((item, idx) => (
                            <div className="d-flex align-items-center p-3" key={item?._id}>
                                <p className="b-0 fs-16 mb-0 w-40 titleCase">{item?.module}</p>

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
                        <p className="ps-3 pt-3">No records found</p>
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
                            onClick={handleCancel}
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

export default AddPermission;

const AddSingleModule = () => {
    <Modal isOpen={true} toggle={() => {}} centered={true} size="sm">
        <ModalBody>hello</ModalBody>
    </Modal>;
};
