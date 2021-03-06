import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import configureStore from './store';
import { ModalProvider } from './components/context/Modal_Context';

const store = configureStore();

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ModalProvider>
                <App />
            </ModalProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
);
