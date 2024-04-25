import React, { useState } from 'react';
import SearchOption from '../../Components/Common/SearchOption';
import { GetAllTestsAPI } from '../../helpers/APIs/CommonAPIs';
import { callAPIAction } from '../../Store/callAPI/actions';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { FetchingKey } from '../../Store/callAPI/allAPIs';
import { formSelectDefault } from '../../Components/constants/styles';
import ExportToExcel from '../../Components/Common/ExportToExcel';
import DownloadDataComponent from '../../Components/Common/DownloadDataComponent';
import { exportPDFWithMethod, exportToJson } from '../../Components/Common/Util';
import exportFromJSON from 'export-from-json';

const TestTableHeader = ({ testDepartmentsList, testData, selectedData }) => {
    const [value, setValue] = useState('');
    const [department, setDepartment] = useState('');

    const GetAllTestAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetAllTestsAPI));

    const handleSearch = (e) => {
        e.preventDefault();

        if (value) {
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            if (value) queryParams['search'] = value;
            callAPIAction(GetAllTestsAPI, null, null, queryParams);
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
            callAPIAction(GetAllTestsAPI, null, null, queryParams);
        }
        setValue(val);
    };
    const handleSelect = (e) => {
        if (e) {
            const queryParams = {
                page: 1,
                pageSize: 10,
                departmentName: e.departmentName
            };
            if (value) queryParams['search'] = value;
            callAPIAction(GetAllTestsAPI, null, null, queryParams);
            setDepartment(e);
        } else {
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            if (value) queryParams['search'] = value;
            callAPIAction(GetAllTestsAPI, null, null, queryParams);
            setDepartment('');
        }
    };

    const donwloadExcel = () => {
        ExportToExcel(selectedData?.length ? selectedData : testData, 'testData.xlsx');
    };

    const donwloadJson = () => {
        exportToJson(selectedData?.length ? selectedData : testData, 'testData.json');
    };

    const donwloadXML = () => {
        const finalData = selectedData?.length ? selectedData : testData;
        const data = finalData?.map((data) => {
            return {
                ...data
            };
        });
        exportFromJSON({
            data,
            fineName: 'tests.xml',
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
                        ExportToExcel(testData, 'testData.xlsx');
                    }}
                ></i> */}
                <DownloadDataComponent
                    donwloadExcel={donwloadExcel}
                    donwloadJson={donwloadJson}
                    downloadPdf={downloadPdf}
                    donwloadXML={donwloadXML}
                />
            </div>
            <div></div>
            <div className="d-flex w-40 justify-content-end">
                <SearchOption setValue={setValue} value={value} handleSearch={handleSearch} onChangeData={onChangeData} />
                <Select
                    id="departmentId"
                    value={department}
                    onChange={handleSelect}
                    className="w-50 ms-6"
                    name="departmentId"
                    isLoading={GetAllTestAPIData?.[FetchingKey]}
                    options={testDepartmentsList}
                    placeholder="Select Department"
                    components={{
                        IndicatorSeparator: () => null
                    }}
                    styles={{
                        ...formSelectDefault
                    }}
                    isClearable
                    getOptionLabel={(e) => e.departmentName}
                    getOptionValue={(e) => e._id}
                    isDisabled={GetAllTestAPIData?.[FetchingKey]}
                />
            </div>
        </div>
    );
};

export default TestTableHeader;
