import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThirdwebProvider activeChain={Sepolia}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>,
)