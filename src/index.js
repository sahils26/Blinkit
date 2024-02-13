import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import rootReducer from "./reducer/index";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import {configureStore} from "@reduxjs/toolkit";
import reportWebVitals from './reportWebVitals';

const store=configureStore({
    reducer:rootReducer,
  })

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(  
    <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster/>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
