import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { Store, persistor } from './Store/Store';
import reportWebVitals from './reportWebVitals';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </PersistGate>
    </Provider>
);

/*
 * If you want to start measuring performance in your app, pass a function
 * or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
 */

reportWebVitals();
