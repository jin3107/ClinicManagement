import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './scss/common.scss'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from "antd";
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ConfigProvider
  theme={{
    token: {
      colorPrimary: "#0B4F84",
    },
  }}
>
  <App />
</ConfigProvider>
  </BrowserRouter>
)
