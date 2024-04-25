import React, { useState } from 'react';
import { GetAllEmployeeAPI } from '../../helpers/APIs/CommonAPIs';
import { callAPIAction } from '../../Store/callAPI/actions';
import { toast } from 'react-toastify';
import SearchOption from '../../Components/Common/SearchOption';
import DownloadDataComponent from '../../Components/Common/DownloadDataComponent';
import ExportToExcel from '../../Components/Common/ExportToExcel';
import { exportPDFWithMethod, exportToJson } from '../../Components/Common/Util';
import exportFromJSON from 'export-from-json';

const EmployeeHeader = ({ employessData, selectedData }) => {
    const [value, setValue] = useState('');
    const handleSearch = (e) => {
        e.preventDefault();

        if (value) {
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            if (value) queryParams['search'] = value;
            callAPIAction(GetAllEmployeeAPI, null, null, queryParams);
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
            callAPIAction(GetAllEmployeeAPI, null, null, queryParams);
        }
        setValue(val);
    };

    const donwloadExcel = () => {
        ExportToExcel(selectedData?.length ? selectedData : employessData, 'employessData.xlsx');
    };

    const donwloadJson = () => {
        exportToJson(selectedData?.length ? selectedData : employessData, 'employessData.json');
    };

    
    const donwloadXML = () => {
        const finalData = selectedData?.length ? selectedData : employessData;
        const data = finalData?.map((data) => {
            return {
                ...data
            };
        });
        exportFromJSON({
            data,
            fineName: 'employessData.xml',
            exportType: 'xml'
        });
    };

    const downloadPdf = () => {
        exportPDFWithMethod('tests.pdf');
    };
    return (
        <div className="d-flex justify-content-between w-100">
            <div className="me-8 d-flex align-items-center gap-2">
                {/* Download :
                    <i
                        class="ri-file-excel-2-line text-success cursor-pointer fs-22"
                        onClick={() => {
                            ExportToExcel(selectedData?.length ? selectedData : bookingData, 'bookingData.xlsx');
                        }}
                    ></i> */}
                <DownloadDataComponent donwloadExcel={donwloadExcel} donwloadJson={donwloadJson} donwloadXML={donwloadXML}/>
            </div>
            <div></div>
            <SearchOption setValue={setValue} value={value} handleSearch={handleSearch} onChangeData={onChangeData} />
        </div>
    );
};

export default EmployeeHeader;
