// src/index.tsx
import React from 'react';
import './styles/global.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import './styles/ant-theme.less'; // Import Ant Design Less styles with custom theme
import { Provider } from 'react-redux';
import store, { persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoaderProvider } from './context/LoaderContext';

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  // <React.StrictMode>
  <AuthProvider>
    <LoaderProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
          <ToastContainer />
        </PersistGate>
      </Provider>
    </LoaderProvider>
  </AuthProvider>
);

reportWebVitals();
