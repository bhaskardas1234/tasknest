// this page completed

import React, { useEffect, useState, useContext } from "react";
import classes from "./TestInstructions.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import backIcon from "../assets/backIcon.svg";
import icon1 from "../assets/icon1.svg";
import icon2 from "../assets/icon2.svg";
import brain from "../assets/brain.svg";
import happy from "../assets/happy.svg";
import python from "../assets/python.svg";
import details_loader from "../assets/details-loder.gif";
import loader from "../assets/loader.gif";
import { QuestionContext } from "../context/QuestionContext";
import { SERVER_URL } from "../index.js";
import { useUserActivity } from "../context/UserActivityContext";
import setuShortIcon from "../assets/setu-logo-short.svg";
import menuIcon from "../assets/menu.svg";
import profileIcon from "../assets/profile.svg";
import SETU_logo from "../assets/setu-logo-web-footer.svg";
import gifIcon from "../assets/warning.gif";

const TestInstructions = ({
  setShowModal,
  setModalMessage,
  setActivateEventListner,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // const exam_id = searchParams.get("exam_id");
  const exam_name = searchParams.get("exam_name");
  const [showMoreForDescription, setShowMoreForDescription] = useState(false);
  const [showMoreForInstruction, setShowMoreForInstruction] = useState(false);
  const [subject, setSubject] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questionCount, setQuestionCount] = useState(20);
  const { setTestDetails } = useContext(QuestionContext);
  const [showPopup, setShowPopup] = useState(false);
  const [loderFlag, setLoderFlag] = useState(false);

  const { logActivity, activityHistory, clearActivity } = useUserActivity();
  const [complexityMix, setComplexityMix] = useState({
    easy: 30,
    moderate: 30,
    complex: 40,
  });

  useEffect(() => {
    logActivity({
      event: "view_page",
      source_page: `${location.pathname}`,
      event_timeline: new Date().toLocaleString(),
    });
    setLoderFlag(false);
    setActivateEventListner(true);
    get_exam_details();
  }, []);

  const get_exam_details = async () => {
    try {
      const payload = {
        exam_name: exam_name,
      };
      //  this api fetching the one and one exam details with the exam_id
      const response = await fetch(`${SERVER_URL}/get-exam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubject(await response.json());
        setTimeout(() => {
          setLoading(false); //after fetching the exam details loder gets false
        }, 500);
      } else {
        console.error("Failed to fetch exam_details");
      }
    } catch (error) {
      console.error("Error fetching exam_details........:", error);
    }
  };

  // this function is for the regular type test
  const profileBasedTest = async () => {
    if (!checkTestStatus()) {
      setModalMessage("Test is Going on another tab!! Please complete it");
      setShowModal(true);
      return;
    }
    logActivity({
      event: "start-exam",
      exam_name: `${exam_name}`,
      source_page: `${location.pathname}`,
      test_type: `skill based`,
      activity: `Start Assessment button clicked  for ${exam_name} test from ${location.pathname} route `,
      event_timeline: new Date().toLocaleString(),
    });

    if (
      complexityMix.easy + complexityMix.moderate + complexityMix.complex ===
      100
    ) {
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email;
      const payload = {
        email: email,
        exam_name: exam_name,
      };

      const response = await fetch(`${SERVER_URL}/allocate_exam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.status === 200) {
        const testDetails = {
          test_details: data,
          test_id: data.allocation_id,
          test_name: data.exam_name,
        };

        testDetails.test_details.original_duration =
          data.exam_duration_in_seconds;
        setTestDetails(testDetails); //this contex api store the all question along with the time and points and all
        sessionStorage.setItem("test_details", JSON.stringify(testDetails));
        localStorage.setItem("test_status", "ongoing");
        sessionStorage.setItem("is_original_test_tab", true);

        logActivity({
          event: "start-exam",
          exam_status: "successful",
          course_name: `${exam_name}`,
          source_page: `${location.pathname}`,
          test_type: `skill based`,
          activity: `Exam started for ${exam_name} test and redirct to /question route`,
          event_timeline: new Date().toLocaleString(),
        });
        const enterFullScreen = async () => {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            await document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            await document.documentElement.webkitRequestFullscreen();
          } else if (document.documentElement.msRequestFullscreen) {
            await document.documentElement.msRequestFullscreen();
          }
        };

        setLoading(true);
        setLoderFlag(true);
        await enterFullScreen();
        setTimeout(() => {
          setLoderFlag(true);
          setLoading(false); // After 2 seconds, set loading to false to show the content
          navigate(
            `/questions?exam_name=${exam_name}&total_questions=${questionCount}&test_id=${
              data.allocation_id
            }&test_name=${encodeURIComponent(data.test_name)}&t=${
              subject.exam_category
            }`
          );
        }, 2000);
      } else {
        logActivity({
          event: "start-exam",
          exam_status: "failed",
          course_name: `${exam_name}`,
          source_page: `${location.pathname}`,
          test_type: `skill based`,
          activity: `Exam failed of start due to server error`,
          event_timeline: new Date().toLocaleString(),
        });
        if (response.status === 403) {
          //console.log("hdfjdfjdfjj")
          // const data=await response.json()
          setAllcationId(data.last_allocation_id);
          setShowPopup(true);
        }
        // alert(`${data.error}`);
      }
    } else {
      logActivity({
        event: "start-exam",
        exam_status: "failed",
        course_name: `${exam_name}`,
        source_page: `${location.pathname}`,
        test_type: `skill based`,
        activity: `Exam failed of start due to server error`,
        event_timeline: new Date().toLocaleString(),
      });
      // alert("please sum up the value of percentage");
    }
  };

  // this function is for whether the test is going on anoter tab or not
  const checkTestStatus = () => {
    try {
      const testStatus = localStorage.getItem("test_status");
      const isOriginalTestTab = sessionStorage.getItem("is_original_test_tab");
      if (!testStatus) return true;

      if (testStatus === "ongoing" && isOriginalTestTab) {
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const toggleShowMoreForDescription = () => {
    setShowMoreForDescription((prev) => !prev);
  };
  const toggleShowMoreForInstruction = () => {
    setShowMoreForInstruction((prev) => !prev);
  };

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };
  // this function in use when mcqsetup page is going to start for skill based exam
  const handleNavigation = () => {
    navigate(
      `/personlized-test?&exam_name=${exam_name}&t=${subject.exam_category}`
    );
  };

  const showInstruction = (instructions = []) => {
    // Predefined images
    const defaultImages = [icon2, icon1, happy, brain];
    if (!Array.isArray(instructions)) {
      console.error("Instructions data is not an array:", instructions);
      return null; // Prevent rendering if invalid data
    }

    return (
      <div className={classes["instruction"]}>
        <p className={classes["instruction-head"]}>Instructions</p>

        {instructions.slice(0, 2).map((instruction, index) => (
          <React.Fragment key={index}>
            <span className={classes["instruction-details1"]}>
              <img
                src={defaultImages[index % defaultImages.length]}
                alt="icon"
                className={classes["icon-logo"]}
              />
              <p>{instruction}</p>
            </span>
            <hr className={classes["color-hr"]} />
          </React.Fragment>
        ))}

        {!showMoreForInstruction && instructions.length > 2 && (
          <div
            className={classes["see-more"]}
            onClick={toggleShowMoreForInstruction}
          >
            <p>See More</p>
          </div>
        )}

        {showMoreForInstruction && (
          <>
            {instructions.slice(2).map((instruction, index) => (
              <React.Fragment key={index + 2}>
                <span className={classes["instruction-details1"]}>
                  <img
                    src={defaultImages[(index + 2) % defaultImages.length]}
                    alt="icon"
                    className={classes["icon-logo"]}
                  />
                  <p>{instruction}</p>
                </span>
                <hr className={classes["color-hr"]} />
              </React.Fragment>
            ))}

            <div
              className={classes["see-more"]}
              onClick={toggleShowMoreForInstruction}
            >
              <p>See Less</p>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderDescription = (description) => {
    const hasNumbering = /\d+\.\s/.test(description);

    if (hasNumbering) {
      const splitDescription = description.split(/\d+\.\s/);
      const mainText = splitDescription[0].trim();
      const bulletPoints = splitDescription
        .slice(1)
        .map((point, index) => (
          <p key={index}>{`${index + 1}. ${point.trim()}`}</p>
        ));

      return (
        <div>
          <p>{mainText}</p>
          {!showMoreForDescription && (
            <div
              className={classes["see-more"]}
              onClick={toggleShowMoreForDescription}
            >
              <p>See More</p>
            </div>
          )}
          {showMoreForDescription && (
            <>
              {bulletPoints}
              <div
                className={classes["see-more"]}
                onClick={toggleShowMoreForDescription}
              >
                <p>See Less</p>
              </div>
            </>
          )}
        </div>
      );
    }

    // If no numbering, handle truncation properly
    const words = description.split(" ");
    const isLongText = words.length > 50;
    const shortText = isLongText
      ? words.slice(0, 50).join(" ") + "..."
      : description;

    return (
      <div>
        <p>{showMoreForDescription ? description : shortText}</p>
        {isLongText && (
          <div
            className={classes["see-more"]}
            onClick={toggleShowMoreForDescription}
          >
            <p>{showMoreForDescription ? "See Less" : "See More"}</p>
          </div>
        )}
      </div>
    );
  };

  const [allocationId, setAllcationId] = useState(null);
  const viewResult = () => {
    navigate(`/result/${allocationId}`);
  };
  const onClose = () => {
    setShowPopup(false);
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

  return (
    <>
      <div className={classes["wrapper"]}>
        {loading ? (
          <div className={classes["load-container"]}>
            <img
              src={loderFlag ? loader : details_loader}
              alt="Loading..."
              width="100"
            />
          </div>
        ) : (
          <>
            <div className={classes.container}>
              <div className={classes["header-part"]}>
                <img
                  src={setuShortIcon}
                  alt=""
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/")}
                />
                <div className={classes["header-part-right"]}>
                  <img
                    className={classes["profile"]}
                    src={profileIcon}
                    alt=""
                  />
                  <img src={menuIcon} alt="" />
                </div>
              </div>

              {/* Back Button */}
              <div
                className={classes["back-button"]}
                onClick={() => navigate("/")}
              >
                <img
                  src={backIcon}
                  alt="Back"
                  className={classes["back-icon"]}
                />
              </div>

              {/* Header with Logo */}
              <div className={classes["top-section"]}>
                <div className={classes["header"]}>
                  <img
                    src={subject.exam_image || python}
                    alt="Logo"
                    className={classes["logo"]}
                  />
                </div>
                <div className={classes["right-part"]}>
                  {/* Subject Name */}
                  <h1>{subject.exam_name}</h1>

                  <div className={classes["description"]}>
                    <p className={classes["description-head"]}>
                      Description / Case Details
                    </p>
                    {/* Description Section */}
                    <div className={classes["p-style"]}>
                      <span className={classes["des-style"]}>
                        {/* to set the description */}
                        {renderDescription(subject.exam_description)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes["card-padding"]}>
                {/* Instructions Section */}
                {showInstruction(subject.exam_instruction)}
              </div>
            </div>

            <div className={classes["buttons"]}>
              {subject.exam_category === "Profile Based" ? (
                <button
                  className={classes["button"]}
                  // onClick={() => handleStartTest()}
                  onClick={() => profileBasedTest()}
                >
                  Start
                </button>
              ) : (
                <button
                  className={classes["button"]}
                  //  onClick={() => handleStartTest()}
                  onClick={() => handleNavigation()}
                  //  onClick={() => regularTest()}
                >
                  Skill Assessment
                </button>
              )}
            </div>
            <footer className={classes["test-instruction-footer"]}>
              <img
                src={SETU_logo}
                className={classes["footer-setu-icon"]}
                alt=""
              />

              <p className={classes["email"]}>Email : mitra@setuschool.com</p>
              <br />
              <p className={classes["email"]}>Phone & Whatsapp : 8100551189</p>
              <br />
              <p className={classes["address"]}>
                SETU, Awfis co-working space, 6th floor, Phase II, 50,
                Chowringee Road, Elgin, Kolkata, west Bengal 700071{" "}
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
                <p>Email : mitra@setuschool.com</p>
                <p>Phone & Whatsapp : 8100551189</p>
                <p>
                  SETU, Awfis co-working space, 6th floor, Phase II,
                  <br />
                  50, Chowringee Road, Elgn, Kolkata, west Bengal 700071{" "}
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
      {showPopup && (
        <div className={classes["overlay"]}>
          <div className={classes["submit-popup"]}>
            <div>
              <img src={gifIcon} alt="" />
            </div>

            <p className={classes["main-q"]}>Test already attempted</p>
            <div className={classes["popup-actions"]}>
              <button className={classes["cancel-button"]} onClick={onClose}>
                Close
              </button>
              <button
                className={classes["confirm-button"]}
                onClick={() => viewResult()}
              >
                View Result
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TestInstructions;
