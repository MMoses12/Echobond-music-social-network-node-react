// Basic imports.
import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages import.
import HomePage from "./Pages/homePage";
import Login from "./Pages/logIn";
import SignUp from "./Pages/signup";
import CV from "./Pages/cv";
import MusicHome from "./Pages/musicHome";
import Otp from "./Pages/otpPass";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/musicHome" element={<MusicHome />} />
          <Route path="/otp" element={<Otp />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App