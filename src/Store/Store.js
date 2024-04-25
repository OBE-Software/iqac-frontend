import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist-indexeddb-storage';
// import storage from 'redux-persist/lib/storage';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

import rootSaga from './rootSaga.js';
import { reducers as Reducer } from './combinedReducer.js';

const persistConfig = {
    key: 'root',
    storage: storage('myDB')
};

const persistedReducer = persistReducer(persistConfig, Reducer);

const devMode = process.env.NODE_ENV === 'development';

const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware];

if (process.env.NODE_ENV !== 'production') middleware.push(createLogger());

const store = (preloadedState) => {
    const configStore = configureStore({
        reducer: persistedReducer,
        devTools: devMode,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
                }
            }).concat(middleware),
        preloadedState
    });
    sagaMiddleware.run(rootSaga);
    return configStore;
};
const Store = store();
const persistor = persistStore(Store);

export { Store, persistor };
