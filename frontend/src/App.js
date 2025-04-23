import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import TestInstruction from "./component/TestInstructions";
import TestCard from "./component/TestCard";
import MCQTestSetup from "./component/MCQTestSetup";
import Questions from "./component/Questions";
import TestSubmittedSuccess from "./component/TestSubmittedSuccess";
import ResultDashboard from "./component/ResultDashboard";
import LeadersPage from "./component/LeadersPage";
import NoAccess from "./component/NoAccess";
import Security from "./component/Security";
import DetailedAssessment from "./component/DetailedAssessment";
import BlockBackNavigation from "./component/BlockBackNavigation";
import PageNotFound from "./component/PageNotFound";
import Registration from "./component/Registration";
import { useUserActivity } from "./context/UserActivityContext";
import FeedbackForm from "./component/FeedbackForm";
import CompleteProfileQverse from "./component/CompleteProfileQverse";
import Modal from "./component/Modal";
import WelcomePage from "./component/WelcomPage";
import Dashboard from "./component/Dashboard";
import LoginForm from "./component/LoginForm";
import MyProfile from "./component/MyProfile";
import MyCalendar from "./component/MyCalendar";
import RegistrationForm from "./component/RegistrationForm";

const ConditionalBlockBackNavigation = ({ children }) => {
  const location = useLocation();

  const routesWithBlock = ["/questions", "/submit", "/result"];

  return (
    <>
      {routesWithBlock.some((route) => location.pathname.startsWith(route)) && (
        <BlockBackNavigation />
      )}
      {children}
    </>
  );
};

const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("user"); // Example authentication check
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login and store attempted path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};
// New component to handle browser/tab interactions
const BrowserEventHandler = () => {
  const { logActivity, activityHistory, clearActivity, userLog } =
    useUserActivity();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const location = useLocation();
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      setModalMessage("tab corss ");
      event.preventDefault();
      event.returnValue = ""; // Some browsers show a default message
      return ""; // This prevents immediate tab closure
    };
    function handleClose() {
      const data = new FormData().append("exam_name", "SQL");
      // navigator.sendBeacon("http://localhost:5000/get-exam", data);
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        //console.log("app in hidden mode");
        const logHistory = logActivity({
          event: "window_inactive",
          source_page: `${location.pathname}`,
          activity: `Window goes inactive form the ${location.pathname} route`,
          event_timeline: new Date().toLocaleString(),
        });
      } else if (document.visibilityState === "visible") {
        const logHistory = logActivity({
          event: "window_active",
          source_page: `${location.pathname}`,
          activity: `Window in active  ${location.pathname} route`,
          event_timeline: new Date().toLocaleString(),
        });

        //userLog(logHistory,email);
      }
    };

    // Add event listeners
    // window.addEventListener("unload", handleClose);
    // window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // Clean up event listeners
      // window.removeEventListener("unload", handleClose);
      // window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <>
      {showModal && (
        <Modal message={modalMessage} onClose={closeModal} submit={true} />
      )}
    </>
  ); // This component doesn't render any UI
};

function App() {
  return (
    <Router>
      {/* Add the BrowserEventHandler component to globally handle browser/tab events */}
      <BrowserEventHandler />

      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/loginform" element={<LoginForm />} />
        <Route path="/registrationform" element={<RegistrationForm />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/mycalendar" element={<MyCalendar />} />
        <Route
          path="/completeprofile"
          element={<PrivateRoute element={<CompleteProfileQverse />} />}
        />
        {/* <Route path="/test" element={<Login/>} /> */}

        <Route path="/" element={<TestCard />} />
        <Route path="/feedback" element={<FeedbackForm />} />

        <Route
          path="/exam-guide"
          element={
            <PrivateRoute
              element={
                <Security>
                  <TestInstruction />
                </Security>
              }
            />
          }
        />
        <Route
          path="/leaders"
          element={
            <PrivateRoute
              element={
                <Security>
                  <LeadersPage />
                </Security>
              }
            />
          }
        />
        <Route
          path="/personlized-test"
          element={
            <PrivateRoute
              element={
                <Security>
                  <MCQTestSetup />
                </Security>
              }
            />
          }
        />
        <Route
          path="/questions"
          element={
            <ConditionalBlockBackNavigation>
              <PrivateRoute
                element={
                  <Security>
                    <Questions />
                  </Security>
                }
              />
            </ConditionalBlockBackNavigation>
          }
        />
        <Route
          path="/submit/:test_Id"
          element={
            <ConditionalBlockBackNavigation>
              <PrivateRoute element={<TestSubmittedSuccess />} />
            </ConditionalBlockBackNavigation>
          }
        />
        <Route
          path="/result/:test_Id"
          element={
            <ConditionalBlockBackNavigation>
              <PrivateRoute element={<ResultDashboard />} />
            </ConditionalBlockBackNavigation>
          }
        />
        <Route
          path="/detailed-assessment/:test_Id"
          element={<PrivateRoute element={<DetailedAssessment />} />}
        />
        <Route
          path="/project-coming-soon"
          element={<PrivateRoute element={<WelcomePage />} />}
        />

        {/* Public route */}
        <Route path="/noaccess/:course" element={<NoAccess />} />

        {/* Catch-all route for 404 */}
        <Route
          path="*"
          element={
            <ConditionalBlockBackNavigation>
              <PageNotFound />
            </ConditionalBlockBackNavigation>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
