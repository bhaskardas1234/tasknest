
import React, { useState, useEffect, useContext } from "react";
import classes from "../component/TestSubmittedSuccess.module.css";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { QuestionContext } from "../context/QuestionContext";

const TestSubmittedSuccess = () => {
  const { test_Id } = useParams();
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { testDetails, setTestDetails } = useContext(QuestionContext);

  useEffect(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen(); // Exit fullscreen when submitting
    }
    // After 4 seconds, switch to the analyzing animation
    if (localStorage.getItem("user")) {
      setTimeout(() => {
        setShowAnalyzing(true);
      }, 4000);
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (showAnalyzing) {
      // Redirect to the results page after 5 seconds of analyzing
      const analyzingTimer = setTimeout(() => {
        navigate(`/result/${test_Id}`); // Replace "/results" with your actual results page route
      }, 100);

      return () => clearTimeout(analyzingTimer); // Clear timeout on unmount
    }
  }, [showAnalyzing, navigate]);

  return (
    <>
      <div className={classes["test-submission"]}>
        <div className={classes["container"]}>
          {!showAnalyzing ? (
            <>
              <div className={classes["success-message"]}>
                <p>Test Submitted Successfully</p>
              </div>
              <div className={classes["animation"]}>
                <svg
                  className={classes["svg-glow"]}
                  xmlns="http://www.w3.org/2000/svg"
                  width="144"
                  height="144"
                  viewBox="0 0 144 144"
                  fill="none"
                >
                  <g opacity="1" filter="url(#filter0_f_770_343)">
                    <ellipse
                      cx="72.0001"
                      cy="72.0002"
                      rx="48.5872"
                      ry="48.5872"
                      fill="#81FE9D"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_f_770_343"
                      x="0.46537"
                      y="0.465492"
                      width="143.069"
                      height="143.069"
                      filterUnits="userSpaceOnUse"
                      color-interpolation-filters="sRGB"
                    >
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                      />
                      <feGaussianBlur
                        stdDeviation="11.4737"
                        result="effect1_foregroundBlur_770_343"
                      />
                    </filter>
                  </defs>
                </svg>

                <svg
                  className={classes["tick-svg"]}
                  xmlns="http://www.w3.org/2000/svg"
                  width="56"
                  height="44"
                  viewBox="0 0 56 44"
                  fill="none"
                >
                  <path
                    d="M48.0592 3.90669C49.7501 2.21576 52.4916 2.21577 54.1825 3.90669C55.0904 4.81453 55.0904 6.28642 54.1825 7.19426L20.1685 41.2083C19.0931 42.2837 17.3496 42.2837 16.2742 41.2083L15.463 40.3972C14.3876 39.3218 14.3876 37.5782 15.463 36.5028L48.0592 3.90669Z"
                    fill="#81FE9C"
                  />
                  <path
                    d="M3.24496 28.4396C1.54774 26.755 1.53752 24.0135 3.22213 22.3163C4.12657 21.405 5.59846 21.3996 6.50967 22.304L20.8043 36.4925C21.8837 37.5638 21.8902 39.3074 20.8189 40.3867L20.0107 41.2009C18.9394 42.2803 17.1958 42.2868 16.1165 41.2154L3.24496 28.4396Z"
                    fill="#81FE9C"
                  />
                </svg>
              </div>
            </>
          ) : (
            <>
           </>
          )}
        </div>
      </div>
    </>
  );
};
export default TestSubmittedSuccess;
