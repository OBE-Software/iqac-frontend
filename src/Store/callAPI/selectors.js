import { callAPIStoreKey } from './reducer';
import { DataKey, ErrorKey, FetchingKey, NotificationStoreKey } from './allAPIs';

export const SelectFullStateOfThisAPI = (state, apiObj) => state[callAPIStoreKey][apiObj.storeKey];

export const SelectDataObjInResponse = (state, apiObj) => state[callAPIStoreKey][apiObj.storeKey][DataKey];

export const IsAPIBeingCalled = (state, apiObj) => state[callAPIStoreKey][apiObj.storeKey][FetchingKey];

export const SelectErrorWhenCallingAPI = (state, apiObj) => state[callAPIStoreKey][apiObj.storeKey][ErrorKey];

export const SelectNotificationState = (state) => state[callAPIStoreKey][NotificationStoreKey];
