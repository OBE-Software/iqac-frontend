import React, { useState } from 'react';
import SearchOption from '../../Components/Common/SearchOption';
import Select from 'react-select';
import { formSelectDefault } from '../../Components/constants/styles';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { GetAllBranchesAPI, GetAllCentersAPI } from '../../helpers/APIs/CommonAPIs';
import { FetchingKey } from '../../Store/callAPI/allAPIs';
import { callAPIAction } from '../../Store/callAPI/actions';
import { toast } from 'react-toastify';
import ExportToExcel from '../../Components/Common/ExportToExcel';
import DownloadDataComponent from '../../Components/Common/DownloadDataComponent';
import { exportToJson } from '../../Components/Common/Util';
import exportFromJSON from 'export-from-json';

const BranchTableHeader = ({ centersList, branchData, selectedData }) => {
    const [center, setCenter] = useState('');
    const [value, setValue] = useState('');

    const GetAllCentersAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllCentersAPI));
    const GetAllBranchesAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllBranchesAPI));

    const handleSearch = (e) => {
        e.preventDefault();

        if (value) {
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            if (center) queryParams['centerId'] = center?._id;
            if (value) queryParams['search'] = value;
            callAPIAction(GetAllBranchesAPI, null, null, queryParams);
        }
    };
    const handleSelect = (e) => {
        if (e) {
            const queryParams = {
                page: 1,
                pageSize: 10,
                centerId: e._id
            };
            if (value) queryParams['search'] = value;
            callAPIAction(GetAllBranchesAPI, null, null, queryParams);
            setCenter(e);
        } else {
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            if (value) queryParams['search'] = value;
            callAPIAction(GetAllBranchesAPI, null, null, queryParams);
            setCenter('');
        }
    };

    const onChangeData = (val) => {
        if (val.length > 50) {
            toast.error('Search value should not be more than 50 characters');
            return;
        }
        if (!val) {
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            if (center) queryParams['centerId'] = center?._id;
            callAPIAction(GetAllBranchesAPI, null, null, queryParams);
        }
        setValue(val);
    };

    const donwloadExcel = () => {
        ExportToExcel(selectedData?.length ? selectedData : branchData, 'branchData.xlsx');
    };

    const donwloadJson = () => {
        exportToJson(selectedData?.length ? selectedData : branchData, 'testData.json');
    };
    const donwloadXML = () => {
        const finalData = selectedData?.length ? selectedData : branchData;
        const data = finalData?.map((data) => {
            return {
                ...data
            };
        });
        exportFromJSON({
            data,
            fineName: 'branchData.xml',
            exportType: 'xml'
        });
    };
    return (
        <div className="d-flex justify-content-between w-100">
            <div className="me-8 d-flex align-items-center gap-2">
                {/* Download :
                <i
                    class="ri-file-excel-2-line text-success cursor-pointer fs-22"
                    onClick={() => {
                        ExportToExcel(selectedData?.length ? selectedData : branchData, 'branchData.xlsx');
                    }}
                ></i> */}
                <DownloadDataComponent donwloadExcel={donwloadExcel} donwloadJson={donwloadJson} donwloadXML={donwloadXML} />
            </div>
            <div className="d-flex w-40 justify-content-end">
                <SearchOption setValue={setValue} value={value} handleSearch={handleSearch} onChangeData={onChangeData} />
                <Select
                    id="centerId"
                    value={center}
                    onChange={handleSelect}
                    className="w-50 ms-6"
                    name="centerId"
                    isLoading={GetAllCentersAPIData?.[FetchingKey]}
                    options={centersList}
                    placeholder="Select Center"
                    components={{
                        IndicatorSeparator: () => null
                    }}
                    styles={{
                        ...formSelectDefault
                    }}
                    isClearable
                    getOptionLabel={(e) => e.centerName}
                    getOptionValue={(e) => e._id}
                    isDisabled={GetAllBranchesAPIData?.[FetchingKey]}
                />
            </div>
        </div>
    );
};

export default BranchTableHeader;
