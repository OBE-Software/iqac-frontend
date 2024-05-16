import React, { useState } from 'react';
import DownloadDataComponent from '../../Components/Common/DownloadDataComponent';
import SearchOption from '../../Components/Common/SearchOption';
import ExportToExcel from '../../Components/Common/ExportToExcel';
import { exportToJson } from '../../Components/Common/Util';
import exportFromJSON from 'export-from-json';
import { callAPIAction } from '../../Store/callAPI/actions';
import { GetAllEmpDepartmentAPI } from '../../helpers/APIs/CommonAPIs';
import { toast } from 'react-toastify';

const DepartmentTableHeader = ({ selectedData }) => {
    const [value, setValue] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();

        if (value) {
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            if (value) queryParams['search'] = value;
            callAPIAction(GetAllEmpDepartmentAPI, null, null, queryParams);
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
            callAPIAction(GetAllEmpDepartmentAPI, null, null, queryParams);
        }
        setValue(val);
    };

    const donwloadExcel = () => {
        ExportToExcel(selectedData?.length ? selectedData : '', 'branchesData.xlsx');
    };

    const donwloadJson = () => {
        exportToJson(selectedData?.length ? selectedData : '', 'branchesData.json');
    };

    const donwloadXML = () => {
        const finalData = selectedData?.length ? selectedData : '';
        const data = finalData?.map((data) => {
            return {
                ...data
            };
        });
        exportFromJSON({
            data,
            fineName: 'branchesData.xml',
            exportType: 'xml'
        });
    };

    return (
        <div className="d-flex justify-content-between w-100">
            <DownloadDataComponent donwloadExcel={donwloadExcel} donwloadJson={donwloadJson} donwloadXML={donwloadXML} />

            <div></div>
            <SearchOption setValue={setValue} value={value} handleSearch={handleSearch} onChangeData={onChangeData} />
        </div>
    );
};

export default DepartmentTableHeader;
