import { DataKey } from '../../Store/callAPI/allAPIs';
import { removeAPIDataAction } from '../../Store/callAPI/actions';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { SelectSearchValInStore } from '../../Store/commonStore/selectors';

const percentage = (partialValue, totalValue) => {
    return (100 * partialValue) / totalValue;
};

const ShowErrMsg = (apiData, storekey) => {
    let errMsg = apiData?.error?.errorMessage
        ? apiData.error?.errorMessage
        : apiData?.error?.statusCode + ' error. Error in requesting data';
    toast.error(errMsg);
    removeAPIDataAction(storekey);
};

const GetErrMsg = (apiData) => {
    let errMsg = apiData?.[DataKey]?.errorMessage ? apiData[DataKey]?.errorMessage[0] : 'Error in fetching data';
    return errMsg;
};

export { percentage, ShowErrMsg, GetErrMsg };
