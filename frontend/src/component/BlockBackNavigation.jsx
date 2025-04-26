
import React, { useEffect, useState,useRef } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import Modal from "../component/Modal";

const BlockBackNavigation = ({children}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const childRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    // Push the current state into the browser's history stack
    const pushCurrentState = () => window.history.pushState(null, "", window.location.href);
    pushCurrentState();

    const handlePopState = () => {
      if (location.pathname === "/questions" || location.pathname === "/submit") {
        // Re-push the state immediately to block the navigation
        pushCurrentState();
        // Show the modal
        setModalMessage("Back navigation is disabled on this page.");
        setShowModal(true);
        


      } else if (location.pathname.startsWith("/result")) {
        // Redirect to `/courses` on back navigation from `/result`
        navigate("/", { replace: true });
      }
    };

    // Add the popstate event listener
    window.addEventListener("popstate", handlePopState);

    return () => {
      // Remove the event listener on component unmount
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location.pathname, navigate]);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {showModal && <Modal message={modalMessage} onClose={closeModal}  />}
     
    </>
  );
};

export default BlockBackNavigation;


