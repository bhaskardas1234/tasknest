// perfect
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Function to show toast and remove previous one
const showToast = (message, type = "success") => {
  toast.dismiss(); // Dismiss the previous toast
  toast[type](message, {
    position: "top-right",
    autoClose: 3000, // Toast duration (3 sec)
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

const Toastify = () => {
  return <ToastContainer />;
};

export { showToast };
export default Toastify;
