import React, { useState } from 'react';
import SearchOption from '../../Components/Common/SearchOption';
import { GetAllTestTypeAPI } from '../../helpers/APIs/CommonAPIs';
import { callAPIAction } from '../../Store/callAPI/actions';
import { toast } from 'react-toastify';
import DownloadDataComponent from '../../Components/Common/DownloadDataComponent';
import ExportToExcel from '../../Components/Common/ExportToExcel';
import { exportToJson } from '../../Components/Common/Util';
import exportFromJSON from 'export-from-json';

const TestTypeTableHeader = ({ selectedData, testSamplesData }) => {
    const [value, setValue] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();

        if (value) {
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            if (value) queryParams['search'] = value;
            callAPIAction(GetAllTestTypeAPI, null, null, queryParams);
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
            callAPIAction(GetAllTestTypeAPI, null, null, queryParams);
        }
        setValue(val);
    };

    const donwloadExcel = () => {
        ExportToExcel(selectedData?.length ? selectedData : testSamplesData, 'testSamplesData.xlsx');
    };
    const donwloadJson = () => {
        exportToJson(selectedData?.length ? selectedData : testSamplesData, 'testSamplesData.json');
    };

    const donwloadXML = () => {
        const finalData = selectedData?.length ? selectedData : testSamplesData;
        const data = finalData?.map((data) => {
            return {
                ...data
            };
        });
        exportFromJSON({
            data,
            fineName: 'testSamplesData.xml',
            exportType: 'xml'
        });
    };

    return (
        <div className="d-flex justify-content-between w-100">
            <div className="me-8 d-flex align-items-center gap-2">
                <DownloadDataComponent donwloadExcel={donwloadExcel} donwloadJson={donwloadJson} donwloadXML={donwloadXML} />
            </div>
            <div></div>
            <SearchOption setValue={setValue} value={value} handleSearch={handleSearch} onChangeData={onChangeData} />
        </div>
    );
};

export default TestTypeTableHeader;
