import React, { useState } from 'react';
import SearchOption from '../../Components/Common/SearchOption';
import { GetAllCentersAPI } from '../../helpers/APIs/CommonAPIs';
import { callAPIAction } from '../../Store/callAPI/actions';
import { toast } from 'react-toastify';
import ExportToExcel from '../../Components/Common/ExportToExcel';
import DownloadDataComponent from '../../Components/Common/DownloadDataComponent';
import { exportPDFWithMethod, exportToJson } from '../../Components/Common/Util';
import exportFromJSON from 'export-from-json';

const CenterTableHeader = ({ centerData, selectedData }) => {
    const [value, setValue] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();

        if (value) {
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            if (value) queryParams['search'] = value;
            callAPIAction(GetAllCentersAPI, null, null, queryParams);
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
            callAPIAction(GetAllCentersAPI, null, null, queryParams);
        }
        setValue(val);
    };

    const donwloadExcel = () => {
        ExportToExcel(selectedData?.length ? selectedData : centerData, 'centerData.xlsx');
    };

    const donwloadJson = () => {
        exportToJson(selectedData?.length ? selectedData : centerData, 'centerData.json');
    };

    const donwloadXML = () => {
        const finalData = selectedData?.length ? selectedData : centerData;
        const data = finalData?.map((data) => {
            return {
                ...data
            };
        });
        exportFromJSON({
            data,
            fineName: 'centerData.xml',
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
                        ExportToExcel(centerData, 'centerData.xlsx');
                    }}
                ></i> */}
                <DownloadDataComponent donwloadExcel={donwloadExcel} donwloadJson={donwloadJson} donwloadXML={donwloadXML} />
            </div>
            <div></div>

            <SearchOption setValue={setValue} value={value} handleSearch={handleSearch} onChangeData={onChangeData} />
        </div>
    );
};

export default CenterTableHeader;
