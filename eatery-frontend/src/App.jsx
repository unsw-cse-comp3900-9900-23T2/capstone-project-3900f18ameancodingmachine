import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Banner from './banner/Banner';
import HomePage from './home/HomePage';
import LoginPage from './user/LoginPage';
<<<<<<< HEAD:eatery-frontend/src/App.js
import ForgotPassPage from './user/ForgotPassPage';
=======
import RegistrationPage from './user/RegistrationPage';
>>>>>>> 455eb45fab96307c058e44ee1e23156274d9f3b6:eatery-frontend/src/App.jsx

function App() {
  return (
    <Router>
      <Banner/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
<<<<<<< HEAD:eatery-frontend/src/App.js
        <Route path="/loginRecovery" element={<ForgotPassPage/>} />
=======
        <Route path="/register" element={<RegistrationPage />} />
>>>>>>> 455eb45fab96307c058e44ee1e23156274d9f3b6:eatery-frontend/src/App.jsx
      </Routes>
    </Router>
  );
}

export default App;
