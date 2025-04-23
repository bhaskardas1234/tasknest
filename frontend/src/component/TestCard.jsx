import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./TestCard.module.css";
import { SERVER_URL } from "../index.js";
import pragyan_logo from "../assets/mentor-landing-page.svg";
import profile from "../assets/profile.svg";
import footerSetuIcon from "../assets/setu-logo-web-footer.svg";
import youtube_icons from "../assets/youtube_icons.png";
import rectangle from "../assets/rectangle.svg";
import menu from "../assets/menu.svg";
import setuShortIcon from "../assets/setu-logo-short.svg";
import gifIcon from "../assets/warning.gif";
import loader from "../assets/details-loder.gif";
import Toastify, { showToast } from "./Toastify"; // Import Toastify and showToast

// DAP topics
const dap_topics = [
  {
    name: "Large Language Modeling (LLM)",

    link: "https://setuschool.com/course/46/PGD_Data_Science_AI",
  },
  { name: "Build GenAI Apps - No Code, Just Prompts" },
  { name: "Agentic AI - Build Autonomous Solutions" },
  { name: "Generative Business Intelligence (GenBI)" },
  { name: "MLOPs & LLMOPs" },
  { name: "Career Transition" },
  { name: "Data Strategy for Senior Professionals" },
  { name: "Supervised Learning (ML)" },
  { name: "Unsupervised Learning (ML)" },
  { name: "Data Engineering with AWS" },
  { name: "Data Engineering with Azure" },
  { name: "Data Engineering with Snowflake" },
  { name: "Python for Data Science" },
  { name: "PowerBI & Power Automate" },
  { name: "Managing Semi-structured Data with NoSQL" },
  { name: "RDBMS & SQL (PostgreSQL)" },
  { name: "Mathematics behind Machine Learning" },
  { name: "EDA with Applied Statistics" },
  { name: "Time-series Forecasting" },
  { name: "Tableau Fundamentals" },
  { name: "Excel with Excel" },
];

const topic2 = [
  { name: "Analytical Projects" },
  { name: "Machine Learning Projects" },
  { name: "AI/ Projects Gen AI" },
  { name: "Data Engineering Projects" },
];

const topic3 = [
  {
    name: "Data Engineering Blogs",
    link: "https://setuschool.com/all/blogs?searchTerm=&category%5B%5D=13&category%5B%5D=17",

    description:
      "Explore expert insights ETL, data lakes, cloud migration, serverless computing, and real- time processing to master practical Data & Cloud Engineering challenges.",
  },
  {
    name: "Data Science Blogs",
    link: "https://setuschool.com/all/blogs",
    description:
      "Explore industry insights on machine learning, deep learning, feature engineering, model deployment, and data storytelling to solve real- world Data Science challenges.",
  },
  {
    name: "NLP-LLM Blogs",
    link: "https://setuschool.com/all/blogs",
    description:
      "Explore practical guidance on text analytics, transformers, embeddings, prompt engineering, and fine-tuning LLMs to build powerful NLP and Generative AI solutions.",
  },
  {
    name: "AI-GenAI Blogs",
    link: "https://setuschool.com/all/blogs",
    description:
      "Lorem ipsum dolor sit amet consectetur. Nisl ac pellentesque mattis tellus lectus sit nibh tellus. Nulla lobortis integer magna sed.",
  },
  {
    name: "Career Transition",
    link: "https://setuschool.com/all/blogs",
    description:
      "Navigate expert insights on upskilling, industry trends, hands-on projects, mentorship, and networking to accelerate your career transition into high- growth roles.",
  },
  {
    name: "Leadership in the AI Era",
    link: "https://setuschool.com/all/blogs",
    description:
      "Aspiring CDAOs? Explore Data & AI strategy, decision intelligence, AI-GenAI at scale, and ethical AI to lead with impact in the AI era.",
  },
];

// Function to divide topics into slides (3 slides max)
const splitIntoSlides = (arr, maxSlides) => {
  const numSlides = Math.min(maxSlides, Math.ceil(arr.length / 3));
  return Array.from({ length: numSlides }, (_, i) =>
    arr.slice(
      i * Math.ceil(arr.length / numSlides),
      (i + 1) * Math.ceil(arr.length / numSlides)
    )
  );
};
const splitIntoSlides4 = (arr, maxSlides) => {
  const numSlides = Math.min(maxSlides, Math.ceil(arr.length / 4));
  return Array.from({ length: numSlides }, (_, i) =>
    arr.slice(
      i * Math.ceil(arr.length / numSlides),
      (i + 1) * Math.ceil(arr.length / numSlides)
    )
  );
};

const TestCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [courseClicked, setCourseClicked] = useState(null);
  const [skillBased, setSkillBased] = useState([]);
  const [profileBased, setProfileBased] = useState([]);
  const [examLimitDetails, setExamLimitDetails] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [notify, setNotify] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle menu visibility
  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    localStorage.removeItem("test_status");
    sessionStorage.clear();

    try {
      get_course_info(); //get all profile based and skill based course info
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
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getExamLimit();
      fetchNotifications();
    }
  }, [isLoggedIn]);
  const get_course_info = async () => {
    try {
      //console.log("Fetching all exam details...");

      const response = await fetch(`${SERVER_URL}/exam-details`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to fetch exams");
      }

      const skillBased = [];
      const profileBased = [];

      responseData.exams.forEach((exam) => {
        if (exam.exam_category === "Skill Based") {
          skillBased.push(exam);
        } else if (exam.exam_category === "Profile Based") {
          profileBased.push(exam);
        }
      });

      // Sorting based on "exam_status" (Active exams first)
      setSkillBased(
        skillBased.sort(
          (a, b) => (b.exam_status === "Active") - (a.exam_status === "Active")
        )
      );
      setProfileBased(
        profileBased.sort(
          (a, b) => (b.exam_status === "Active") - (a.exam_status === "Active")
        )
      );
      //console.log(profileBased);

      setSubjects(responseData.exams);
      setLoading(false); // Update loading state
    } catch (error) {
      console.error("Error fetching exam details:", error.message);
    }
  };
  async function getExamLimit() {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;

    if (!email) {
      throw new Error("User email not found in local storage.");
    }

    try {
      const response = await fetch(`${SERVER_URL}/user-results/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch user results");
      }

      setExamLimitDetails(result.results);
    } catch (error) {
      console.error("Error fetching user results:", error.message);

      return null; // Returns null in case of failure
    }
  }
  const skillBasedCourseClick = (course) => {
    if (isLoggedIn) {
      setCourseClicked(course);
      if (course.exam_status === "Active") {
        //console.log(course.exam_name);
        //console.log(examLimitDetails);
        const foundExam = examLimitDetails.find(
          (exam) => exam.exam_name === course.exam_name && exam.final_appearance
        );
        if (foundExam) {
          setShowPopup(true);
        } else {
          navigate(`/exam-guide?&exam_name=${course.exam_name}`);
        }
      } else {
        navigate(`/noaccess/${encodeURIComponent(course.exam_name)}`, {
          state: { focusedId: "course-name" },
        });
      }
    } else {
      navigate("/login", {
        state: {
          from: `/exam-guide?exam_name=${encodeURIComponent(course.exam_name)}`,
        },
      });
    }
  };

  const profileBasedCourseClick = (course) => {
    if (isLoggedIn) {
      setCourseClicked(course);
      if (course.exam_status === "Active") {
        const foundExam = examLimitDetails.find(
          (exam) => exam.exam_name === course.exam_name && exam.final_appearance
        );
        if (foundExam) {
          setShowPopup(true);
        } else {
          navigate(`/exam-guide?exam_name=${course.exam_name}`);
        }
      } else {
        navigate(`/noaccess/${encodeURIComponent(course.exam_name)}`, {
          state: { focusedId: "course-name" },
        });
      }
    } else {
      navigate("/login", {
        state: {
          from: `/exam-guide?exam_name=${encodeURIComponent(course.exam_name)}`,
        },
      });
    }
  };
  const onClose = () => {
    setShowPopup(false);
  };
  const viewResult = () => {
    //console.log("viesw result");
    const foundAllocations = examLimitDetails
      .filter(
        (exam) =>
          exam.exam_name === courseClicked.exam_name && exam.final_appearance
      )
      .map((exam) => exam.encrypted_allocation_id);

    navigate(`/result/${foundAllocations[0]}`);
  };

  const handleViewAllClick = () => {
    navigate("/course-page");
  };
  const handleProfileClick = () => {
    const currentPath = location.pathname;
    // navigate(`/complete-profile?returnUrl=${encodeURIComponent(currentPath)}`);
  };

  const handleLeaderClick = () => {
    navigate("/leaders", { state: { focusedId: "mentor-button" } });
  };
  const handleYoutubeClick = () => {
    window.open("https://www.youtube.com/@SETUSchool/videos", "_blank");
  };

  const navigateLogin = (e) => {
    const currentPath = location.pathname;

    navigate(`/login`);
  };

  const slides = splitIntoSlides(dap_topics, 3);
  const slides2 = splitIntoSlides(skillBased, 3);
  const slides3 = splitIntoSlides(profileBased, 3);
  const slides4 = splitIntoSlides(topic2, 3);
  const slides5 = splitIntoSlides(topic3, 3);

  const carouselRef1 = useRef(null);
  const carouselRef2 = useRef(null);
  const carouselRef3 = useRef(null);
  const carouselRef4 = useRef(null);
  const carouselRef5 = useRef(null);

  const [activeIndex1, setActiveIndex1] = useState(0);
  const [activeIndex2, setActiveIndex2] = useState(0);
  const [activeIndex3, setActiveIndex3] = useState(0);
  const [activeIndex4, setActiveIndex4] = useState(0);
  const [activeIndex5, setActiveIndex5] = useState(0);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth >= 767) {
      setActiveIndex1(0);
      setActiveIndex2(0);
      setActiveIndex3(0);
      setActiveIndex4(0);
      setActiveIndex5(0);
    }
    const handleScroll = (ref, setActiveIndex) => {
      if (ref.current) {
        const scrollPosition = ref.current.scrollLeft;
        const slideWidth = ref.current.offsetWidth;
        const newIndex = Math.round(scrollPosition / slideWidth);
        // //console.log(newIndex);
        setActiveIndex(newIndex);
        // Force re-render in case of state sync issues
        setActiveIndex((prev) => prev + 1);
        setTimeout(() => setActiveIndex((prev) => prev - 1), 10);
      }
    };
    const carousels = [
      { ref: carouselRef1, setIndex: setActiveIndex1 },
      { ref: carouselRef2, setIndex: setActiveIndex2 },
      { ref: carouselRef3, setIndex: setActiveIndex3 },
      { ref: carouselRef4, setIndex: setActiveIndex4 },
      { ref: carouselRef5, setIndex: setActiveIndex5 },
    ];

    // carousels.forEach(({ ref, setIndex }) => {
    //   const handleCarouselScroll = () => handleScroll(ref, setIndex);
    //   ref.current?.addEventListener("scroll", handleCarouselScroll);
    //   return () =>
    //     ref.current?.removeEventListener("scroll", handleCarouselScroll);
    // });
    const handlers = carousels.map(({ ref, setIndex }) => {
      const handleCarouselScroll = () => handleScroll(ref, setIndex);
      if (ref.current) {
        ref.current.addEventListener("scroll", handleCarouselScroll, {
          passive: true,
        });
      }
      return () =>
        ref.current?.removeEventListener("scroll", handleCarouselScroll);
    });

    return () => handlers.forEach((cleanup) => cleanup());
  }, [windowWidth]);

  const blogLinks = (link) => {
    if (link) {
      window.open(link, "_blank");
    }
  };
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
        (n) => n.exam_name === "RoadMap"
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

      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email;

      if (!email) {
        throw new Error("User email not found in local storage.");
      }

      try {
        const payload = {
          user_email: email,
          exam_name: "RoadMap",
          exam_type: "None",
          reason_for_notify: `I would like to be notified when the RoadMap is live.`,
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
        showToast(
          "Thanks for your interest! You'll be notified as soon as the learning roadmap launches."
        );

        return result;
      } catch (error) {
        return null; // Return null in case of failure
      }
    } else {
      navigate("/login");
    }
  }

  const handleDAPcousers = (dapCourses) => {
    if (
      dapCourses.trim().toLowerCase() ===
        "agentic ai - build autonomous solutions" ||
      dapCourses.trim() === "RDBMS & SQL (PostgreSQL)"
    ) {
      navigate(`/noaccess/${dapCourses}`, {
        state: { focusedId: "course-name-pfp" },
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
  const handleButtonClick = async (button) => {
    if (button === "logout") {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) {
        console.error("No user data found. Please log in again.");
        navigate("/");
        return;
      }

      const logoutPayload = {
        email: userData.email,
        session_token: localStorage.getItem("session_token"),
      };

      try {
        const response = await fetch(`${SERVER_URL}/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(logoutPayload),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Logout failed:", data.message || "Unknown error.");
          return;
        }

        if (data.status === "success") {
          showToast("You're now logged out. We’ll be here when you return!");
          setIsLoggedIn(false);
          localStorage.removeItem("user");
          localStorage.removeItem("session_token");

          // Redirect to login
          navigate("/");
        } else {
          console.error(
            "Logout error:",
            data.message || "An error occurred during logout."
          );
        }
      } catch (err) {
        console.error("Logout Exception error:", err);
      }
    } else {
      navigate("/");
    }
  };
  const RedirectForBusiness = () => {
    window.open("https://setuschool.com/setu-business", "_blank");
  };

  return (
    <>
      <Toastify />
      <div className={classes["wrapper"]}>
        {loading ? (
          <div className={classes["load-container"]}>
            <img src={loader} alt="Loading..." width="100" />
          </div>
        ) : (
          <div className={classes["container"]}>
            <div className={classes["header"]}>
              <div className={classes["logo"]}>
                <img
                  src={windowWidth <= 767 ? setuShortIcon : footerSetuIcon}
                  alt="Time Per Question"
                />

                <div className={classes["nav"]}>
                  <ul>
                    <li onClick={aboutUsRedirect}>About Us</li>
                    <li onClick={RedirectForBusiness}>For Business</li>
                  </ul>
                </div>
              </div>

              <div className={classes["actions"]} ref={menuRef}>
                {/* <a href="https://setuqverse.com/" target="_blank">
                  <button className={classes["take-free-assessment"]}>
                    Take Free Assessment
                  </button>
                </a> */}

                {isLoggedIn ? (
                  <>
                    <button
                      className={classes["login-btn"]}
                      onClick={handleProfileClick}
                    >
                      <img
                        src={profile}
                        alt=""
                        className={classes["profile"]}
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/completeprofile")}
                      />
                    </button>
                  </>
                ) : (
                  <button className={classes["login"]} onClick={navigateLogin}>
                    Login
                  </button>
                )}

                <img
                  src={menu}
                  alt=""
                  onClick={handleMenuToggle}
                  className={classes["menu-icon"]}
                />

                {menuOpen && isLoggedIn && (
                  <div className={classes["menu-options"]}>
                    <div
                      className={classes["options"]}
                      onClick={() => handleButtonClick("logout")}
                    >
                      <p>Log out</p>
                    </div>
                    <hr className={classes["menu-hr"]} />
                  </div>
                )}
              </div>
            </div>

            <div className={classes["content"]}>
              <h3>Elevate Your Data & AI Skills—Transform Your Career</h3>
              <p>
                Knowing AI isn’t enough. Certifications aren’t enough. Only
                hands-on mastery will make you unstoppable. At SETU we offer a
                personalised learning roadmap, industry-immersive training,
                competency assessments and expert mentoring to keep you ahead of
                the curve.
              </p>
            </div>

            <div className={classes["dap-academy-courses"]}>
              {windowWidth >= 768 && (
                <div className={classes["result-heading"]}>
                  <p className={classes.title}>DAP Academy Courses</p>
                  <hr className={classes["hor"]} />
                </div>
              )}

              {windowWidth <= 767 && (
                <div className={classes["result-heading-mobile"]}>
                  <hr className={classes["hor"]} />
                  <p className={classes.title}>DAP Academy Courses</p>
                  <hr className={classes["hor"]} />
                </div>
              )}
              {windowWidth >= 768 && (
                <div className={classes["grid-container"]}>
                  {dap_topics.map((topic, index) => (
                    <div
                      key={index}
                      className={classes["card"]}
                      onClick={() => handleDAPcousers(topic.name)}
                    >
                      <h2 className={classes["card-text"]}>{topic.name}</h2>
                    </div>
                  ))}
                </div>
              )}

              {/* Scrollable Slider */}
              {windowWidth <= 767 && (
                <>
                  <div
                    className={classes["carousel-container"]}
                    ref={carouselRef1}
                  >
                    <div className={classes["grid-container"]}>
                      {slides.map((slide, i) => (
                        <div key={i} className={classes["slide"]}>
                          {slide.map((topic, index) => (
                            <div
                              key={index}
                              className={classes["card"]}
                              onClick={() => handleDAPcousers(topic.name)}
                            >
                              <p className={classes["card-text"]}>
                                {topic.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dots for indicators */}
                  <div className={classes["carousel-controls"]}>
                    {slides.map((_, i) => (
                      <span
                        key={i}
                        className={`${classes.dot} ${
                          i === activeIndex1 ? classes.active : ""
                        }`}
                      ></span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className={classes["skill-based-assessment"]}>
              {windowWidth >= 768 && (
                <div className={classes["result-heading"]}>
                  <p className={classes.title}>Skill Based Assessment</p>
                  <hr className={classes["hor"]} />
                </div>
              )}

              {windowWidth <= 767 && (
                <div className={classes["result-heading-mobile"]}>
                  <hr className={classes["hor"]} />
                  <p className={classes.title}>Skill Based Assessment</p>
                  <hr className={classes["hor"]} />
                </div>
              )}

              {windowWidth >= 768 && (
                <div className={classes["grid-container"]}>
                  {skillBased.map((topic, index) => (
                    <div
                      key={index}
                      className={classes["card"]}
                      onClick={() => skillBasedCourseClick(topic)}
                    >
                      <h2
                        className={classes["card-text"]}
                        style={{
                          opacity: topic.exam_status === "Active" ? 1 : 0.5,
                        }}
                      >
                        {topic.exam_name}
                      </h2>
                    </div>
                  ))}
                </div>
              )}

              {windowWidth <= 767 && (
                <>
                  {/* Scrollable Slider */}
                  <div
                    className={classes["carousel-container"]}
                    ref={carouselRef2}
                  >
                    <div className={classes["grid-container"]}>
                      {slides2.map((slide, i) => (
                        <div key={i} className={classes["slide"]}>
                          {slide.map((topic, index) => (
                            <div
                              key={index}
                              className={classes["card"]}
                              onClick={() => skillBasedCourseClick(topic)}
                            >
                              <p
                                className={classes["card-text"]}
                                style={{
                                  opacity:
                                    topic.exam_status === "Active" ? 1 : 0.5,
                                }}
                              >
                                {topic.exam_name}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dots for indicators */}
                  {skillBased?.length >= 4 ? (
                    <div className={classes["carousel-controls"]}>
                      {slides2.map((_, i) => (
                        <span
                          key={i}
                          className={`${classes.dot} ${
                            i === activeIndex2 ? classes.active : ""
                          }`}
                        ></span>
                      ))}
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>

            <div className={classes["profile-based-assessment"]}>
              {windowWidth >= 768 && (
                <div className={classes["result-heading"]}>
                  <p className={classes.title20}>Profile Based Assessment</p>
                  <hr className={classes["hor"]} />
                </div>
              )}

              {windowWidth <= 767 && (
                <div className={classes["result-heading-mobile"]}>
                  <hr className={classes["hor"]} />
                  <p className={classes.title20}>Profile Based Assessment</p>
                  <hr className={classes["hor"]} />
                </div>
              )}

              {windowWidth >= 768 && (
                <div className={classes["grid-container"]}>
                  {profileBased.map((topic, index) => (
                    <div
                      key={index}
                      className={classes["card"]}
                      onClick={() => profileBasedCourseClick(topic)}
                    >
                      <h2
                        className={classes["card-text"]}
                        style={{
                          opacity: topic.exam_status === "Active" ? 1 : 0.5,
                        }}
                      >
                        {topic.exam_name}
                      </h2>
                    </div>
                  ))}
                </div>
              )}

              {windowWidth <= 767 && (
                <>
                  {/* Scrollable Slider */}
                  <div
                    className={classes["carousel-container"]}
                    ref={carouselRef3}
                  >
                    <div className={classes["grid-container"]}>
                      {slides3.map((slide, i) => (
                        <div key={i} className={classes["slide"]}>
                          {slide.map((topic, index) => (
                            <div
                              key={index}
                              className={classes["card"]}
                              onClick={() => profileBasedCourseClick(topic)}
                            >
                              <p
                                className={classes["card-text"]}
                                style={{
                                  opacity:
                                    topic.exam_status === "Active" ? 1 : 0.5,
                                }}
                              >
                                {topic.exam_name}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dots for indicators */}
                  {profileBased?.length >= 3 ? (
                    <div className={classes["carousel-controls"]}>
                      {slides3.map((_, i) => (
                        <span
                          key={i}
                          className={`${classes.dot} ${
                            i === activeIndex3 ? classes.active : ""
                          }`}
                        ></span>
                      ))}
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>

            <div className={classes["industry-projects"]}>
              {windowWidth >= 768 && (
                <div className={classes["result-heading"]}>
                  <p className={classes.title}>Industry Projects</p>
                  <hr className={classes["hor"]} />
                </div>
              )}

              {windowWidth <= 767 && (
                <div className={classes["result-heading-mobile"]}>
                  <hr className={classes["hor"]} />
                  <p className={classes.title}>Industry Projects</p>
                  <hr className={classes["hor"]} />
                </div>
              )}

              {windowWidth >= 768 && (
                <div className={classes["grid-container1"]}>
                  {topic2.map((topic, index) => (
                    <div key={index} className={classes["card"]}>
                      <h2 className={classes["card-text"]}>{topic.name}</h2>
                    </div>
                  ))}
                </div>
              )}

              {windowWidth <= 767 && (
                <>
                  {/* Scrollable Slider */}
                  <div
                    className={classes["carousel-container"]}
                    ref={carouselRef4}
                  >
                    <div
                      className={classes["grid-container-industry-projects"]}
                    >
                      {topic2.map((topic, index) => (
                        <div key={index} className={classes["card"]}>
                          <h2 className={classes["card-text"]}>{topic.name}</h2>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className={classes["container1"]}>
              <div className={classes["content1"]}>
                <p className={classes["learningRoadmap"]}>Learning Roadmap</p>
                <h1 className={classes["heading-c"]}>
                  AI-Powered Learning Roadmap Coming Soon! 🚀
                </h1>
                <p className={classes["sub-heading"]}>
                  Get a personalized path to career growth or transition. Bridge
                  skill gaps effortlessly. Stay ahead in the rapidly evolving
                  tech & AI landscape. Be the first to know! ⏳
                </p>
                {notify ? (
                  <button
                    className={classes["notifyMe"]}
                    style={{ color: "#0ab81f", borderColor: "#0ab81f" }}
                  >
                    Notified
                  </button>
                ) : (
                  <button
                    onClick={sendNotification}
                    className={classes["notifyMe"]}
                  >
                    Notify Me
                  </button>
                )}
                {/* <button className={classes["notifyMe"]}>Notify Me</button> */}
              </div>
              <div className={classes["placeholder"]}>
                <img src={rectangle} alt="" />
              </div>
              {notify ? (
                <button
                  className={classes["notifyMeMobile"]}
                  style={{ color: "#0ab81f", borderColor: "#0ab81f" }}
                >
                  Notified
                </button>
              ) : (
                <button
                  onClick={sendNotification}
                  className={classes["notifyMeMobile"]}
                >
                  Notify Me
                </button>
              )}
            </div>

            <div className={classes["blogs-best-practices"]}>
              {windowWidth >= 768 && (
                <div className={classes["result-heading2"]}>
                  <p className={classes.title}>Blogs & Best Practices</p>
                  <hr className={classes["hor"]} />
                </div>
              )}
              {windowWidth <= 767 && (
                <div className={classes["result-heading2-mobile"]}>
                  <hr className={classes["hor"]} />
                  <p className={classes.title}>Blogs & Best Practices</p>
                  <hr className={classes["hor"]} />
                </div>
              )}

              {windowWidth >= 768 && (
                <div className={classes["grid-container2"]}>
                  {topic3.map((topic, index) => (
                    <div
                      key={index}
                      className={classes["card1"]}
                      onClick={() => blogLinks(topic.link)}
                      style={{ cursor: "pointer" }}
                    >
                      <h2 className={classes["card-text1"]}>{topic.name}</h2>
                      <p className={classes["card-description1"]}>
                        {topic.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {windowWidth <= 767 && (
                <>
                  {/* Scrollable Slider */}
                  <div
                    className={classes["carousel-container"]}
                    ref={carouselRef5}
                  >
                    <div className={classes["grid-container1"]}>
                      {topic3.map(
                        (
                          topic,
                          index // Ensure each slide contains one topic
                        ) => (
                          <div key={index} className={classes["slide"]}>
                            <div
                              className={classes["card1"]}
                              onClick={() => blogLinks(topic.link)}
                              style={{ cursor: "pointer" }}
                            >
                              <h2 className={classes["card-text1"]}>
                                {topic.name}
                              </h2>
                              <p className={classes["card-description1"]}>
                                {topic.description}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Dots for indicators */}
                  <div className={classes["carousel-controls"]}>
                    {topic3.map((_, i) => (
                      <span
                        key={i}
                        className={`${classes.dot} ${
                          i === activeIndex5 ? classes.active : ""
                        }`}
                      ></span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {windowWidth >= 768 && (
              <div className={classes["result-heading2"]}>
                <p className={classes.title10}>
                  Mentoring by PragÑan Community{" "}
                </p>
                <hr className={classes["hor"]} />
              </div>
            )}

            {windowWidth <= 767 && (
              <div className={classes["result-heading2-mobile"]}>
                <hr className={classes["hor"]} />
                <p className={classes.title10}>
                  Mentoring by PragÑan Community{" "}
                </p>
                <hr className={classes["hor"]} />
              </div>
            )}

            
            <div className={classes["grid-container7"]}>
              <p className={classes["title4"]}>
                A great Mentor is your guiding light—illuminating hidden
                potential, navigating challenges, and steering you toward your
                greatest success.
              </p>

              <p className={classes["title5"]}>
                Here you can Schedule Mentoring and Career Coaching Session with
                Global Technology Leaders.
                <div>
                  <img
                    src={pragyan_logo}
                    alt="Mentoring Session"
                    className={classes["inline-image"]}
                  />
                  <span
                    className={classes["subtitle5"]}
                    onClick={() => handleLeaderClick()}
                  >
                    See Mentors
                  </span>
                </div>
              </p>

              <p className={classes["title6"]}>
                Visit the PragÑan series to listen to the pearls of wisdom of
                these leaders.
                <div onClick={handleYoutubeClick} style={{ cursor: "pointer" }}>
                  <img
                    src={youtube_icons}
                    alt="Youtube Session"
                    className={classes["inline-image1"]}
                  />
                  <span className={classes["subtitle6"]}>
                    Get me into series
                  </span>
                </div>
              </p>
            </div>

            {/* Mobile footer */}
            <footer className={classes["landing-page-footer"]}>
              <img
                src={footerSetuIcon}
                className={classes["footer-setu-icon"]}
                alt=""
              />

              <p className={classes["email"]}>Email : mitra@setushool.com</p>
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

            {/* Web Footer */}
            <div className={classes["footer"]}>
              <div className={classes["footer-first"]}>
                <img src={footerSetuIcon} alt="" />
                <p>Email :mitra@setushool.com</p>
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

export default TestCard;
