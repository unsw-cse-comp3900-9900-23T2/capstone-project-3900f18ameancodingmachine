import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './home/HomePage';
import LoginPage from './user/LoginPage';
import ForgotPassPage from './user/ForgotPassPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/loginRecovery" element={<ForgotPassPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
