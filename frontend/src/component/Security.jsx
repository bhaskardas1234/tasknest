import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "../component/Modal"; // Import the Modal component
import Toastify, { showToast } from "./Toastify"; // Import Toastify and showToast

const Security = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const childRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [closeModal, setCloseModal] = useState(() => () => {
    setShowModal(false);
  });
  const [activateEventListner, setActivateEventListner] = useState(false);

  const detectDevTools = () => {
    const threshold = 200;
    return (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    );
  };

  useEffect(() => {
    const handleDevToolsDetection = () => {
      if (detectDevTools()) {
        setModalMessage(
          "Developer tools are detected! Please close it and start your assessment."
        );
        setShowModal(true);
        setCloseModal(() => {
          return () => {
            setShowModal(false);
            navigate("/");
          };
        });
      }
    };

    const forceFullScreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.error("Fullscreen request failed:", err);
        });
      }
    };

    const handleKeyDown = (event) => {
      // Block DevTools, Refresh, and Certain Shortcuts
      if (
        (event.ctrlKey && event.shiftKey && event.key === "I") || // Ctrl + Shift + I
        (event.ctrlKey && event.shiftKey && event.key === "J") || // Ctrl + Shift + J
        (event.ctrlKey && event.key === "U") || // Ctrl + U
        event.key === "F12" || // F12
        (event.ctrlKey && event.key === "r") || // Ctrl + R
        (event.metaKey && event.key === "r") || // Cmd + R (Mac)
        (event.ctrlKey && event.shiftKey && event.key === "R") || // Ctrl + Shift + R
        event.key === "F5" // F5
      ) {
        event.preventDefault();
      }

      // Additional Security (Only on /questions)
      if (location.pathname === "/questions") {
        if (
          event.key === "Escape" || // Prevent Exiting Fullscreen
          event.key === "F11" || // Prevent F11 (Fullscreen Toggle)
          (event.altKey && event.key === "Tab") || // Prevent Alt + Tab
          (event.metaKey && event.key.toLowerCase() === "d") || // Prevent Windows + D
          (event.ctrlKey && event.metaKey && event.key.toLowerCase() === "d") // Mac alternative for Win + D
        ) {
          event.preventDefault();
          event.stopPropagation(); // Extra measure to block

          if (event.key === "Escape") {
            forceFullScreen(); // Re-enter fullscreen mode
            setModalMessage("Fullscreen mode is required for this assessment.");
            setShowModal(true);
            setCloseModal(() => () => {
              setShowModal(false);
            });
          }
        }
      }
    };

    const handleBlur = () => {
      if (location.pathname === "/questions") {
        setModalMessage(
          "Tab switching is restricted. Exam will submit after excessive switching."
        );
        setShowModal(true);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && location.pathname === "/questions") {
        setModalMessage("Fullscreen mode is required for this assessment.");

        setShowModal(true);
        setCloseModal(() => () => {
          setShowModal(false);
          // showToast("Input field cannot be empty!", "error"); // Show toast if input is empty
          forceFullScreen(); // Force fullscreen instead of redirecting
        });
      }
    };

    const disableContextMenu = (event) => {
      event.preventDefault();
    };

    // Activate Listeners Only on /questions Page
    if (location.pathname === "/questions") {
      document.addEventListener("keydown", handleKeyDown);
      // window.addEventListener("blur", handleBlur);
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      document.addEventListener("contextmenu", disableContextMenu);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("contextmenu", disableContextMenu);
    };
  }, [location, navigate]);

  return (
    <>
      <Toastify />
      {showModal && <Modal message={modalMessage} onClose={closeModal} />}
      {React.cloneElement(children, {
        ref: childRef,
        setShowModal,
        setModalMessage,
        setCloseModal,
        setActivateEventListner,
      })}
    </>
  );
};

export default Security;

