import axios from 'axios';
import { Store } from '../Store';
// const apiUrl = 'https://api.cadabamsdiagnostics.com/api';

const apiUrl = 'https://7f93-2406-7400-81-caf6-fd13-a1f5-2561-feed.ngrok-free.app/api';

// const apiUrl = 'http://localhost:9009/api';

export function getCommonHeaders(afterLogin = true, apiObj = {}) {
    const store = Store.getState();
    var authToken = {
        authorization: 'Bearer ' + store?.CommonStore?.userData?.accessToken
    };
    return {
        'Content-Type': apiObj?.fileUpload ? 'multipart/form-data' : 'application/json',
        ...authToken,
        'ngrok-skip-browser-warning': '69420'
    };
}

export function getFullURL(url, pathsList = null, customEndPoint = '') {
    let apiEndPointURL = customEndPoint ? customEndPoint : apiUrl;
    // In API BASE URL - DO NOT PUT '/' at the END
    let fullURL = apiEndPointURL + '/' + url;
    if (pathsList) {
        for (const path of pathsList) {
            fullURL = fullURL + '/' + path;
        }
    }
    return fullURL;
}

export async function makeAPICall(payload) {
    let { apiObj, cutomURL, requestObj, queryParams, pathsList, customHeaders, offline, queueNo } = payload;
    let headers = getCommonHeaders(apiObj.authTokenNeeded, apiObj);

    if (customHeaders) {
        headers = { ...headers, ...customHeaders };
    }

    const fullURL = getFullURL(apiObj.customURLNeeded ? cutomURL : apiObj.url, pathsList, apiObj.customEndPoint);

    const response = await axios({
        method: apiObj.method,
        url: fullURL,
        data: requestObj ? requestObj : {},
        params: queryParams,
        headers: headers
    });

    return { ...response.data, offline: offline, statusCode: response.status, queueNo: queueNo };
    // This will not happen bcz if invalid, it will throw error
}

export function checkInternetConnectivity() {
    return navigator.onLine;
}

// This constant is used for tests - spyOn and also for segregation of logic from sagas_old.js
const callAPIFunctions = {
    callAPI: makeAPICall,
    checkInternet: checkInternetConnectivity,
    headers: getCommonHeaders
};

export default callAPIFunctions;
