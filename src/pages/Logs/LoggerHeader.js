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
import { formSelectDefault } from '../../Components/constants/styles';
import { methodList } from './logsUtils';

const LoggerHeader = ({ selectedData, getALlLogsData }) => {
    const [method, setMethod] = useState('');

    const donwloadExcel = () => {
        ExportToExcel(selectedData?.length ? selectedData : getALlLogsData, 'getALlLogsData.xlsx');
    };

    const donwloadJson = () => {
        exportToJson(selectedData?.length ? selectedData : getALlLogsData, 'getALlLogsData.json');
    };

    const donwloadXML = () => {
        const finalData = selectedData?.length ? selectedData : getALlLogsData;
        const data = finalData?.map((data) => {
            return {
                ...data
            };
        });
        exportFromJSON({
            data,
            fineName: 'getALlLogsData.xml',
            exportType: 'xml'
        });
    };
    const handleSelect = (e) => {
        if (e) {
            const queryParams = {
                page: 1,
                pageSize: 10,
                method: e.name
            };
            callAPIAction(getAllLogsAPI, null, null, queryParams);
            setMethod(e);
        } else {
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            callAPIAction(getAllLogsAPI, null, null, queryParams);
            setMethod('');
        }
        console.log(e);
    };
    return (
        <div className="d-flex justify-content-between w-100">
            <DownloadDataComponent donwloadExcel={donwloadExcel} donwloadJson={donwloadJson} donwloadXML={donwloadXML} />
            <div></div>
            <Select
                id="Method Status"
                value={method}
                onChange={handleSelect}
                className="w-20 ms-6"
                name="Method Status"
                options={methodList}
                placeholder="Select Method"
                components={{
                    IndicatorSeparator: () => null
                }}
                styles={{
                    ...formSelectDefault
                }}
                isClearable
                getOptionLabel={(e) => (
                    <span
                        className={`${
                            e.name === 'GET'
                                ? 'text-get-method'
                                : e.name === 'PUT'
                                ? 'text-put-method'
                                : e.name === 'POST'
                                ? 'text-post-method'
                                : e.name === 'DELETE'
                                ? 'text-delete-method'
                                : 'text-put-method'
                        } px-2 py-1 fw-bold fs-16`}
                    >
                        {e.name}
                    </span>
                )}
                getOptionValue={(e) => e.name}
                // disabled={GetDashboardTransactionsAPIData?.[FetchingKey]}
            />
        </div>
    );
};

export default LoggerHeader;
