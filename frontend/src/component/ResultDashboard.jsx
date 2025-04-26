import React, { useEffect, useState, useContext, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ShareButtons from "../component/ShareButtons"; // Ensure correct path
import GaugeChart from "react-gauge-chart";
import classes from "./ResultDashboard.module.css";
import { QuestionContext } from "../context/QuestionContext";
import { SERVER_URL } from "../index.js";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import { useUserActivity } from "../context/UserActivityContext";
import SETU_logo from "../assets/setu-logo-web-footer.svg";
import gifIcon from "../assets/warning.gif";
import setuShortIcon from "../assets/setu-logo-short.svg";
import menuIcon from "../assets/menu.svg";
import shareIcon from "../assets/share.svg";
import qrCodeIcon from "../assets/qr-code.svg";
import downloadIcon from "../assets/download.svg";
import backIcon from "../assets/backIcon.svg";
import img_1 from "../assets/img_1.svg"; //total correct ans img
import img_2 from "../assets/img_2.svg";
import img_3 from "../assets/img_3.svg";
import img_4 from "../assets/img_4.svg";
import profile from "../assets/profile.svg";

const ResultDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const qrRef = useRef();
  const { test_Id } = useParams();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [score, setScore] = useState(0); //10.0
  const [streckPoint, setStreckPoint] = useState(0);
  const [totalCorrectQuestions, setTotalCorrectQuestions] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timePerquestions, setTimePerquestions] = useState(0);
  const [totalTimetakenForExam, setTotalTimetakenForExam] = useState("0 sec");
  const [showPopup, setShowPopup] = useState(false);
  const [PopUpMessage, setPopupMessage] = useState("");
  const [isLoading, setIsLoding] = useState(true);
  const [activeButton, setActiveButton] = useState("home");
  const [detailsAnalysisPage, setDetailsAnalysisPage] = useState(false);
  const [restultEmail, setResultEmail] = useState(null);
  const [resultSubject, setResultSubject] = useState(null);
  const [obtainedMarks, setObtainedMarks] = useState(null);
  const [totalMarks, setTotalMarks] = useState(null);
  const [userName, setUserName] = useState(null);
  const { logActivity, activityHistory, clearActivity } = useUserActivity();
  const title = "I Took a Quiz – Here’s How I Did! 😊";
  const text = "Hey, check this out!";
  const shareUrl = `${window.location.origin}/result/${test_Id}`;

  useEffect(() => {
    logActivity({
      event: "view_page",
      activity: "user reached to the result page",
      source_page: `${location.pathname}`,
      event_timeline: new Date().toLocaleString(),
    });

    if (localStorage.getItem("user")) {
      fetchTestResult(test_Id);
    } else {
      navigate("/login");
    }
  }, []); //this one for the  fetch result calling function

  const fetchTestResult = async (testId) => {
    try {
      const response = await fetch(
        `${SERVER_URL}/get-summary-submission/${testId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        switch (response.status) {
          case 404:
            setPopupMessage("Submission not found!");
            break;
          case 400:
            setPopupMessage("Invalid request. Please check the ID.");
            break;
          case 500:
            setPopupMessage("Server error. Please try again later.");
            break;
          default:
            setPopupMessage("Oops! Something went wrong.");
        }
        setShowPopup(true);
        return; // Stop further execution if there is an error
      }

      if (!data || data.status !== "success" || !data.submission) {
        setPopupMessage("Invalid data received from server.");
        setShowPopup(true);
        return;
      }

      const submission = data.submission || {};

      setScore(parseFloat(submission.obtained_percentage) || 0);
      setStreckPoint(submission.best_streak || 0);
      setTotalCorrectQuestions(submission.total_number_of_correct_answer || 0);
      setTotalQuestions(submission.total_number_of_question || 0);
      setTimePerquestions(submission.average_time_taken || "N/A");
      setTotalTimetakenForExam(submission.total_time_taken || "N/A");
      setDetailsAnalysisPage(data.has_detailed_result || false);
      setResultEmail(data.user_email || "N/A");
      setUserName(data.user_name || "N/A");
      setResultSubject(data.exam_name || "N/A");
      setObtainedMarks(submission.obtained_marks||"0");
      setTotalMarks(submission.total_marks||"0");

      logActivity({
        event: "result_view",
        activity: "User viewed the result properly",
        source_page: `${location.pathname}`,
        event_timeline: new Date().toLocaleString(),
      });
    } catch (err) {
      setPopupMessage("Network error. Please check your connection.");
      setShowPopup(true);
    } finally {
      setIsLoding(false);
    }
  };

  const handleExploreDetails = () => {
    navigate(`/detailed-assessment/${test_Id}`);
  };

  const onClose = () => {
    setShowPopup(false);
    navigate("/");
  };

  const homeNavigation = () => {
    navigate("/");
  };

  const handleButtonClick = async (button) => {
    setActiveButton(button);
    if (button === "logout") {
      const response = await fetch(`${SERVER_URL}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const logHistory = logActivity({
        event: `log_out`,
        activity: `Logged Out from Results Page`,
        message: "User ended their session from results page",
        date_time: new Date().toLocaleString(),
      });
      const email = JSON.parse(localStorage.getItem("user")).email;
      // userLogTag(email, logHistory, "success");
      localStorage.removeItem("user"); // when logout button click then
      navigate("/login");
    } else {
      navigate("/");
    }
    // Set the active button
  };

  const downloadQRCode = () => {
    const canvas = document.createElement("canvas");
    const size = 600; // High resolution for PDF
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    // Generate a new QR code image
    const qrCanvas = qrRef.current.querySelector("canvas");
    if (!qrCanvas) {
      console.error("QR Code canvas not found!");
      return;
    }

    // Draw the existing QR code onto a larger canvas
    ctx.fillStyle = "#FFFFFF"; // White background
    ctx.fillRect(0, 0, size, size); // Fill entire canvas

    const img = new Image();
    img.src = qrCanvas.toDataURL("image/png");

    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size); // Draw image to new canvas

      // Convert to high-quality PNG
      const url = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = url;
      link.download = "quiz_qr_code.png";
      link.click();
    };
  };

  const generatePdfForKycResult = async () => {
    try {
      const element = document.getElementById("result-container");
      if (!element) {
        console.error("Element not found!");
        return;
      }

      let userEmail = "unknown_user";
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user?.email) {
          userEmail = user.email;
        }
      } catch (error) {
        console.error("Error fetching user email from localStorage:", error);
      }

      // Find the last meaningful content to reduce bottom white space
      let lastChild = element.lastElementChild;
      while (lastChild && lastChild.offsetHeight === 0) {
        lastChild = lastChild.previousElementSibling;
      }

      // Calculate the content's actual height
      const contentHeight = lastChild?.offsetTop + lastChild?.offsetHeight;

      // Capture only the meaningful part
      const canvas = await html2canvas(element, {
        scale: 3, // Higher quality
        useCORS: true,
        scrollY: -window.scrollY, // Capture without scrolling issues
        height: contentHeight, // Trim bottom white space
      });

      const imgData = canvas.toDataURL("image/png");

      // Set up PDF dimensions (match content width)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a3", // Keeps width consistent
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth * 0.95; // Keep full width
      let imgHeight = (canvas.height * imgWidth) / canvas.width; // Scale proportionally

      // Auto-trim page height based on content height
      const dynamicPageHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.internal.pageSize.height = dynamicPageHeight; // Dynamically set height

      pdf.addImage(imgData, "PNG", 5, 5, imgWidth, imgHeight); // Keeps content centered

      // Add "Setu" watermark at the start of the element
      pdf.setFontSize(16);
      pdf.setTextColor(150, 150, 150, 0.1); // Light gray, semi-transparent
      pdf.setFont("helvetica", "bold");

      pdf.text(
        "© 2025 SETU. All Rights Reserved.",
        pdf.internal.pageSize.getWidth() / 2,
        pdf.internal.pageSize.getHeight() - 10,
        { angle: 0, align: "center", baseline: "top" }
      ); // Add watermark at the top

      pdf.save(`KYC_Competency_Report_${userEmail}.pdf`);

      logActivity({
        event: "result_download",
        status: "successful",
        source_page: location.pathname,
        event_timeline: new Date().toISOString(),
      });
    } catch (error) {
      console.error("PDF Generation Failed:", error);

      logActivity({
        event: "result_download",
        status: "failed",
        source_page: location.pathname,
        event_timeline: new Date().toISOString(),
      });
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

  return (
    <>
      <div className={classes.container} id="main-result">
        {isLoading ? (
          <>
            <div className={classes["animated-container"]}>
              <div className={classes["success-message"]}>
                <p>Analyzing your results</p>
              </div>
              <div className={classes["analyzing-container"]}>
                <div className={classes["analyzing-inner"]}>
                  <div className={classes["analyzing-progress"]}></div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={classes["result-container"]}>
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
                    src={profile}
                    alt=""
                    onClick={() => navigate("/completeprofile")}
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

              <div className={classes["download-pdf"]} id="result-container">
                <div className={classes["heading-container"]}>
                  <div className={classes["result-heading"]}>
                    <p className={classes.title}>Your KYC Scoreboard</p>
                    <p className={classes.subtitle}>
                      KYC = Know Your Competency
                    </p>
                  </div>
                  <div className={classes["heading-btn"]}>
                    <button
                      className={classes.iconButton}
                      onClick={() => setShareModalOpen(true)}
                    >
                      <img src={shareIcon} alt="" />
                    </button>
                    <button
                      className={classes.iconButton}
                      onClick={generatePdfForKycResult}
                    >
                      <img
                        src={downloadIcon}
                        alt="Download icon"
                        className={classes.icon}
                      />
                    </button>
                    <button
                      className={classes.iconButton}
                      onClick={downloadQRCode}
                    >
                      <img
                        src={qrCodeIcon}
                        alt="QR icon"
                        className={classes.icon}
                      />
                    </button>
                  </div>
                </div>

                <div className={classes.information}>
                  <div className={classes.name}>
                    <p>Name : {userName}</p>
                  </div>
                  <div className={classes.email}>
                    <p>Email ID : {restultEmail}</p>
                  </div>
                  <div className={classes.assessment}>
                    <p>Assessment : {resultSubject}</p>
                  </div>
                </div>

                <div className={classes.gaugeContainer}>
                  <GaugeChart
                    id="gauge-chart3"
                    nrOfLevels={5}
                    colors={[
                      "#FF5656",
                      "#FEE114",
                      "#D1D80F",
                      "#84BD32",
                      "#30AD43",
                    ]}
                    arcWidth={0.2}
                    percent={score / 100}
                    arcsLength={[0.2, 0.2, 0.2, 0.2, 0.2]}
                    textColor="white"
                    style={{ width: "300px", height: "200px" }}
                    hideText={true}
                    needleColor="#FFFFFF"
                    needleBaseColor="#FFFFFF 2px solid black"
                    needleHeightRatio={1}
                  />

                  <div className={classes.currentValueWrapper}>
                    <span
                      className={classes.currentValueText}
                    >{`${score.toFixed(0)}%`}</span>
                  </div>

                  <div className={classes.labels}>
                    <div className={`${classes.label} ${classes.seeker}`}>
                      Seeker
                    </div>
                    <div className={`${classes.label} ${classes.learner}`}>
                      Learner
                    </div>
                    <div className={`${classes.label} ${classes.proficient}`}>
                      Proficient
                    </div>
                    <div className={`${classes.label} ${classes.achiever}`}>
                      Achiever
                    </div>
                    <div className={`${classes.label} ${classes.champion}`}>
                      Champion
                    </div>
                  </div>
                </div>

                <div className={classes["kyc-highlights1"]}>
                  <div className={classes["highlights-heading"]}>
                    <p>Highlights</p>
                  </div>
                  <div className={classes["kyc-highlights"]}>
                    <div className={classes["highlight-item"]}>
                      <p>Total number of correct answers</p>
                      <div className={classes["highlight-itemp"]}>
                        <img
                          src={img_1}
                          alt="Total Correct Answers"
                          className={classes.icon}
                        />
                        <p>
                          {`${totalCorrectQuestions}`}/{`${totalQuestions}`}
                        </p>
                      </div>
                    </div>

                    <div className={classes["highlight-item"]}>
                      <p>You tackled {`${totalQuestions}`} questions within</p>
                      <div className={classes["highlight-itemp"]}>
                        <img
                          src={img_2}
                          alt="Questions Tackled"
                          className={classes.icon}
                        />
                        <p className={classes["time-text"]}>
                          {" "}
                          {`${totalTimetakenForExam}`}
                        </p>
                      </div>
                    </div>

                    <div className={classes["highlight-item1"]}>
                      <p>You solved one question every</p>
                      <div className={classes["highlight-itemp"]}>
                        <img
                          src={img_3}
                          alt="Time Per Question"
                          className={classes.icon}
                        />
                        <p>{`${timePerquestions}`}</p>
                      </div>
                    </div>

                    <div className={classes["highlight-item1"]}>
                      <p>Your best streak of correct answers</p>
                      <div className={classes["highlight-itemp"]}>
                        <img
                          src={img_4}
                          alt="Time Per Question"
                          className={classes.icon}
                        />
                        <p>{`${streckPoint}`}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {!detailsAnalysisPage ? (
                <>
                  <div className={classes["btn-bottom"]}>
                    <button
                      className={classes["retake-btn"]}
                      onClick={() => handleButtonClick("home")}
                    >
                      Take another test
                    </button>
                    {score < 60 ? (
                      <button className={classes["start-btn"]} onClick={()=>navigate("/")}>
                        Learn the Concepts
                      </button>
                    ) : (
                      <button className={classes["start-btn"]} onClick={()=>navigate("/project-coming-soon")}>
                        Start a Project
                      </button>
                    )}
                  </div>

                  <hr className={classes["bottom-part-hr"]} />
                </>
              ) : (
                <></>
              )}

              <div className={classes["share-qrCode-download"]}>
                <div
                  className={classes["bottom-part"]}
                  onClick={() => setShareModalOpen(true)}
                >
                  <img src={shareIcon} alt="Share" />
                  <p>Get a link to share</p>
                </div>

                <div ref={qrRef}>
                  <div
                    className={classes["bottom-part"]}
                    onClick={downloadQRCode}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={qrCodeIcon} alt="QR Code Icon" />
                    <p>Add a QR code to your resume</p>
                  </div>

                  <QRCodeCanvas
                    value={shareUrl}
                    size={200}
                    style={{ display: "none" }}
                  />
                </div>
                <div
                  className={classes["download-part"]}
                  onClick={generatePdfForKycResult}
                >
                  <img src={downloadIcon} alt="" />

                  <p>Download in PDF format</p>
                </div>
              </div>

              {detailsAnalysisPage ? (
                <div className={classes["button-container"]}>
                  <button
                    className={classes.exploreButton}
                    onClick={handleExploreDetails}
                  >
                    Explore Detailed Assessment
                  </button>
                </div>
              ) : (
                <></>
              )}

              <footer className={classes["result-dashboard-footer"]}>
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
                  <li onClick={termsAndConditionsRedirect}>
                    Terms & Conditions
                  </li>
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
                    <p onClick={termsAndConditionsRedirect}>
                      Terms & Conditions
                    </p>
                    <p onClick={returnAndRefundPolicyRedirect}>
                      Return & Refund Policy
                    </p>
                  </div>
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

            <p className={classes["main-q"]}>{PopUpMessage}</p>
            <div className={classes["popup-actions"]}>
              <button className={classes["cancel-button"]} onClick={onClose}>
                close
              </button>
            </div>
          </div>
        </div>
      )}
      {shareModalOpen && (
        <ShareButtons
          assessmentname={resultSubject}
          totalMarks={totalMarks}
          obtainedMarks={obtainedMarks}
          url={shareUrl}
          title={title}
          text={text}
          onClose={() => setShareModalOpen(false)}
        />
      )}
    </>
  );
};

export default ResultDashboard;
