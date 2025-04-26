import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./LeadersPage.module.css";
import footerSetuIcon from "../assets/footer-setu-logo.svg";
import setu from "../assets/setu.png";
import pragyan_logo from "../assets/pragyan_logo.png";
import menu from "../assets/menu.svg";
import setuShortIcon from "../assets/setu-logo-short.svg";
import SETU_logo from "../assets/setu-logo-web-footer.svg";
import profile from "../assets/new-profile-image.png";

import image from "../assets/image.png";
import image_1 from "../assets/image_1.png";
import image_2 from "../assets/image_2.png";
import image_3 from "../assets/image_3.png";
import image_4 from "../assets/image_4.png";
import image_5 from "../assets/image_5.png";
import image_6 from "../assets/image_6.png";
import image_7 from "../assets/image_7.png";
import image_8 from "../assets/image_8.png";
import image_9 from "../assets/image_9.png";
import image_10 from "../assets/image_10.png";
import image_11 from "../assets/image_11.png";
import image_12 from "../assets/image_12.png";
import image_13 from "../assets/image_13.png";
import image_14 from "../assets/image_14.png";
import image_15 from "../assets/image_15.png";
import image_16 from "../assets/image_16.png";
import image_17 from "../assets/image_17.png";
import image_18 from "../assets/image_18.png";
import image_19 from "../assets/image_19.png";
import image_20 from "../assets/image_20.png";
import image_21 from "../assets/image_21.png";
import image_22 from "../assets/image_22.png";

import backIcon from "../assets/backIcon.svg";
import logo_icon from "../assets/backIcon.svg";

const LeadersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [activeButton, setActiveButton] = useState("home");

  const focusedId = location.state?.focusedId || null; // Retrieve the passed focused ID
  const mentorButtonRef = useRef(null); // Ref for the "Meet Our Mentor" button

  const leaders = [
    {
      name: "Jaidev Deshpande",
      designation: "Associate Director Tech",
      company: "Gramener",
      photo: image,
    },
    {
      name: "Rohit Pandharkar",
      designation: "Partner",
      company: "EY",
      photo: image_1,
    },
    {
      name: "Dr. Subarna Roy",
      designation: "Chief Data Scientist",
      company: "IBM",
      photo: image_2,
    },

    {
      name: "Ramdas Narayanan",
      designation: "VP, Client Insights",
      company: "Bank of America",
      photo: image_3,
    },
    {
      name: "Shuvajit Basu",
      designation: "VP & Head of Data Science",
      company: "Tata Digital",
      photo: image_4,
    },
    {
      name: "Biswajit Pal",
      designation: "Director - Data Science",
      company: "Kenvue",
      photo: image_5,
    },

    {
      name: "Monish Mathpal",
      designation: "Data Scientist",
      company: "Gen Re",
      photo: image_6,
    },
    {
      name: "Bastin Robin",
      designation: "CTO & Chief Scientist",
      company: "Clever Insight",
      photo: image_7,
    },
    {
      name: "Jyotishko Biswas",
      designation: "AI Leader - Finance",
      company: "HP",
      photo: image_8,
    },

    {
      name: "Vivek Karmakar",
      designation: "Senior Director",
      company: "Capgemini",
      photo: image_9,
    },
    {
      name: "Somsubhra Sikdar",
      designation: "Head of Data Science",
      company: "Anko",
      photo: image_10,
    },
    {
      name: "Aditya Khandekar",
      designation: "Chief Revenue Officer",
      company: "Corridor Platforms",
      photo: image_11,
    },

    {
      name: "Gaurav Kejriwal",
      designation: "Vice President",
      company: "EXL Analytics",
      photo: image_12,
    },
    {
      name: "Rahul Kumbhat",
      designation: "Head of Strategy",
      company: "Diageo",
      photo: image_13,
    },
    {
      name: "Chandan Sengupta",
      designation: "Data Scientist",
      company: "Cognizant",
      photo: image_14,
    },

    {
      name: "Ratul Banerjee",
      designation: "Head of Model Validation",
      company: "OSB",
      photo: image_15,
    },
    {
      name: "Dipayan Maity",
      designation: "Biostatistician Syneos",
      company: "Health",
      photo: image_16,
    },
    {
      name: "Dipta Pratim Banerjee",
      designation: "Partner",
      company: "Tuteck Technologies",
      photo: image_17,
    },

    {
      name: "Praveen Satyadev",
      designation: "Head - Business Growth",
      company: "C5i",
      photo: image_18,
    },
    {
      name: "Anjanita Das",
      designation: "Director",
      company: "Cognizant",
      photo: image_19,
    },
    {
      name: "Santosh Karthikeyan",
      designation: "Global Technical Director",
      company: "AstraZeneca",
      photo: image_20,
    },

    {
      name: "Poulami Sarkar",
      designation: "Data Scientist",
      company: "Cardinal Health",
      photo: image_21,
    },
    {
      name: "Dr Deep Preet Singh",
      designation: "Vice President, Government AI",
      company: "Adoption at Invest India",
      photo: image_22,
    },

    // { name: "Sam Wilson", designation: "AI Specialist", company :"TCS", photo: image_22 },
  ];

  useEffect(() => {
    // Focus the mentor button when navigating back to this page
    if (focusedId === "mentor-button" && mentorButtonRef.current) {
      mentorButtonRef.current.focus();
    }
  }, [focusedId]);

  const handleNavigation = (course) => {
    // Navigation logic here
  };

  const handleButtonClick = (button) => {
    setActiveButton(button); // Set the active button
  };

  const handleBackClick = () => {
    navigate("/", { state: { focusedId } }); // Navigate back to the Test Card Page, passing the focused ID
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleProfileClick = () => {
    //console.log("Profile button clicked!");

    const currentPath = location.pathname;
    navigate(`/complete-profile?returnUrl=${encodeURIComponent(currentPath)}`);
  };

  const navigateLogin = (e) => {
    const currentPath = location.pathname;
    // navigate("/login-project");
    navigate(`/login-project?returnUrl=${encodeURIComponent(currentPath)}`);
  };

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

  const RedirectForBusiness = () => {
    window.open("https://setuschool.com/setu-business", "_blank");
  };
  return (
    <>
      <div className={classes["wrapper"]}>
        <div className={classes["header"]}>
          <div className={classes["logo"]}>
            <img
              src={windowWidth <= 767 ? setuShortIcon : SETU_logo}
              alt="Time Per Question"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            />

            <div className={classes["nav"]}>
              <ul>
                <li onClick={aboutUsRedirect}>About Us</li>
                <li onClick={RedirectForBusiness}>For Business</li>
              </ul>
            </div>
          </div>

          {/* <div className={classes["actions"]}>
            <a href="https://setuqverse.com/" target="_blank">
              <button className={classes["take-free-assessment"]}>
                Take Free Assessment
              </button>
            </a>

            {isLoggedIn ? (
              <>
                <button
                  className={classes["login-btn"]}
                  onClick={handleProfileClick}
                >
                  <img src={profile} alt="" />
                </button>
              </>
            ) : (
              <button className={classes["login"]} onClick={navigateLogin}>
                Login
              </button>
            )}

            <img src={menu} alt="Time Per Question" />
          </div> */}
        </div>
        <div className={classes["container"]}>
          <div className={classes["top-part"]}>
            <div
              className={classes["back-button"]}
              id="back-button"
              tabIndex="0" // Make focusable
              onClick={handleBackClick}
            >
              <img src={logo_icon} alt="Back" className={logo_icon.icon} />
            </div>

            <div className={classes["pragyan-part"]}>
              <img
                className={classes["pragyan-logo"]}
                src={pragyan_logo}
                alt="logo"
              />
              <p className={classes["pragyan-p"]}>Meet the Community</p>
            </div>
          </div>

          <div className={classes["photos"]}>
            {leaders.map((leader, index) => (
              <div key={index} className={classes["leader"]}>
                <img
                  src={leader.photo}
                  alt={`${leader.name} Photo`}
                  className={classes["leader-photo"]}
                />
                <div className={classes["leader-info"]}>
                  <p className={classes["leader-name"]}>{leader.name}</p>
                  <p className={classes["leader-designation"]}>
                    {leader.designation}
                  </p>
                  <p className={classes["leader-company"]}>{leader.company}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={classes["buttoncontainer"]}>
            <button
              className={`${classes.home} ${
                activeButton === "home" ? classes.active : ""
              }`}
              onClick={() => handleButtonClick("home")}
            >
              Home
            </button>
            <button
              className={`${classes.logout} ${
                activeButton === "logout" ? classes.active : ""
              }`}
              onClick={() => handleButtonClick("logout")}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile footer */}
        <footer className={classes["mentor-page-footer"]}>
          <img src={SETU_logo} className={classes["footer-setu-icon"]} alt="" />

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

        {/* Web Footer */}
        <div className={classes["footer"]}>
          <div className={classes["footer-first"]}>
            <img src={SETU_logo} alt="" />
            <p>Email : mitra@setuschool.com</p>
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
      </div>
    </>
  );
};

export default LeadersPage;
