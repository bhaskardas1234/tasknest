import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useRef,
  useCallback,
} from "react";
import classes from "./MCQTestSetup.module.css";
import gifIcon from "../assets/warning.gif";

import { useNavigate, useLocation } from "react-router-dom";
import { QuestionContext } from "../context/QuestionContext";
import loader from "../assets/loader.gif";
import { SERVER_URL } from "../index.js";
import setuShortIcon from "../assets/setu-logo-short.svg";
import menuIcon from "../assets/menu.svg";
import SETU_logo from "../assets/setu-logo-web-footer.svg";
import comingSoonIcon from "../assets/coming-soon.svg";
import basicIcon from "../assets/Basic.svg";
import intermediateIcon from "../assets/Intermediate.svg";
import backIcon from "../assets/backIcon.svg";
import complexIcon from "../assets/Complex.svg";
import Toastify, { showToast } from "./Toastify"; // Import Toastify and showToast

export const GlobalContext = createContext();

const MCQTestSetup = ({
  setShowModal,
  setModalMessage,
  setActivateEventListner,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOTPPopupVisible, setIsOTPPopupVisible] = useState(false);
  const { setQuestions, setDuration } = useContext(QuestionContext);
  const searchParams = new URLSearchParams(location.search);
  const exam_id = searchParams.get("exam_id");
  const subject_name = searchParams.get("exam_name");
  const subject_type = searchParams.get("t");
  const [subtopic, setSubtopic] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const { setTestDetails } = useContext(QuestionContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [questionCount, setQuestionCount] = useState(20);
  const [testType, setTestType] = useState("mcq");
  const [subtopices, setSubtopices] = useState([]);
  const [selectedSubtopics, setSelectedSubtopics] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const dropdownRef = useRef(null);
  const [error, setError] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [notify, setNotify] = useState(false);

  const [complexityMix, setComplexityMix] = useState({
    easy: 30,
    moderate: 40,
    complex: 30,
  });

  const calculateTotalTime = useCallback(() => {
    // this are time for the question basis when mcq 30 sec and description Mode 60 miniute
    const easyTime = testType === "mcq" ? 30 : 60;
    const moderateTime = testType === "mcq" ? 45 : 90;
    const complexTime = testType === "mcq" ? 60 : 120;

    let easyQuestions = Math.floor((complexityMix.easy / 100) * questionCount);

    let moderateQuestions = Math.floor(
      (complexityMix.moderate / 100) * questionCount
    );

    let complexQuestions = Math.floor(
      (complexityMix.complex / 100) * questionCount
    );

    const totalAssignedQuestions =
      easyQuestions + moderateQuestions + complexQuestions;
    let remainingQuestions = questionCount - totalAssignedQuestions;

    const minQuestions = Math.min(
      easyQuestions,
      moderateQuestions,
      complexQuestions
    );

    if (minQuestions === easyQuestions) {
      easyQuestions += remainingQuestions;
    } else if (minQuestions === moderateQuestions) {
      moderateQuestions += remainingQuestions;
    } else {
      complexQuestions += remainingQuestions;
    }

    const totalTimeCalculated =
      easyQuestions * easyTime +
      moderateQuestions * moderateTime +
      complexQuestions * complexTime;

    setTotalTime(totalTimeCalculated);
  }, [complexityMix, questionCount, testType]);

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
        (n) => n.exam_name === subject_name
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

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    fetchNotifications();

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (testType) {
      calculateTotalTime();
    }
  }, [calculateTotalTime]);

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

  //this function is for genarating the question set for the exam
  const startTest = async () => {
    if (!checkTestStatus()) {
      setModalMessage("Test is Going on another tab!! Please complete it");
      setShowModal(true);
      return;
    }
    if (
      parseInt(complexityMix.easy) +
        parseInt(complexityMix.moderate) +
        parseInt(complexityMix.complex) ===
      100
    ) {
      var exam_payload = {
        email: JSON.parse(localStorage.getItem("user")).email,

        question_distribution: {
          easy_percentage: complexityMix.easy,
          moderate_percentage: complexityMix.moderate,
          complex_percentage: complexityMix.complex,
        },
        question_type: testType,
        total_questions: questionCount,
      };

      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email;
      const payload = {
        email: email,
        exam_name: subject_name,
        total_questions: questionCount,
        exam_type: testType,
        complexity_distribution: {
          easy: parseInt(complexityMix.easy),
          moderate: parseInt(complexityMix.moderate),
          complex: parseInt(complexityMix.complex),
        },
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
        //console.log("jjj", data.exam_duration_in_seconds);
        testDetails.test_details.original_duration =
          data.exam_duration_in_seconds;

        setTestDetails(testDetails);
        sessionStorage.setItem("test_details", JSON.stringify(testDetails));
        localStorage.setItem("test_status", "ongoing");
        sessionStorage.setItem("is_original_test_tab", true);
        // //console.log("jdkjkfjdkjk")
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
        await enterFullScreen();
        setTimeout(() => {
          setLoading(false); // After 2 seconds, set loading to false to show the content
          navigate(
            `/questions?exam_name=${subject_name}&total_questions=${questionCount}&test_id=${
              data.allocation_id
            }&test_name=${encodeURIComponent(data.test_name)}&t=${subject_type}`
          );
        }, 2000);
      } else {
        // alert(`${data.error}`);
      }
    } else {
      // alert("Please sum up the value of percentage");
      setIsOTPPopupVisible(true);
    }
  };

  //for getting the subtopic of the subject this function is being called
  // const get_sub_topic = async () => {
  //   try {
  //     const response = await fetch(`${SERVER_URL}/subject/${subject_name}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     setSubtopices(data["subtopics"]);
  //   } catch (error) {
  //     console.error("Error fetching subtopics:", error);
  //   }
  // };

  const filteredSubtopics = subtopices.filter((topic) =>
    topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectChange = (topic) => {
    setSelectedSubtopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      setSearchQuery("");
    }
  };

  //this function for dynamic complexity mix
  // const handleComplexityChange = (level, value) => {
  //   const newMix = {
  //     ...complexityMix,
  //     [level]: value === "" ? "" : parseInt(value, 10) || 0,
  //   };
  //   setComplexityMix(newMix);
  // };
  const handleComplexityChange = (level, value) => {
    if (/^\d*$/.test(value)) {
      const newMix = {
        ...complexityMix,
        // [level]: value === "" ? "" : parseInt(value, 10) || 0,
        [level]: value,
      };
      setComplexityMix(newMix);
    }
  };

  //this function for the question count
  const handleQuestionCountChange = (value) => {
    const minCount = testType === "mcq" ? 20 : 5;
    const maxCount = testType === "mcq" ? 30 : 10;

    if (value >= minCount && value <= maxCount) {
      setQuestionCount(value);
    }
  };
  const handleClosePopup = () => {
    setIsOTPPopupVisible(false);
  };

  async function sendNotification() {
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
        exam_name: subject_name,
        exam_type: "SAQ",
        reason_for_notify: `I would like to be notified when the Descriptive Exam for ${subject_name} is live.`,
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

      //console.log("Notification sent successfully:", result);
      // showToast("Something went Wrong","failure")
      showToast(`Thanks for your interest! You'll be notified as soon as the ${subject_name} descriptive assessment launches.`);
      // alert("Notification added successfully!");
      return result;
    } catch (error) {
      showToast("Something went Wrong", "error");

      return null; // Return null in case of failure
    }
  }

  return (
    <>
      <Toastify />
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
            {/* Back Button */}
            <div
              className={classes["back-button"]}
              onClick={() => navigate(-1)}
            >
              <img src={backIcon} alt="Back" className={classes["back-icon"]} />
            </div>
            <div className={classes["mcq-container"]}>
              <div className={classes["heading-container"]}>
                <div className={classes["heading"]}>
                  <p className={classes["heading-p"]}>
                    {subject_name} Skill Assessment
                  </p>
                </div>
              </div>
              {/* <hr className={classes["hr"]} /> */}

              <div className={classes["tab-heading"]}>
                <p className={classes["sub-heading-p"]}></p>
              </div>

              <div className={classes["tabs"]}>
                <p
                  className={`${classes["test-tab"]} ${
                    testType === "mcq" ? classes["active-tab"] : ""
                  }`}
                  onClick={() => {
                    setTestType("mcq");
                    setQuestionCount(20);
                  }}
                >
                  MCQ
                </p>

                <p
                  className={`${classes["test-tab"]} ${
                    testType === "DESCRIPTIVE" ? classes["active-tab"] : ""
                  }`}
                  onClick={() => {
                    setTestType("DESCRIPTIVE");
                    setQuestionCount(5);
                  }}
                >
                  DESCRIPTIVE
                </p>
              </div>

              {testType === "mcq" ? (
                <div className={classes["test-setup"]}>
                  {/* this part has to be open */}
                  {/* <div className={classes["dropdown-wrapper"]} ref={dropdownRef}>
                  <label className={classes["label"]}>Subtopic </label>
                  <label className={classes["label-p"]}>
                    You can choose specific sub-topic(s)
                  </label>
                  <div className={classes["dropdown"]} onClick={toggleDropdown}>
                    <div className={classes["selected-value"]}>
                      {selectedSubtopics.length > 0
                        ? selectedSubtopics.join(", ")
                        : "All"}
                    </div>
                    <span className={classes["dropdown-arrow"]}>
                      {isDropdownOpen ? "▲" : "▼"}
                    </span>
                    {isDropdownOpen && (
                      <div
                        className={classes["dropdown-menu"]}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ul className={classes["dropdown-list"]}>
                          {filteredSubtopics.map((topic, index) => (
                            <li
                              key={index}
                              className={`${classes["dropdown-item"]} ${
                                selectedSubtopics.includes(topic)
                                  ? classes["selected"]
                                  : ""
                              }`}
                              onClick={() => handleSelectChange(topic)}
                            >
                              <div>{topic}</div>
                              <div>
                                <input
                                  className={classes["checkbox"]}
                                  type="checkbox"
                                  checked={selectedSubtopics.includes(topic)}
                                  readOnly
                                />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div> */}

                  <div className={classes["field2"]}>
                    <label className={classes["label"]}>Complexity </label>
                    <label className={classes["label-p"]}>
                      <p className={classes["label-text"]}>
                        Customize your challenge , decide the mix Total sum of
                        the percentages should be 100
                      </p>
                    </label>
                    {Object.keys(complexityMix).map((level) => (
                      <div key={level} className={classes["complexity-field"]}>
                        <div className={classes["icon-complexity"]}>
                          {level === "easy" ? (
                            <img src={basicIcon} alt="" />
                          ) : level === "moderate" ? (
                            <img src={intermediateIcon} alt="" />
                          ) : (
                            <img src={complexIcon} alt="" />
                          )}
                          <label className={classes["complexity-label"]}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </label>
                        </div>
                        <div className={classes["complexity-inp"]}>
                          <div>
                            <input
                              className={classes["complexity-input"]}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={complexityMix[level] || ""}
                              onChange={(e) =>
                                handleComplexityChange(level, e.target.value)
                              }
                              style={{ width: "40px", textAlign: "center" }}
                            />
                          </div>
                          {/* <div>
                          <label>%</label>
                        </div> */}
                        </div>
                      </div>
                    ))}
                    {error && (
                      <div className={classes["error-message"]}>
                        <p style={{ color: "red" }}>
                          The total percentage must be equal to 100.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className={classes["field3"]}>
                    <div className={classes["f3-heading"]}>
                      <label className={classes["label"]}>
                        Number of questions{" "}
                      </label>
                      <div className={classes["f3-inp"]}>
                        {/* this part has to be open */}
                        {/* <button
                        className={classes["f3-btn"]}
                        onClick={() =>
                          handleQuestionCountChange(questionCount - 1)
                        }
                        disabled={
                          questionCount <= (testType === "mcq" ? 10 : 5)
                        }
                      >
                        -
                      </button> */}
                        <input
                          className={classes["f3-inp-btn"]}
                          type="number"
                          value={questionCount}
                          onChange={(e) =>
                            handleQuestionCountChange(
                              parseInt(e.target.value.replace(/[^0-9]/g, "")) ||
                                10
                            )
                          }
                          style={{ width: "40px", textAlign: "center" }}
                        />
                        {/* this part has to be open */}
                        {/* <button
                        className={classes["f3-btn"]}
                        onClick={() =>
                          handleQuestionCountChange(questionCount + 1)
                        }
                        disabled={
                          questionCount >= (testType === "mcq" ? 20 : 10)
                        }
                      >
                        +
                      </button> */}
                      </div>
                    </div>
                    <label className={classes["label-p"]}>
                      <p className={classes["label-text"]}>
                        Set your pace: Choose 5 to 20 questions to challenge
                        yourself!
                      </p>
                    </label>
                  </div>

                  <div className={classes["time-section"]}>
                    <div className={classes["f3-heading"]}>
                      {" "}
                      <label className={classes["label"]}>
                        Total time for the test{" "}
                      </label>
                    </div>
                    <div className={classes["time-section-p"]}>
                      <label className={classes["label-p"]}>
                        <p className={classes["label-text"]}>
                          Total time for the test is auto calculated based on
                          the number of questions and complexity of the
                          questions
                        </p>
                      </label>
                      <p>
                        {Math.floor(totalTime / 60)} min {totalTime % 60} sec
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <img src={comingSoonIcon} alt="" />
                </div>
              )}
              {testType === "mcq" ? (
                <div className={classes["test-start"]}>
                  <button
                    className={classes["test-start-btn"]}
                    onClick={startTest}
                    disabled={loading}
                  >
                    Start Test
                  </button>
                </div>
              ) : (
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
              )}
            </div>

            <footer className={classes["mcq-setup-footer"]}>
              <img
                src={SETU_logo}
                className={classes["footer-setu-icon"]}
                alt=""
              />

              <p className={classes["email"]}>Email : mitra@setuschool.com</p>
              <br />
              <p className={classes["email"]}>Phone & Whatsapp: 8100551189</p>
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
            {isOTPPopupVisible && (
              <div className={classes["overlay"]}>
                <div className={classes["submit-popup"]}>
                  <div>
                    <img src={gifIcon} alt="" />
                  </div>
                  <div className={classes["limit"]}>
                    {/* <img src={gifIcon} alt="" /> */}
                    <p>The complexities should sum upto 100</p>
                  </div>

                  <div className={classes["popup-actions"]}>
                    <button
                      className={classes["cancel-button"]}
                      onClick={handleClosePopup}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MCQTestSetup;
