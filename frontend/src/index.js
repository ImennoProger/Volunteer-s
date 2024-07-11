import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Router>
    <App />
  </Router>
);
