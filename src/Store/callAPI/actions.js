import { Store } from '../Store';
import { checkInternetConnectivity } from './callAPI';
import { callAPI, syncCallAPI, removeError, removeAPIData, editAPIData, callOffline, removeStoreData } from './reducer';

export function getCallAPIActionType(apiObj, cutomURL, requestObj, queryParams, pathsList, customHeaders, offline, queueNo) {
    return callAPI({
        apiObj: apiObj,
        cutomURL: cutomURL,
        requestObj: requestObj,
        queryParams: queryParams,
        pathsList: pathsList,
        customHeaders: customHeaders,
        offline: offline,
        queueNo: queueNo
    });
}

export const callAPIAction = (
    apiObj,
    cutomURL = null,
    requestObj = null,
    queryParams = null,
    pathsList = null,
    customHeaders = null,
    offline = false,
    queueNo = null
) => {
    if (
        checkInternetConnectivity() ||
        (!checkInternetConnectivity() && (apiObj?.method === 'GET' || (apiObj.method === 'POST' && !apiObj.saveOffline)))
    ) {
        return Store.dispatch(getCallAPIActionType(apiObj, cutomURL, requestObj, queryParams, pathsList, customHeaders, offline, queueNo));
    } else {
        return Store.dispatch(
            callOffline({
                apiObj: apiObj,
                cutomURL: cutomURL,
                requestObj: requestObj,
                queryParams: queryParams,
                pathsList: pathsList,
                customHeaders: customHeaders,
                offline: offline,
                queueNo: queueNo
            })
        );
    }
};

export const removeErrorAction = () => Store.dispatch(removeError());

export const removeAPIDataAction = (storeKey) => Store.dispatch(removeAPIData(storeKey));

export const editAPIDataAction = (storeKey, payload) => Store.dispatch(editAPIData({ storeKey: storeKey, payload: payload }));

export const offlineSyncAction = () => Store.dispatch(syncCallAPI());

export const logoutAction = (isRoleSwitch) => Store.dispatch(removeStoreData(isRoleSwitch));

window.addEventListener('online', () => {
    // offlineSyncAction();
});
