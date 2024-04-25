// src/index.js
import React from 'react';
import { createRoot } from 'react-dom';
import './index.css';
import App from './App';
import "tailwindcss/tailwind.css";
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
