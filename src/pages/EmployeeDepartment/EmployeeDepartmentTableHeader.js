import React, { useState } from 'react';
import SearchOption from '../../Components/Common/SearchOption';
import { GetAllEmpDepartmentAPI } from '../../helpers/APIs/CommonAPIs';
import { callAPIAction } from '../../Store/callAPI/actions';
import { toast } from 'react-toastify';
import ExportToExcel from '../../Components/Common/ExportToExcel';
import { exportToJson } from '../../Components/Common/Util';
import DownloadDataComponent from '../../Components/Common/DownloadDataComponent';
import exportFromJSON from 'export-from-json';

const EmployeeDepartmentTableHeader = ({ selectedData, branchesData }) => {
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
        ExportToExcel(selectedData?.length ? selectedData : branchesData, 'branchesData.xlsx');
    };

    const donwloadJson = () => {
        exportToJson(selectedData?.length ? selectedData : branchesData, 'branchesData.json');
    };

    const donwloadXML = () => {
        const finalData = selectedData?.length ? selectedData : branchesData;
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
            <DownloadDataComponent donwloadExcel={donwloadExcel} donwloadJson={donwloadJson}  donwloadXML={donwloadXML}/>

            <div></div>
            <SearchOption setValue={setValue} value={value} handleSearch={handleSearch} onChangeData={onChangeData} />
        </div>
    );
};

export default EmployeeDepartmentTableHeader;
