// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';
import Dashboard from './dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="https://milk-pro-sales.netlify.app/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
