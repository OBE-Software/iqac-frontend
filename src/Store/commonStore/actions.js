import { Store } from '../Store';
import {
    addSearchValInStore,
    addUserDataInStore,
    addCurrentNavInStore,
    addCurrentSubNavInStore,
    addRoleDataInStore,
    addProfileDataInStore
    // addTestData
} from './reducer';

export const addSearchValToStore = (searchValue) => Store.dispatch(addSearchValInStore(searchValue));
export const addUserDataToStore = (data) => Store.dispatch(addUserDataInStore(data));
export const addRoleDataToStore = (data) => Store.dispatch(addRoleDataInStore(data));

export const addCurrentNavToStore = (data) => Store.dispatch(addCurrentNavInStore(data));
export const addCurrentSubNavToStore = (data) => Store.dispatch(addCurrentSubNavInStore(data));
export const addProfileDataToStore = (data) => Store.dispatch(addProfileDataInStore(data));
// export const addTestDataToStore = (data) => Store.dispatch(addTestData(data));
