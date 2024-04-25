import React, { useState } from 'react';
import SearchOption from '../../Components/Common/SearchOption';
import { GetAllTestDepartmentAPI } from '../../helpers/APIs/CommonAPIs';
import { callAPIAction } from '../../Store/callAPI/actions';
import { toast } from 'react-toastify';
import DownloadDataComponent from '../../Components/Common/DownloadDataComponent';
import { exportToJson } from '../../Components/Common/Util';
import ExportToExcel from '../../Components/Common/ExportToExcel';
import exportFromJSON from 'export-from-json';

const TestDepartmentTableHeader = ({ testDepartmentsData, selectedData }) => {
    const [value, setValue] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();

        if (value) {
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            if (value) queryParams['search'] = value;
            callAPIAction(GetAllTestDepartmentAPI, null, null, queryParams);
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
            callAPIAction(GetAllTestDepartmentAPI, null, null, queryParams);
        }
        setValue(val);
    };

    const donwloadExcel = () => {
        ExportToExcel(selectedData?.length ? selectedData : testDepartmentsData, 'testDepartmentsData.xlsx');
    };
    const donwloadJson = () => {
        exportToJson(selectedData?.length ? selectedData : testDepartmentsData, 'testDepartmentsData.json');
    };
    const donwloadXML = () => {
        const finalData = selectedData?.length ? selectedData : testDepartmentsData;
        const data = finalData?.map((data) => {
            return {
                ...data
            };
        });
        exportFromJSON({
            data,
            fineName: 'testDepartmentsData.xml',
            exportType: 'xml'
        });
    };
    return (
        <div className="d-flex justify-content-between w-100">
            <div className="me-8 d-flex align-items-center gap-2">
                <DownloadDataComponent donwloadExcel={donwloadExcel} donwloadJson={donwloadJson}  donwloadXML={donwloadXML}/>
            </div>
            <div></div>
            <SearchOption setValue={setValue} value={value} handleSearch={handleSearch} onChangeData={onChangeData} />
        </div>
    );
};

export default TestDepartmentTableHeader;
