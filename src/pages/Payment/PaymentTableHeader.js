import React, { useState } from 'react';
import SearchOption from '../../Components/Common/SearchOption';
import { GetAllTestsAPI, GetDashboardTransactionsAPI } from '../../helpers/APIs/CommonAPIs';
import { callAPIAction } from '../../Store/callAPI/actions';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { FetchingKey } from '../../Store/callAPI/allAPIs';
import { formSelectDefault } from '../../Components/constants/styles';
import { getPaymentsURL } from '../../helpers/APIs/CustomURL';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import ExportToExcel from '../../Components/Common/ExportToExcel';
import DownloadDataComponent from '../../Components/Common/DownloadDataComponent';
import { exportToJson } from '../../Components/Common/Util';
import exportFromJSON from 'export-from-json';

const PaymentTableHeader = ({ paymentData, selectedData }) => {
    const [value, setValue] = useState('');
    const [status, setStatus] = useState('');

    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));
    const GetDashboardTransactionsAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetDashboardTransactionsAPI));

    const handleSearch = (e) => {
        e.preventDefault();

        if (value) {
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            if (value) queryParams['search'] = value;
            callAPIAction(GetDashboardTransactionsAPI, getPaymentsURL(profileData?.branchId), null, queryParams);
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
            callAPIAction(GetDashboardTransactionsAPI, getPaymentsURL(profileData?.branchId), null, queryParams);
        }
        setValue(val);
    };
    const handleSelect = (e) => {
        if (e) {
            const queryParams = {
                page: 1,
                pageSize: 10,
                status: e.id
            };
            if (value) queryParams['search'] = value;
            callAPIAction(GetDashboardTransactionsAPI, getPaymentsURL(profileData?.branchId), null, queryParams);
            setStatus(e);
        } else {
            const queryParams = {
                page: 1,
                pageSize: 10
            };
            if (value) queryParams['search'] = value;
            callAPIAction(GetDashboardTransactionsAPI, getPaymentsURL(profileData?.branchId), null, queryParams);
            setStatus('');
        }
    };
    const donwloadXML = () => {
        const finalData = selectedData?.length ? selectedData : paymentData;
        const data = finalData?.map((data) => {
            return {
                ...data
            };
        });
        exportFromJSON({
            data,
            fineName: 'paymentData.xml',
            exportType: 'xml'
        });
    };
    const donwloadExcel = () => {
        ExportToExcel(selectedData?.length ? selectedData : paymentData, 'paymentData.xlsx');
    };

    const donwloadJson = () => {
        exportToJson(selectedData?.length ? selectedData : paymentData, 'paymentData.json');
    };

    return (
        <div className="d-flex justify-content-between w-100">
            <div className="me-8 d-flex align-items-center gap-2">
                {/* Download :
                <i
                    class="ri-file-excel-2-line text-success cursor-pointer fs-22"
                    onClick={() => {
                        ExportToExcel(paymentData, 'paymentData.xlsx');
                    }}
                ></i> */}
                <DownloadDataComponent donwloadExcel={donwloadExcel} donwloadJson={donwloadJson} donwloadXML={donwloadXML}/>
            </div>
            <div></div>
            <div className="d-flex w-40 justify-content-end">
                <SearchOption
                    setValue={setValue}
                    value={value}
                    handleSearch={handleSearch}
                    onChangeData={onChangeData}
                    disabled={GetDashboardTransactionsAPIData?.[FetchingKey]}
                />
                <Select
                    id="Payment Status"
                    value={status}
                    onChange={handleSelect}
                    className="w-50 ms-6"
                    name="Payment Status"
                    options={[
                        { id: 1, name: 'Success' },
                        { id: 2, name: 'Failed' }
                    ]}
                    placeholder="Select Status"
                    components={{
                        IndicatorSeparator: () => null
                    }}
                    styles={{
                        ...formSelectDefault
                    }}
                    isClearable
                    getOptionLabel={(e) => e.name}
                    getOptionValue={(e) => e.id}
                    disabled={GetDashboardTransactionsAPIData?.[FetchingKey]}
                />
            </div>
        </div>
    );
};

export default PaymentTableHeader;
