import { createSlice } from '@reduxjs/toolkit';
import { isEqual } from 'lodash';
import { DataKey, ErrorKey, FetchingKey, initialState } from './allAPIs';

export const callAPIStoreKey = 'APIData';
export const OfflineKey = 'Offline';

const callAPISlice = createSlice({
    name: callAPIStoreKey,
    initialState: initialState(),
    reducers: {
        callAPI(state, action) {},
        syncCallAPI(state, action) {},
        callStarted(state, action) {
            const { storeKey } = action.payload;
            state[storeKey] = {
                [FetchingKey]: true,
                [DataKey]: null,
                [ErrorKey]: null
            };
        },
        callSuccess(state, action) {
            const { storeKey, data } = action.payload;
            state[storeKey] = {
                [FetchingKey]: false,
                [DataKey]: data,
                [ErrorKey]: null
            };
            if (action?.payload?.data?.offline) {
                let existingState = JSON.parse(JSON.stringify(state[OfflineKey]))?.[DataKey] || [];
                let fArr = existingState.filter((a) => a.queueNo !== action?.payload?.data?.queueNo);
                state[OfflineKey] = {
                    [FetchingKey]: false,
                    [DataKey]: fArr,
                    [ErrorKey]: null
                };
            }
        },
        callFailed(state, action) {
            const { storeKey, error, data } = action.payload;
            state[storeKey] = {
                [FetchingKey]: false,
                [DataKey]: data,
                [ErrorKey]: error
            };
        },
        callError(state, action) {
            const { storeKey, errorCode, header } = action.payload;
            state[storeKey][FetchingKey] = false;
            state.error = {
                errorCode: errorCode,
                header: header
            };
        },
        removeError(state, action) {
            state.error = null;
        },

        /*
         * Useful for removing some data from API calls or to reset it so that
         * Call can be made again
         */
        removeAPIData(state, action) {
            const storeKey = action.payload;
            state[storeKey] = {
                [FetchingKey]: false,
                [DataKey]: null,
                [ErrorKey]: null
            };
        },
        editAPIData(state, action) {
            const { storeKey, payload } = action.payload;
            state[storeKey][DataKey] = payload;
        },
        callOffline(state, action) {
            const data = action.payload;
            data.offline = true;
            const offlineStoreKey = OfflineKey;
            const storeKey = data?.apiObj?.updateOfflineStoreKey; // updateOfflineStoreKey - code for updated list in view after save

            let existingState = JSON.parse(JSON.stringify(state[offlineStoreKey]))?.[DataKey] || [];
            data.queueNo = existingState?.length || 0;
            state[offlineStoreKey] = {
                [FetchingKey]: false,
                [DataKey]: [...existingState, data],
                [ErrorKey]: null
            };
        },
        updateOfflineSuccess(state, action) {
            const data = action.payload;
            const offlineStoreKey = OfflineKey;
            let existingState = JSON.parse(JSON.stringify(state[offlineStoreKey]))?.[DataKey] || [];
            const filteredArr = existingState.filter((todo, i) => i !== data.data);
            state[offlineStoreKey] = {
                [FetchingKey]: false,
                [DataKey]: [...filteredArr],
                [ErrorKey]: null
            };
        },
        removeStoreData(state) {
            state = undefined;
        }
    }
});

// Extract the action creators object and the reducer
const { actions, reducer: callAPIReducer } = callAPISlice;
// Extract and export each action creator by name
export const {
    callAPI,
    syncCallAPI,
    callStarted,
    callSuccess,
    callFailed,
    callError,
    removeError,
    removeAPIData,
    editAPIData,
    callOffline,
    updateOfflineSuccess,
    removeStoreData
} = actions;
// Export the reducer, either as a default or named export
export default callAPIReducer;
