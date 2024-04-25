import { createSlice } from '@reduxjs/toolkit';
import { callAPIStoreKey } from '../callAPI/reducer';

export const CommonStoreKey = 'CommonStore';

const initialState = {};

const policySlice = createSlice({
    name: CommonStoreKey,
    initialState: initialState,
    reducers: {
        addSearchValInStore: (state, action) => ({
            ...state,
            searchVal: action.payload
        }),
        addUserDataInStore: (state, action) => ({
            ...state,
            userData: action.payload
        }),
        addCurrentNavInStore: (state, action) => ({
            ...state,
            currentNav: action.payload
        }),
        addCurrentSubNavInStore: (state, action) => ({
            ...state,
            currentNavSub: action.payload
        }),
        addRoleDataInStore: (state, action) => ({
            ...state,
            roleData: action.payload
        }),
        addProfileDataInStore: (state, action) => ({
            ...state,
            profileData: action.payload
        })
        // addTestData: (state, action) => ({
        //     ...state,
        //     testData: action.payload
        // })
    }
});

const { actions, reducer: commonReducer } = policySlice;
export const {
    addSearchValInStore,
    addUserDataInStore,
    addCurrentNavInStore,
    addCurrentSubNavInStore,
    addRoleDataInStore,
    addProfileDataInStore
    // addTestData
} = actions;
export default commonReducer;
