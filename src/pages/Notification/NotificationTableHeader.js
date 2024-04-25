import React from 'react';
import ExportToExcel from '../../Components/Common/ExportToExcel';
import { exportToJson } from '../../Components/Common/Util';
import DownloadDataComponent from '../../Components/Common/DownloadDataComponent';

const NotificationTableHeader = ({ selectedData }) => {
    // const donwloadExcel = () => {
    //     ExportToExcel(selectedData?.length ? selectedData : testData, 'testData.xlsx');
    // };

    // const donwloadJson = () => {
    //     exportToJson(selectedData?.length ? selectedData : testData, 'testData.json');
    // };

    // const handleSearch = (e) => {
    //     e.preventDefault();

    //     if (value) {
    //         const queryParams = {
    //             page: 1,
    //             pageSize: 10
    //         };
    //         if (value) queryParams['search'] = value;
    //         callAPIAction(GetAllTestsAPI, null, null, queryParams);
    //     }
    // };

    // const onChangeData = (val) => {
    //     if (val.length > 50) {
    //         toast.error('Search value should not be more than 50 characters');
    //         return;
    //     }
    //     if (!val) {
    //         const queryParams = {
    //             page: 1,
    //             pageSize: 10
    //         };
    //         callAPIAction(GetAllTestsAPI, null, null, queryParams);
    //     }
    //     setValue(val);
    // };

    return (
        <div className="d-flex justify-content-between w-100">
            <div className="me-8 d-flex align-items-center gap-2">
                {/* Download :
                <i
                    class="ri-file-excel-2-line text-success cursor-pointer fs-22"
                    onClick={() => {
                        ExportToExcel(testData, 'testData.xlsx');
                    }}
                ></i> */}
                {/* <DownloadDataComponent donwloadExcel={donwloadExcel} donwloadJson={donwloadJson} /> */}
            </div>
            <div></div>
            <div className="d-flex w-40 justify-content-end">{/* <SearchOption /> */}</div>
        </div>
    );
};

export default NotificationTableHeader;
