import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Dashboard from "./component/Dashboard";
import LoginForm from "./component/LoginForm";
import MyProfile from "./component/MyProfile";
import MyCalendar from "./component/MyCalendar";
import RegistrationForm from "./component/RegistrationForm";
import Sample from "./component/sample";
import Chatbot from "./component/chatbot";
import { CookiesProvider } from "react-cookie";
import DailyPlanPage from "./component/DailyPlanPage";

function App() {
  return (
    <CookiesProvider>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/loginform" element={<LoginForm />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/daily-plan" element={<DailyPlanPage />} />
          <Route path="/registrationform" element={<RegistrationForm />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/mycalendar" element={<MyCalendar />} />
          <Route path="/sample" element={<Sample />} />
        </Routes>
      </Router>
    </CookiesProvider>
  );
}

export default App;
