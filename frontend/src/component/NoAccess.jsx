import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import classes from "./NoAccess.module.css";

import loader from "../assets/loader.gif";
import setuShortIcon from "../assets/setu-logo-short.svg";
import menuIcon from "../assets/menu.svg";
import SETU_logo from "../assets/setu-logo-web-footer.svg";
import comingSoonIcon from "../assets/coming-soon.svg";
import { SERVER_URL } from "../index.js";
import backIcon from "../assets/backIcon.svg";
import Toastify, { showToast } from "./Toastify"; // Import Toastify and showToast

const NoAccess = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(false);
  const [notify, setNotify] = useState(false);
  const { course } = useParams(); // Path parameter
  const decodedCourse = decodeURIComponent(course);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      // get_course_info(); //get all profile based and skill based course info
      const userData = localStorage.getItem("user");

      if (!userData) {
        console.warn(
          "No user data found in localStorage. Setting isLoggedIn to false."
        );
        setIsLoggedIn(false); // Ensure false if data is missing
        return;
      }

      const user = JSON.parse(userData);

      if (!user?.email) {
        console.warn("User object does not contain a valid email:", user);
        setIsLoggedIn(false); // Ensure false if email is missing
        return;
      }
      setIsLoggedIn(true); // If valid user data exists, set true
    } catch (error) {
      console.error("Error reading user from localStorage:", error);
      setIsLoggedIn(false); // Ensure false in case of errors
    }
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    //console.log("hello world");
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email;

      const response = await fetch(`${SERVER_URL}/get-notifications/${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      const notification = data.notifications.find(
        (n) => n.exam_name === course
      );

      setNotify(!!notification);

      setNotifications(data.notifications);
      //console.log(data.notifications, notify);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  async function sendNotification() {
    if (isLoggedIn) {
      setNotify(true);
      //console.log("Sending notification...");
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email;

      if (!email) {
        throw new Error("User email not found in local storage.");
      }

      try {
        const payload = {
          user_email: email,
          exam_name: course,
          exam_type: "None",
          reason_for_notify: `I would like to be notified when the ${course} is live.`,
        };

        // //console.log("Payload:", payload); // Debugging

        const response = await fetch(`${SERVER_URL}/notify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to send notification");
        }
        if(decodedCourse==="Agentic AI - Build Autonomous Solutions" || decodedCourse==="RDBMS & SQL (PostgreSQL)" ){
          showToast(`Thanks for your interest! You'll be notified as soon as the ${decodedCourse} course launches.`);
          }
        else{
               showToast(`Thanks for your interest! You'll be notified as soon as the ${decodedCourse} assessment launches.`);
         

        }
       
        return result;
      } catch (error) {
       

        return null; // Return null in case of failure
      }
    } else {
      navigate("/login", {
        state: { from: `/noaccess/${encodeURIComponent(decodedCourse)}` },
      });
    }
  }

  const privacyPolicyRedirect = () => {
    window.open("https://setuschool.com/privacy_policy", "_blank");
  };

  const termsAndConditionsRedirect = () => {
    window.open("https://setuschool.com/terms_condition", "_blank");
  };

  const aboutUsRedirect = () => {
    window.open("https://setuschool.com/about", "_blank");
  };

  const blogsRedirect = () => {
    window.open("https://setuschool.com/all/blog", "_blank");
  };

  const contactUsRedirect = () => {
    window.open("https://setuschool.com/contact", "_blank");
  };

  const returnAndRefundPolicyRedirect = () => {
    window.open("https://setuschool.com/return_refund", "_blank");
  };

  return (<>
    <Toastify/>
    <div className={classes["container"]}>
      {loading ? (
        <div className={classes["load-container"]}>
          <img src={loader} alt="Loading..." width="100" />
        </div>
      ) : (
        <>
          <div className={classes["header-part"]}>
            <img
              src={setuShortIcon}
              alt=""
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
            <div className={classes["header-part-right"]}>
              <img src={menuIcon} alt="" />
            </div>
          </div>
          {/* back button */}
          <div className={classes["back-button"]} onClick={() => navigate(-1)}>
            <img src={backIcon} alt="Back" className={classes["back-icon"]} />
          </div>

          <div className={classes["mcq-container"]}>
            <div className={classes["heading-container"]}>
              <div className={classes["heading"]}>
                <p className={classes["heading-p"]}>{decodedCourse}</p>
              </div>
            </div>

            <div>
              <img src={comingSoonIcon} alt="" />
            </div>

            <div className={classes["test-start"]}>
              {notify ? (
                <button className={classes["notify-me"]} style={{color:"#0ab81f",borderColor:"#0ab81f"}}>Notified</button>
              ) : (
                <button
                  onClick={sendNotification}
                  className={classes["notify-me"]}
                >
                  Notify Me
                </button>
              )}
            </div>
          </div>
          <footer className={classes["mcq-setup-footer"]}>
            <img
              src={SETU_logo}
              className={classes["footer-setu-icon"]}
              alt=""
            />

            <p className={classes["email"]}>Email : mitra@setushool.com</p>
            <br />
            <p className={classes["email"]}>Phone & Whatsapp : 8100551189</p>
            <br />
            <p className={classes["address"]}>
              SETU, Awfis co-working space, 6th floor, Phase II, 50, Chowringee
              Road, Elgin, Kolkata, west Bengal 700071{" "}
            </p>

            <br />
            <p className={classes["about-p"]}>About </p>
            <ul className={classes["about-lists"]}>
              <li onClick={aboutUsRedirect}>About us</li>
              <li onClick={blogsRedirect}>Blogs</li>
              <li onClick={contactUsRedirect}>Contacts</li>
              <li onClick={privacyPolicyRedirect}>Privacy Policy</li>
              <li onClick={termsAndConditionsRedirect}>Terms & Conditions</li>
              <li onClick={returnAndRefundPolicyRedirect}>
                Return & Refund Policy
              </li>
            </ul>
          </footer>
          <div className={classes["footer"]}>
            <div className={classes["footer-first"]}>
              <img src={SETU_logo} alt="" />
              <p>Email : mitra@setushool.com</p>
              <p>Phone & Whatsapp : 8100551189</p>
              <p>
                SETU, Awfis co-working space, 6th floor, Phase II,
                <br />
                50, Chowringee Road, Elgin, Kolkata, west Bengal 700071{" "}
              </p>
            </div>

            <div className={classes["footer-last-div"]}>
              <div className={classes["footer-last"]}>
                <p className={classes["footer-about"]}>About</p>
                <p onClick={aboutUsRedirect}>About us</p>
                <p onClick={blogsRedirect}>Blogs</p>
                <p onClick={contactUsRedirect}>Contact us</p>
              </div>
              <div className={classes["footer-last"]}>
                <p onClick={privacyPolicyRedirect}>Privacy Policy</p>
                <p onClick={termsAndConditionsRedirect}>Terms & Conditions</p>
                <p onClick={returnAndRefundPolicyRedirect}>
                  Return & Refund Policy
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
    </>
  );
};

export default NoAccess;
