import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import 'react-virtualized/styles.css'
import App from './App';
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8080'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

