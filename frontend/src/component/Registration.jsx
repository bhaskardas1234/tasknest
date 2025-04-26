import React, { useEffect, useState } from "react";
import classes from "./Registration.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { SERVER_URL } from "../index.js";
import signupImg from "../assets/login-img-mobile.png";
import logo from "../assets/Setu-Logo-mobile.png";
import menu from "../assets/menu-icon.png";
import assessments from "../assets/assessments.svg";
import search from "../assets/search-line.svg";
import dashboards from "../assets/dashboard.svg";
import projects from "../assets/projects.svg";
import { useUserActivity } from "../context/UserActivityContext";
import Toastify, { showToast } from "./Toastify";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showResend, setShowResend] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const location = useLocation();

  const navigate = useNavigate();
  const { logActivity } = useUserActivity();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const startCountdown = () => {
    setTimer(90);
    setShowResend(false);
    setShowOtpInput(true);
  };

  useEffect(() => {
    if (timer > 0) {
      const timeout = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timeout);
    } else if (otpSent) {
      setShowResend(true);
      setShowOtpInput(false); // Hide OTP input when timer ends
    }
  }, [timer]);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }

    logActivity({
      event: "view_page",
      source_page: `${location.pathname}`,
      event_timeline: new Date().toLocaleString(),
    });
  }, []);

  const sendOTP = async () => {
    setError(""); // Clear previous errors

    if (!email) {
      setError("Enter email to send OTP");
      return;
    } else if (!emailRegex.test(email)) {
      setError("Invalid email");
      return;
    }

    const otp_payload = { email };
    setDisabled(true);

    try {
      const response = await fetch(`${SERVER_URL}/login-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(otp_payload),
      });

      if (!response.ok) {
        setError("Failed to send OTP. Try again.");
        return;
      }

      setOtpSent(true);
      startCountdown();
      showToast("OTP sent successfully");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setDisabled(false);
    }
  };
  const getUserAgent = () => {
    return navigator.userAgent;
  };

  useEffect(() => {
    //console.log(userDetails);
  }, [userDetails]);

  const otpSubmit = async (e) => {
    const userAgent = getUserAgent();

    setError("");

    if (!otp) {
      return;
    }

    const otpVerifyPayload = { otp, email };

    try {
      const response = await fetch(`${SERVER_URL}/verify-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": userAgent, // Send User-Agent in headers
        },
        body: JSON.stringify(otpVerifyPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.message || "OTP verification failed. Please try again.";
        setError(`${errorMessage}`);
      }

      if (data.status === "success") {
        // Store session token & user ID
        localStorage.setItem("session_token", data.session_token);
        localStorage.setItem(
          "user",
          JSON.stringify({ email, user_id: data.user_id })
        );
        setError(""); // Clear any previous error

        // Redirect user after successful login
        showToast("Login successful");

        const returnedUserDetails = await getUserDetails();
        //console.log(returnedUserDetails);
        if (returnedUserDetails && returnedUserDetails.user_details) {
          //console.log("INSIDE IF 1");
          //console.log(returnedUserDetails.user_details);
          if (
            returnedUserDetails.user_details.user_name &&
            returnedUserDetails.user_details.linkedin_profile &&
            returnedUserDetails.user_details.phone_no &&
            returnedUserDetails.user_details.year_of_experience &&
            returnedUserDetails.user_details.institute_or_organization
          ) {
            console.log("INSIDE IF 2");
            setTimeout(() => {
              const redirectPath = location.state?.from?.pathname || "/";
              navigate(redirectPath, { replace: true });
            }, 1000);
          } else {
            console.log("INSIDE ELSE 1");
            setTimeout(() => {
              const redirectPath = location.state?.from || "/completeprofile"; // Preserve full path + query
              console.log(redirectPath);
              navigate(redirectPath, { replace: true });
            }, 1000);
          }
        } else {
          //console.log("INSIDE ELSE 2");
          setTimeout(() => {
            const redirectPath =
              location.state?.from?.pathname || "/completeprofile";
            navigate(redirectPath, { replace: true });
          }, 1000);
        }
      } else {
        setError("Invalid OTP or expired OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while verifying OTP. Please try again.");
    }
  };

  const handleResendOTP = () => {
    setOtp("");
    setShowOtpInput(true); // Show OTP input again when resending
    setShowResend(false);
    setResendDisabled(true);
    sendOTP();
    setTimeout(() => setResendDisabled(false), 3000); // Enable button after 3 sec
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
    }
  };

  // Call OTP submit only when OTP reaches exactly 6 digits
  useEffect(() => {
    if (otp.length === 6) {
      otpSubmit();
    }
  }, [otp]);

  const getUserDetails = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/user-results/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        //console.log(data);
        setUserDetails(data);
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user details");
      }

      //console.log("User details fetched successfully:", data);
      return data;
    } catch (error) {
      console.error("Error fetching user details:", error.message);

      return null; // Returns null in case of failure
    }
  };

  return (
    <>
      <Toastify />
      <div className={classes["container"]}>
        {/* <div className={classes["header-div"]}>
          <div className={classes["header-logo"]}>
            <img src={logo} alt="Logo" />
          </div>
          <div className={classes["header-right"]}>
            <div className={classes["free-assment"]}>Take Free Assessment</div>
            <div className={classes["login"]}>Login</div>
            <div>
              <img src={menu} alt="Menu" />
            </div>
          </div>
        </div> */}

        <div className={classes["main-div"]}>
          <div className={classes["img-div"]}>
            <img src={signupImg} alt="Signup" className={classes["img"]} />
          </div>
          <div className={classes["content-div"]}>
            <div className={classes["content"]}>
              <div className={classes["login-content"]}>
                <h2 className={classes["login-heading"]}>
                  Login {error && <p className={classes["error"]}>{error}</p>}
                </h2>

                <div className={classes["form-group-email"]}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className={classes["inp-box"]}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={otpSent}
                    placeholder="heisenberg@gmail.com"
                  />
                </div>

                {otpSent && (
                  <div className={classes["form-group-otp"]}>
                    {showOtpInput && (
                      <>
                        <label htmlFor="otp">Enter OTP</label>
                        <div className={classes["otp-input-container"]}>
                          <input
                            type="tel"
                            inputmode="numeric" pattern="[0-9]*"
                            id="otp"
                            className={classes["inp-box"]}
                            value={otp}
                            onChange={handleChange}
                            maxLength={6}
                            placeholder="Enter OTP"
                          />
                          {timer > 0 && (
                            <div className={classes["timer-text-div"]}>
                              <span className={classes["timer-text"]}>
                                {timer + " "}Sec
                              </span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className={classes["button-group"]}>
                  {!otpSent && (
                    <button
                      className={classes["login-btn"]}
                      onClick={sendOTP}
                      disabled={disabled}
                    >
                      Get OTP
                    </button>
                  )}
                  {!showOtpInput && showResend && (
                    <button
                      className={classes["login-btn"]}
                      onClick={handleResendOTP}
                      disabled={resendDisabled}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={classes["footer"]}>
          <div className={classes["footer-div"]}>
            <div className={classes["footer-function"]}>
              <div className={classes["footer-assessment"]}>
                <img src={assessments} alt="Assessment" />
                <div className={classes["free"]}>Free</div>
              </div>
              <p>Assessment</p>
            </div>
            <div className={classes["footer-function"]}>
              <img src={projects} alt="Projects" />
              <p>Projects</p>
            </div>
            <div className={classes["footer-function"]}>
              <img src={search} alt="Search" />
              <p>Search</p>
            </div>
            <div className={classes["footer-function"]}>
              <img src={dashboards} alt="Dashboard" />
              <p>Dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
