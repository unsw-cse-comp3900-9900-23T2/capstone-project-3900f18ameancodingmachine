import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Banner from "./banner/Banner";
import HomePage from "./home/HomePage";
import LoginPage from "./user/LoginPage";
import ForgotPassPage from "./user/ForgotPassPage";
import ForgotPassCodeEntry from "./user/FogotPassCodeEntry";
import ForgotPassNewPass from "./user/ForgotPassNewPass";
import RegistrationPage from "./user/RegistrationPage";
import RestaurantRegistrationPage from "./restaurant/RestaurantRegistrationPage";
import Browse from "./home/BrowsePage";
import RestaurantProfile from "./restaurant/RestaurantProfile";
import UserProfile from "./user/UserProfile";

export const UserContext = createContext(null);

/**
 * @return {JSX} main App component
 */
export default function App() {
  const [userContext, setUserContext] = useState(null);

  return (
    <Router>
      <UserContext.Provider
        value={{
          userContext,
          setUserContext,
        }}
      >
        <Banner />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/Recovery" element={<ForgotPassPage />} />
          <Route path="/RecoveryCodeEntry" element={<ForgotPassCodeEntry />} />
          <Route path="/RecoveryNewPass" element={<ForgotPassNewPass />} />
          <Route
            path="/create-restaurant"
            element={<RestaurantRegistrationPage />}
          />
          <Route path="/browse" element={<Browse />} />
          <Route
            path="/RestaurantProfile/:Restaurant_ID"
            element={<RestaurantProfile />}
          />
          <Route path="/user-profile" element={<UserProfile />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}
