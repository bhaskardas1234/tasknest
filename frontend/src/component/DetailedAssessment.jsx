import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SERVER_URL } from "../index.js";
import classes from "./DetailedAssessment.module.css";
import { QRCodeCanvas } from "qrcode.react";
import ProgressBar from "./ProgressBar";
import SubCompetency from "./SubCompetency";
import ShareButtons from "../component/ShareButtons"; // Ensure correct path
import ReactApexChart from "react-apexcharts";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import loader from "../assets/details-loder.gif";
import gifIcon from "../assets/warning.gif";
import shareIcon from "../assets/share.svg";
import qrCodeIcon from "../assets/qr-code.svg";
import downloadIcon from "../assets/download.svg";
import setuShortIcon from "../assets/setu-logo-short.svg";
import menuIcon from "../assets/menu.svg";
import profileIcon from "../assets/profile.svg";
import profile from "../assets/profile.svg";
import SETU_logo from "../assets/setu-logo-web-footer.svg";
import Statistical_Acumen from "../assets/Statistical Acumen.svg";
import BI_Visualisation from "../assets/BI & Visualisation.svg";
import Insiting from "../assets/insiting.svg";
import Data_Wrangling from "../assets/Data Wrangling.svg";
import batchIcon from "../assets/batch.svg";
import customerExcellenceIcon from "../assets/customer-excellence.svg";
import innovationIcon from "../assets/innovation-and-growth.svg";
import problemSolvingIcon from "../assets/problem-solving.svg";
import productLeadershipIcon from "../assets/product-leadership.svg";
import strategicBusinessAcumenIcon from "../assets/strategic-and-business-acumen.svg";
import technologyDataAIIcon from "../assets/tech-data-and-ai.svg";
import backIcon from "../assets/backIcon.svg";
import { Pointer } from "lucide-react";

const DetailedAssessment = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { test_Id } = useParams();
  const navigate = useNavigate();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(51);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [PopUpMessage, setPopupMessage] = useState("");
  const [topic, setTopic] = useState(null);
  const [totalcorrectanswers, setTotalcorrectanswers] = useState(0);
  const [totalquestions, setTotalquestions] = useState(0);
  const [assessmentname, setAssessmentname] = useState("");
  const [restultEmail, setResultEmail] = useState(null); // this one for the perticular email corresponding to the test id
  const [obtainedMarks, setObtainedMarks] = useState(null);
  const [name, setName] = useState(null);
  const [totalMarks, setTotalMarks] = useState(null);
  const shareUrl = `${window.location.origin}/detailed-assessment/${test_Id}`;
  const title = "I Took a Quiz – Here’s How I Did! 😊";
  const text = "Hey, check this out!";

  const [radarState, setRadarState] = useState({
    options: {
      chart: {
        type: "radar",
        toolbar: {
          show: false,
        },
      },
      fill: {
        opacity: 0.5,
        colors: ["#5C85FF"],
      },
      xaxis: {
        categories: [
          "Tech-Data-AI",
          ["Customer", "Excellence"],
          ["Innovation &", "growth"],
          ["Problem solving", "& Decision", "Making"],
          ["Product", "Leadership"],
          ["Strategic &", "Business Acumen"],
        ],
        labels: {
          style: {
            colors: ["rgba(242, 242, 242, 0.80)"],
            fontSize: "10px",
            fontWeight: "400",
            fontFamily: "Roboto",
            width: "20%",
          },
          offsetY: -4,
        },
      },
      yaxis: {
        tickAmount: 4,
        show: false,
        max: 100,
        min: 0,
        stepSize: 20,
        style: {
          colors: ["rgba(242, 242, 242, 0.80)"],
        },
      },
      markers: {
        size: 0,
      },
      stroke: {
        width: 2,
        colors: ["#2196f3"],
      },
      grid: {
        show: false,
        strokeArray: 4,
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColor: ["rgba(242, 242, 242, 0.80)"],
            fill: {
              colors: ["transparent"],
            },
          },
        },
      },
    },
    series: [
      {
        name: "Series 1",
        data: [20, 50, 30, 60, 40, 5],
      },
    ],
  });

  useEffect(() => {
    if (analysisData) {
      const competencies = Object.keys(analysisData.submission.capabilities);

      // Extract categories dynamically
      const newCategories = competencies.map((category) => category);

      // const Categories  = newCategories.map(str => str.split(" "));
      const Categories = newCategories.map((str) => {
        const parts = str.split(" ");
        return [parts[0], parts.slice(1).join(" ")]; // Keep first word separate, rest as a single string
      });

      // Extract correct percentage values
      const newUpdatedData = newCategories.map((category) => {
        const competency = analysisData.submission.capabilities[category];
        //console.log(competency, "thsi is the comptency");
        return competency["Percentage-Of-Correct-Answer"] || 0;
      });

      if (newUpdatedData.length > 0) {
        setRadarState((prevState) => ({
          ...prevState,
          options: {
            ...prevState.options,
            xaxis: { ...prevState.options.xaxis, categories: Categories },
          },
          series: [{ name: "Series 1", data: [...newUpdatedData] }],
        }));
      }
    }
  }, [analysisData]);

  useEffect(() => {
    fetchAnalysisData();
  }, [test_Id]);

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/");
      localStorage.removeItem("user");
    } else {
      setTimeout(() => {
        setLoading(false); // After 2 seconds, set loading to false to show the content
      }, 3000);
    }
  }, []);

  const getCategoryImage = (category) => {
    const categoryImages = {
      "Tech-Data-AI": technologyDataAIIcon,
      "Customer Excellence": customerExcellenceIcon,
      "Innovation & growth": innovationIcon,
      "Problem solving & Decision Making": problemSolvingIcon,
      "Product Leadership": productLeadershipIcon,
      "Strategic & Business Acumen": strategicBusinessAcumenIcon,
    };

    return categoryImages[category] || customerExcellenceIcon;
  };

  const getCompetencyAssets = (category) => {
    const categoryImages = {
      "Tech-Data-AI": {
        competencyLogo: technologyDataAIIcon,
        description:
          "Harnessing technology, data, and AI equips product leads to create intelligent, cutting-edge solutions for modern challenges",
      },
      "Customer Excellence": {
        competencyLogo: customerExcellenceIcon,
        description:
          "Building a customer-first approach helps product leads deliver exceptional experiences and foster loyalty.",
      },
      "Innovation & growth": {
        competencyLogo: innovationIcon,
        description:
          "Driving creativity and experimentation empowers product leads to unlock new opportunities and accelerate success.",
      },
      "Problem solving & Decision Making": {
        competencyLogo: problemSolvingIcon,
        description:
          "Tackling challenges with clarity and making impactful decisions ensures the product stays on course.",
      },
      "Product Leadership": {
        competencyLogo: productLeadershipIcon,
        description:
          "Inspiring teams and owning the product vision enables product leads to steer projects toward impactful outcomes.",
      },
      "Strategic & Business Acumen": {
        competencyLogo: strategicBusinessAcumenIcon,
        description:
          "Aligning product strategies with business goals ensures product leads drive sustainable growth and value.",
      },
    };

    return categoryImages[category] || customerExcellenceIcon;
  };
  const getCompetencyAssetsBusinessAnalytics = (category) => {
    const categoryImages = {
      "BI & Visualisation": {
        competencyLogo: BI_Visualisation,
        description: "Measures ability to present insights effectively.",
      },
      "Data Wrangling": {
        competencyLogo: Data_Wrangling,
        description:
          "Measures ability to handle raw data from databases/ datalakes.",
      },
      Insighting: {
        competencyLogo: Insiting,
        description:
          "Being able to derive right actionable insights from the Data and analysis.",
      },
      "Statistical Acumen": {
        competencyLogo: Statistical_Acumen,
        description:
          "Measures ability to extract insights & make data-driven decisions using Statistical know-how.",
      },
    };

    return categoryImages[category] || customerExcellenceIcon;
  };

  const getOverAllCompetencyColor = (overallStats) => {
    if (overallStats === "correct_percentage") {
      return "#00A851";
    } else if (overallStats === "partially_correct_percentage") {
      return "#FFC727";
    } else if (overallStats === "incorrect_percentage") {
      return "#E3401F";
    } else if (overallStats === "skipped_percentage") {
      return "#A2A0A0";
    }
  };

  const getCompetencyStatus = (percentage) => {
    if (percentage > 70) {
      return { text: "This is your strength", color: "#FFC727" };
    } else if (percentage >= 50) {
      return { text: "You Can Do Better", color: "#42BD7D" };
    } else {
      return { text: "This is your Blindspot", color: "#D44325" };
    }
  };

  const fetchAnalysisData = async () => {
    try {
      const response = await fetch(
        `${SERVER_URL}/get-detailed-submission/${test_Id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setPopupMessage(data.message || "Resource not found");
          setShowPopup(true);
        } else if (response.status === 400) {
          setPopupMessage(data.message || "Invalid request");
          setShowPopup(true);
        } else if (response.status === 500) {
          setPopupMessage(data.message || "Internal server error");
          setShowPopup(true);
        } else {
          setPopupMessage(data.message || "Unknown error occurred");
          setShowPopup(true);
        }
        return;
      }

      // Handle successful response
      if (response.status === 200) {
        setTopic(data.exam_name || "N/A");
        setResultEmail(data.user_email || "N/A");
        setName(data.user_name || "N/A");

        setAnalysisData(data);
        setTotalQuestions(
          (data.submission?.total_correct || 0) +
            (data.submission?.total_incorrect || 0) +
            (data.submission?.total_skipped || 0)
        );
        setAssessmentname(data.exam_name);
        setTotalquestions(data.submission?.total_questions);
        setTotalcorrectanswers(data.submission?.total_correct);
        setObtainedMarks(data.submission?.obtained_marks);
        setTotalMarks(data.submission?.total_marks);

        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching analysis data:", err);
      setPopupMessage("Network error or server is unreachable");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const response = await fetch(`${SERVER_URL}/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    localStorage.removeItem("user");
    navigate("/");
  };

  const home = () => {
    navigate("/");
  };
  const onClose = () => {
    setShowPopup(false);
    navigate("/");
  };
  const qrRef = useRef();

  const downloadQRCode = () => {
    const canvas = document.createElement("canvas");
    const size = 600; // High resolution for PDF
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    let userEmail = "unknown_user";
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user?.email) {
        userEmail = user.email;
      }
    } catch (error) {
      console.error("Error fetching user email from localStorage:", error);
    }

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
      link.download = `Detailed_Competency_Report${userEmail}qrcode.png`;
      link.click();
    };
  };

  const generatePDF = async () => {
    try {
      const element = document.getElementById("main-detailed-result");
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
        "© 2025 SETU QVERSE. All Rights Reserved.",
        pdf.internal.pageSize.getWidth() / 2,
        pdf.internal.pageSize.getHeight() - 10,
        { angle: 0, align: "center", baseline: "top" }
      ); // Add watermark at the top

      pdf.save(`Detailed_Competency_Report_${userEmail}.pdf`);
    } catch (error) {
      console.error("PDF Generation Failed:", error);
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
      <div className={classes["container"]}>
        {loading ? (
          <div className={classes["load-container"]}>
            <img src={loader} alt="Loading..." width="100" />
          </div>
        ) : (
          <>
            <div className={classes["details-container"]}>
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

              <div className={classes["detailed-assessment-heading-one"]}>
                {/* Back Button */}
                <div
                  className={classes["back-button"]}
                  onClick={() => navigate(-1)}
                >
                  <img
                    src={backIcon}
                    alt="Back"
                    className={classes["back-icon"]}
                  />
                </div>
                <div className={classes["detailed-assessment-heading"]}>
                  <p>Detailed Competency Assessment</p>

                  <div className={classes["heading-btn"]}>
                    <button
                      className={classes["shareButton"]}
                      onClick={() => setShareModalOpen(true)}
                    >
                      <img src={shareIcon} alt="" />
                    </button>

                    <button
                      className={classes.downloadButton}
                      onClick={generatePDF}
                    >
                      <img
                        src={downloadIcon}
                        alt="Download icon"
                        className={classes.icon}
                      />
                    </button>
                    <button
                      ref={qrRef}
                      className={classes.downloadButton}
                      onClick={downloadQRCode}
                    >
                      <img
                        src={qrCodeIcon}
                        alt="QR icon"
                        className={classes.icon}
                      />
                      <QRCodeCanvas
                        value={shareUrl}
                        size={200}
                        style={{ display: "none" }}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div
                className={classes["download-pdf"]}
                id="main-detailed-result"
              >
                <div className={classes.information}>
                  <div className={classes.name}>
                    <p>Name :{name}</p>
                  </div>
                  <div className={classes.email}>
                    <p>Email ID : {restultEmail}</p>
                  </div>
                  <div className={classes.assessment}>
                    <p>Assessment :{topic}</p>
                  </div>
                </div>
                {/* Performance section */}
                <div className={classes["perfomance-skills"]}>
                  <div className={classes["performance"]}>
                    <div className={classes["performance-heading"]}>
                      <div>
                        <p className={classes["heading-p"]}>Your Performance</p>
                      </div>

                      <p className={classes["desc"]}>
                        In this test, some of your answers are correct, some are
                        incorrect, and some are partially correct.
                      </p>
                    </div>

                    <hr className={classes["hr"]} />

                    <p className={classes["total-questions"]}>
                      Total {`${totalQuestions}`} questions
                    </p>

                    <div className={classes["progress-bars"]}>
                      {analysisData &&
                        (() => {
                          const defaultStats = {
                            correct_percentage: 0,
                            partially_correct_percentage: 0,
                            incorrect_percentage: 0,
                            skipped_percentage: 0,
                          };

                          const stats = {
                            ...defaultStats,
                            ...analysisData.submission,
                          };

                          return Object.entries(stats)
                            .filter(([key]) =>
                              [
                                "correct_percentage",
                                "partially_correct_percentage",
                                "incorrect_percentage",
                                "skipped_percentage",
                              ].includes(key)
                            )
                            .map(([key, value]) => {
                              const color = getOverAllCompetencyColor(key);
                              return (
                                <ProgressBar
                                  key={key}
                                  label={key
                                    .replace("percentage", "")
                                    .replace("", " ")}
                                  percentage={value.toFixed(2)}
                                  color={color}
                                />
                              );
                            });
                        })()}
                    </div>

                    <div className={classes["color-indication"]}>
                      <div className={classes["same-align"]}>
                        <p className={classes["condition"]}>Correct</p>
                        <p className={classes["correct-color"]}></p>
                      </div>
                      <div className={classes["same-align"]}>
                        <p className={classes["condition"]}>
                          Partially Correct
                        </p>
                        <p className={classes["partially-correct-color"]}></p>
                      </div>
                      <div className={classes["same-align"]}>
                        <p className={classes["condition"]}>Incorrect</p>
                        <p className={classes["incorrect-color"]}></p>
                      </div>
                      <div className={classes["same-align"]}>
                        <p className={classes["condition"]}>Skipped</p>
                        <p className={classes["skipped-color"]}></p>
                      </div>
                    </div>
                  </div>

                  {/* skills section */}
                  <div className={classes["skills"]}>
                    <div className={classes["performance-heading"]}>
                      <p className={classes["heading-p"]}>Your Skills</p>
                      <p className={classes["desc"]}>
                        This chart outlines your proficiency in each of the six
                        key skills needed to succeed in product management.
                      </p>
                    </div>

                    <hr className={classes["hr"]} />

                    <div className={classes["radar-chart"]}>
                      <ReactApexChart
                        options={radarState.options}
                        series={radarState.series}
                        type="radar"
                        height={300}
                      />
                    </div>
                  </div>
                </div>

                {/* capabilities section */}
                <div className={classes["capabilities"]}>
                  <div className={classes["performance-heading"]}>
                    <p className={classes["heading-p"]}>Your Capabilities</p>
                  </div>

                  <div className={classes["capabilities-cards"]}>
                    {analysisData &&
                      Object.keys(analysisData.submission.capabilities).map(
                        (competency) => {
                          const percentage =
                            analysisData.submission.capabilities[competency][
                              "Percentage-Of-Correct-Answer"
                            ].toFixed();

                          const { text, color } =
                            getCompetencyStatus(percentage);
                          const { competencyLogo, description } =
                            topic === "Product Lead / Manager"
                              ? getCompetencyAssets(competency)
                              : getCompetencyAssetsBusinessAnalytics(
                                  competency
                                );
                          return (
                            <div className={classes["card"]} key={competency}>
                              {percentage > 70 && (
                                <div className={classes["badge-icon"]}>
                                  <img src={batchIcon} alt="Badge" />
                                </div>
                              )}
                              <div className={classes["logo-part"]}>
                                <div className={classes["logo-left"]}>
                                  <img src={competencyLogo} alt={competency} />
                                </div>
                                <div className={classes["logo-right"]}>
                                  <p className={classes["head-name"]}>
                                    {competency}
                                  </p>
                                  <p className={classes["percentage"]}>
                                    {percentage} %
                                  </p>
                                  <input
                                    type="range"
                                    className={classes["input-range"]}
                                    min="0"
                                    max="100"
                                    value={percentage}
                                    style={{
                                      background: `linear-gradient(to right, #FFC727 ${percentage}%, #505050 ${percentage}%)`,
                                    }}
                                  />
                                  <p
                                    className={classes["competency-status"]}
                                    style={{ color }}
                                  >
                                    {text}
                                  </p>
                                </div>
                              </div>
                              <p className={classes["desc"]}>{description}</p>
                              <p className={classes["sub-competency"]}>
                                Sub-competency Analysis
                              </p>

                              <div className={classes["chart"]}>
                                {analysisData &&
                                  Object.keys(
                                    analysisData.submission.capabilities[
                                      competency
                                    ]["Sub-Competencies"]
                                  ).map((subcompetency, index) => {
                                    const subcompetency_percentage =
                                      analysisData.submission.capabilities[
                                        competency
                                      ]["Sub-Competencies"][subcompetency][
                                        "Percentage-Of-Correct-Answer"
                                      ].toFixed();

                                    const color =
                                      subcompetency_percentage > 70
                                        ? "#77C72B"
                                        : subcompetency_percentage >= 50
                                        ? "#5C85FF"
                                        : "#E3401F";

                                    return (
                                      <SubCompetency
                                        key={index}
                                        label={""}
                                        percentage={subcompetency_percentage}
                                        color={color}
                                        topic={subcompetency}
                                      />
                                    );
                                  })}
                              </div>

                              <hr className={classes["hr"]} />

                              <div className={classes["color-identification"]}>
                                <div className={classes["status"]}>
                                  <p className={classes["status-p"]}>
                                    Strength
                                  </p>
                                  <p
                                    className={
                                      classes["competency-color-strength"]
                                    }
                                  ></p>
                                </div>
                                <div className={classes["status"]}>
                                  <p className={classes["status-p"]}>
                                    Can do better
                                  </p>
                                  <p
                                    className={
                                      classes["competency-color-can-do-better"]
                                    }
                                  ></p>
                                </div>
                                <div className={classes["status"]}>
                                  <p className={classes["status-p"]}>
                                    Blindspot
                                  </p>
                                  <p
                                    className={
                                      classes["competency-color-blindspot"]
                                    }
                                  ></p>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                  </div>
                </div>
              </div>
              <div className={classes["btn-bottom"]}>
                <button className={classes["retake-btn"]} onClick={home}>
                  Take another test
                </button>
                <button className={classes["start-btn"]} onClick={()=>navigate("/project-coming-soon")}>
                  Start a Project
                </button>
              </div>
            </div>

            <footer className={classes["detailed-assessment-footer"]}>
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
          totalMarks={totalMarks}
          obtainedMarks={obtainedMarks}
          assessmentname={assessmentname}
          url={shareUrl}
          title={title}
          text={text}
          onClose={() => setShareModalOpen(false)}
        />
      )}
    </>
  );
};

export default DetailedAssessment;
