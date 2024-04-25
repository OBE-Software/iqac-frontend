import { combineReducers } from 'redux';

import commonReducer, { CommonStoreKey } from './commonStore/reducer';
import callAPIReducer, { callAPIStoreKey } from './callAPI/reducer';

const combinedReducer = combineReducers({
    [callAPIStoreKey]: callAPIReducer,
    [CommonStoreKey]: commonReducer
});

export const reducers = (state, action) => {
    if (action.type === 'APIData/removeStoreData') {
        if (action.payload && state.CommonStore.impersonateUser !== null) {
            state = { CommonStore: { impersonateUser: { ...state.CommonStore.impersonateUser } } };
        } else {
            state = undefined;
        }
    }
    return combinedReducer(state, action);
};

export default combinedReducer;
