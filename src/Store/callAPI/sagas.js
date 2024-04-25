/* eslint-disable */

import { all, call, put, takeEvery } from 'redux-saga/effects';
import { select } from 'redux-saga/effects';
import Axios from 'axios';

import { callAPI, syncCallAPI, callFailed, callStarted, callSuccess, updateOfflineSuccess, OfflineKey } from './reducer';
import callAPIFunctions from './callAPI';
import { callAPIStoreKey } from './reducer';
import { callAPIAction } from './actions';
import { DataKey } from './allAPIs';
import { toast } from 'react-toastify';

export function* watchCallAPI() {
    yield takeEvery(callAPI.toString(), workerCallAPI);
}

export function* watchBackgroundSync() {
    yield takeEvery(syncCallAPI.toString(), backgroundSync);
}

/**
 * 1. Updates data key of `storeKey` Obj if action is successful
 * 2. Updates `error` key of `storeKey` Obj if (something unexpected
 * happened and callErrorPage is false) or (throw flag of that error is false)
 * 3. Updates `error` State obj if throw flag of that error is true or if
 * something unexpected happened and callErrorPage is true
 * 4. Updates `error` of State Obj irrespective of what flags are there,
 * if "internet lost" error occurred
 * @param action
 */
export function* workerCallAPI(action) {
    const { apiObj, requestObj } = action.payload;
    const storeKey = apiObj.storeKey;
    try {
        if (callAPIFunctions.checkInternet()) {
            yield put(callStarted({ storeKey: storeKey }));
            const responseData = yield call(callAPIFunctions.callAPI, action.payload);
            const { data, throwError, offline, errorCode } = handleResponse(responseData, apiObj);
            if (!throwError && !errorCode) {
                yield put(
                    callSuccess({
                        data: data,
                        storeKey: storeKey
                    })
                );
            } else {
                yield put(
                    callFailed({
                        error: errorCode,
                        data: data,
                        storeKey: storeKey
                    })
                );
            }
        } else {
            apiObj.method === 'POST' && toast.error('You are Offline.Please check your internet connection.');
        }
    } catch (error) {
        handleError(apiObj.url, error);
        // If some unexpected error occurred, it will be handled by ErrorBoundary
        // Or the Component itself based on APIObj callErrorPage flag

        yield put(
            callFailed({
                error: error?.response?.data || 'Internal server error........................',
                storeKey: storeKey
            })
        );
    }
}

export function handleResponse(responseObj, apiObj) {
    const channel = new BroadcastChannel('my-channel');

    let data = null;
    let throwError = true;
    const isStatusSuccess = checkSuccessResponseStatus(responseObj);

    if (responseObj) {
        data = responseObj;
        if (!isStatusSuccess) {
            if (apiObj.callErrorPage === false) {
                throwError = false;
            } else {
                throwError = true;
            }
        } else {
            throwError = false;
        }
    }

    if (!isStatusSuccess && responseObj.statusCode >= 500 && apiObj?.method === 'GET') {
        let errCode = responseObj.statusCode + ' Error in ' + apiObj?.storeKey;
        toast.error(errCode);
    }
    return {
        data: data,
        throwError: throwError,
        offline: responseObj.offline,
        errorCode: !isStatusSuccess ? responseObj.statusCode : null
    };
}

export function checkSuccessResponseStatus(responseData) {
    return responseData && responseData.isSuccess;
}

export function getResponseErrorCode(responseData) {
    if (responseData && typeof responseData.errors === 'object') {
        return responseData.status;
    }
    return 'internalErrorCode';
    // If error code not mentioned, give code corresponding to "Some Internal Error Occurred"
    // Because we should call this after success flag is checked, if we dont find any error object
    // Then that is also an error - so throwing internalErrorCode
}

export function handleError(url, error) {
    // console.warn('Error:', error);
    // Error 😨
    if (Axios.isCancel(error)) {
    } else if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        error.message =
            'Error in Response when this API is called :' +
            url +
            ' \n This is the response we got :' +
            JSON.stringify(error.response, null, 3);
    } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        error.message =
            'No Response received, when this API is called :' +
            url +
            ' \n PLEASE CHECK WHETHER THIS API AND OUR GATEWAY IS WORKING PROPERLY';
    }
}

function* backgroundSync() {
    const offlineState = (state) => state[callAPIStoreKey]?.Offline;
    const offlineData = yield select(offlineState);
    if (offlineData?.[DataKey]?.length === 0 || !offlineData?.[DataKey]) {
        // yield put({
        //     type: SYNC_QUEUE_EMPTY
        // });
    } else {
        for (const order of offlineData[DataKey]) {
            const { apiObj, cutomURL, requestObj, queryParams, pathsList, customHeaders, offline, queueNo } = order;
            callAPIAction(apiObj, cutomURL, requestObj, queryParams, pathsList, customHeaders, offline, queueNo);
        }
    }
}

export default function* callAPISagas() {
    yield all([call(watchCallAPI), call(watchBackgroundSync)]);
}
