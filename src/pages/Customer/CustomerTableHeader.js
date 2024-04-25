import React, { useState } from 'react';
import SearchOption from '../../Components/Common/SearchOption';
import { useSelector } from 'react-redux';
import { SelectFullStateOfThisAPI } from '../../Store/callAPI/selectors';
import { GetCustomerAPI } from '../../helpers/APIs/CommonAPIs';
import { FetchingKey } from '../../Store/callAPI/allAPIs';
import { callAPIAction } from '../../Store/callAPI/actions';
import { toast } from 'react-toastify';
import { getCustomerURL } from '../../helpers/APIs/CustomURL';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';
import DownloadDataComponent from '../../Components/Common/DownloadDataComponent';
import { exportToJson } from '../../Components/Common/Util';
import ExportToExcel from '../../Components/Common/ExportToExcel';
import exportFromJSON from 'export-from-json';

const CustomerTableHeader = ({ isLead, selectedData, getCustomerData }) => {
    const [value, setValue] = useState('');

    const GetCustomerAPIData = useSelector((state) => SelectFullStateOfThisAPI(state, GetCustomerAPI));
    const profileData = useSelector((state) => SelectSearchValInStore(state, 'profileData'));

    const handleSearch = (e) => {
        e.preventDefault();

        if (value) {
            const queryParams = {
                page: 1,
                pageSize: 10,
                customerType: isLead ? 'lead' : 'patient'
            };

            if (value) queryParams['search'] = value;
            callAPIAction(GetCustomerAPI, getCustomerURL(profileData?.branchId), null, queryParams);
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
                pageSize: 10,
                customerType: isLead ? 'lead' : 'patient'
            };
            callAPIAction(GetCustomerAPI, getCustomerURL(profileData?.branchId), null, queryParams);
        }
        setValue(val);
    };

    const donwloadExcel = () => {
        ExportToExcel(selectedData?.length ? selectedData : getCustomerData, 'getCustomerData.xlsx');
    };

    const donwloadJson = () => {
        exportToJson(selectedData?.length ? selectedData : getCustomerData, 'getCustomerData.json');
    };

    
    const donwloadXML = () => {
        const finalData = selectedData?.length ? selectedData : getCustomerData;
        const data = finalData?.map((data) => {
            return {
                ...data
            };
        });
        exportFromJSON({
            data,
            fineName: 'getCustomerData.xml',
            exportType: 'xml'
        });
    };
    return (
        <div className="d-flex justify-content-between w-100">
            <DownloadDataComponent donwloadExcel={donwloadExcel} donwloadJson={donwloadJson}        donwloadXML={donwloadXML}/>

            <div></div>
            <div className="d-flex w-40 justify-content-end">
                <SearchOption
                    setValue={setValue}
                    value={value}
                    handleSearch={handleSearch}
                    disabled={GetCustomerAPIData?.[FetchingKey]}
                    onChangeData={onChangeData}
                />
            </div>
        </div>
    );
};

export default CustomerTableHeader;
