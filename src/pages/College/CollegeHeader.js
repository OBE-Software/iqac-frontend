import React, { useState } from 'react';
import SearchOption from '../../Components/Common/SearchOption';
import { callAPIAction } from '../../Store/callAPI/actions';
import { getAllLogsAPI } from '../../helpers/APIs/CommonAPIs';
import { toast } from 'react-toastify';
import ExportToExcel from '../../Components/Common/ExportToExcel';
import { exportToJson } from '../../Components/Common/Util';
import DownloadDataComponent from '../../Components/Common/DownloadDataComponent';
import exportFromJSON from 'export-from-json';
import Select from 'react-select';

const CollegeHeader = ({ selectedData, getAllCollegesData }) => {
    const [method, setMethod] = useState('');

    const donwloadExcel = () => {
        ExportToExcel(selectedData?.length ? selectedData : getAllCollegesData, 'getAllCollegesData.xlsx');
    };

    const donwloadJson = () => {
        exportToJson(selectedData?.length ? selectedData : getAllCollegesData, 'getAllCollegesData.json');
    };

    const donwloadXML = () => {
        const finalData = selectedData?.length ? selectedData : getAllCollegesData;
        const data = finalData?.map((data) => {
            return {
                ...data
            };
        });
        exportFromJSON({
            data,
            fineName: 'getAllCollegesData.xml',
            exportType: 'xml'
        });
    };
    return (
        <div className="d-flex justify-content-between w-100">
            <DownloadDataComponent donwloadExcel={donwloadExcel} donwloadJson={donwloadJson} donwloadXML={donwloadXML} />
        </div>
    );
};

export default CollegeHeader;
