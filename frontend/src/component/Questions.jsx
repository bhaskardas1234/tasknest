import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
} from "react";
import classes from "./Questions.module.css";
import nextIcon from "../assets/right.svg";
import previousIcon from "../assets/left.svg";
import closeIcon from "../assets/close.svg";
import hintIcon from "../assets/hint.svg";
import loader from "../assets/loader.gif";
import alertIcon from "../assets/gear.svg";
import gifIcon from "../assets/warning.gif";
import { QuestionContext } from "../context/QuestionContext";
import { useLocation, useNavigate } from "react-router-dom";
import questionIcon from "../assets/questions.svg";
import totalPointsIcon from "../assets/total-points.svg";
import timeLeftIcon from "../assets/time-left.svg";
import { SERVER_URL } from "../index.js";
import { useUserActivity } from "../context/UserActivityContext";
import setuShortIcon from "../assets/setu-logo-short.svg";
import menuIcon from "../assets/menu.svg";
import { eventBus } from "../component/Modal";
import FeedbackForm from "./FeedbackForm.jsx";

const Questions = ({
  ref,
  setShowModal,
  setModalMessage,
  setCloseModal,
  setActivateEventListner,
}) => {
  useImperativeHandle(ref, () => ({
    submitTest: async () => {
      return await handleConfirmSubmit("Toggle switching");
    },
  }));

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subject_name = searchParams.get("exam_name");
  const test_Id = searchParams.get("test_id");
  const testName = searchParams.get("exam_name");
  const test_type = searchParams.get("t");

  const total_questions = searchParams.get("total_questions");
  const { testDetails, setTestDetails } = useContext(QuestionContext);
  const navigate = useNavigate();
  const tabs = ["Test", "Questions"];
  const [isQuestions, setIsQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isTestButtonClicked, setIsTestButtonClicked] = useState(true);
  const [isQuestionsButtonClicked, setIsQuestionsButtonClicked] =
    useState(false);
  const [currentIndex, setCurrentIndex] = useState(() => {
    const storedCurrentIndex = sessionStorage.getItem("current_question_index");
    if (storedCurrentIndex) return Number(storedCurrentIndex);
    return 0;
  });
  const [progress, setProgress] = useState(0);
  const [seconds, setSeconds] = useState(0); // State to hold seconds
  const [isActive, setIsActive] = useState(false);
  const [isCountAttempted, setIsCountAttempted] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [isQuestionsList, setIsQuestionsList] = useState(isQuestions);
  const [viewMode, setViewMode] = useState("test");
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedOptions, setExpandedOptions] = useState(
    Array(isQuestions.length).fill({})
  );
  const [selectedOptions, setSelectedOptions] = useState(
    Array(isQuestions.length).fill(null)
  );
  const [loading, setLoading] = useState(true);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isSubmitPopupVisible, setIsSubmitPopupVisible] = useState(false);
  const [currentHints, setCurrentHints] = useState([]);
  const initialTimeRef = useRef(null);
  const [submitMode, setSubmitMode] = useState("");
  const [isExamActive, setIsExamActive] = useState(false);
  const [timers, setTimers] = useState(() => {
    const storedTimer = sessionStorage.getItem("test_timer");
    if (storedTimer) {
      return JSON.parse(storedTimer);
    }
    return {};
  });
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const { logActivity, activityHistory, clearActivity } = useUserActivity();
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [examStartTime, setExamStartTime] = useState(null);
  const [examEndTime, setExamEndTime] = useState(null);
  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    setExamStartTime(new Date().toLocaleTimeString());
    const handleSubmitEvent = (message) => handleConfirmSubmit(message);
    eventBus.on("submitEvent", handleSubmitEvent);

    return () => {
      eventBus.off("submitEvent", handleSubmitEvent); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    if (activeQuestion !== null) {
      setStartTime(Date.now());
    }
  }, [activeQuestion]);

  useEffect(() => {
    if (initialTimeRef.current === null) {
      // //console.log("timer", testDetails?.test_details?.original_duration)
      initialTimeRef.current = testDetails?.test_details?.original_duration;
      // initialTimeRef.current = testDetails.test_details.duration;
    }
  }, [seconds]);

  useEffect(() => {
    let timer;
    if (isExamActive && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
        saveTestProgress(isQuestions);
      }, 1000);
    } else if (isExamActive && seconds <= 0) {
      const autoSubmitExam = async () => {
        await handleConfirmSubmit("Auto Submission");
      };
      autoSubmitExam();
    }
    return () => clearInterval(timer);
  }, [isExamActive, seconds]);

  useEffect(() => {
    const questions = testDetails?.test_details?.allocated_questions;
    const duration = testDetails?.test_details?.exam_duration_in_seconds;
    // //console.log(duration,"jdjfkdjkhello")
    if (questions?.length > 0) {
      const formattedQuestions = questions.map((q, index) => ({
        code: q.question_code,
        id: index + 1,
        question_id: q.question_id || null,
        question: q.question_text || `Question ${index + 1}`,
        options: q.options,
        attempted: q.attempted || false,
        hints: q.question_hints || null,
        marks: q.question_marks || "1",
        type: q.type,
        competency: q.competency,
        subcompetency: q.subcompetency,
        visited: index === 0 ? true : q.visited || false,
        complexity_level: q.complexity_level,
      }));
      //console.log(1);
      setIsQuestions(formattedQuestions);
      //console.log(2);
      setSelectedOptions(() => {
        const storedSelectedOptions =
          sessionStorage.getItem("selected_options");
        if (storedSelectedOptions) {
          return JSON.parse(storedSelectedOptions);
        }
        return Array(questions.length).fill(null);
      });

      setExpandedOptions(Array(questions.length).fill({}));
      setSeconds(duration);
      setLoading(false);
      saveTestProgress(formattedQuestions);
    }
  }, [questions]);

  const generateAnswersArray = () => {
    const answers = isQuestions.map((question, index) => {
      const selectedOptionIndex = selectedOptions[index];
      //console.log(selectedOptionIndex, "selcted option index");
      const selectedOption =
        selectedOptionIndex !== null && selectedOptionIndex !== undefined
          ? question.options[selectedOptionIndex]
          : null;

      const timeSpent = timers[index] || 0;
      //console.log("time spent for the question", timeSpent);

      const formattedTime =
        selectedOption !== null || selectedOption == null
          ? (() => {
              const milliseconds = Math.floor((timeSpent % 1) * 1000);
              const seconds = Math.floor(timeSpent % 60);
              const minutes = Math.floor((timeSpent / 60) % 60);
              const hours = Math.floor(timeSpent / 3600);

              return `${String(hours).padStart(2, "0")}:${String(
                minutes
              ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(
                milliseconds
              ).padStart(3, "0")}`;
            })()
          : "00:00:00:000";
      //console.log("formatted time", formattedTime);
      return {
        id: question.question_id,
        selected_option: selectedOption,
        time_taken: formattedTime,
        attempted: question.attempted,
        visited: question.visited,
        marks: question.marks,
        competency: question?.competency,
        subcompetency: question?.subcompetency,
      };
    });

    return answers;
  };

  const submitTest = async (payload, testId) => {
    setIsSubmitDisabled(true);

    const apiUrl = `${SERVER_URL}/evaluate-exam`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        logActivity({
          event: "submit_test",
          submit_status: "failed",
          email: JSON.parse(localStorage.getItem("user")).email,
          total_time: payload["total_time"],
          submission_mode: payload["submission_mode"],
          selected_subject: payload["selected_subject"],

          attempted_questions: payload["attempted_questions"],
          total_questions: payload["total_questions"],
          answers: payload["answers"],
          source_page: `${location.pathname}`,
          event_timeline: new Date().toLocaleString(),
        });
        if (response.status === 404) {
          // alert("Test not Found, Test Id is not matched");
        } else if (response.status === 400) {
          if (data.error === "Test already submitted!!") {
            localStorage.removeItem("test_status");
            sessionStorage.clear();

            // alert(data.error);
            setModalMessage(data.error);
            setShowModal(true);
            setCloseModal(() => {
              return () => {
                navigate("/");
              };
            });
            return;
          }

          setIsSubmitPopupVisible(false);
        } else {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      logActivity({
        event: "submit_test",
        submit_status: "successful",
        email: JSON.parse(localStorage.getItem("user")).email,
        total_time: payload["total_time"],
        submission_mode: payload["submission_mode"],
        selected_subject: payload["selected_subject"],

        attempted_questions: payload["attempted_questions"],
        total_questions: payload["total_questions"],
        answers: payload["answers"],
        source_page: `${location.pathname}`,
        event_timeline: new Date().toLocaleString(),
      });
      sessionStorage.clear();
      localStorage.removeItem("test_status");

      navigate(`/submit/${testId}`);

      return data;
    } catch (error) {
      console.error("Error submitting test:", error.message);
      // throw error;
    }
    setIsSubmitDisabled(false);
  };
  useEffect(() => {
    if (examEndTime) {
      
    }
  }, [examEndTime]); // Runs whenever examEndTime changes

  const handleConfirmSubmit = async (submissionType) => {
    

    navigateToQuestion(currentIndex);
    //console.log("this is the current index", currentIndex);
    const EndTime = new Date().toLocaleTimeString(); // Capture time first
    setExamEndTime(EndTime); // Update state

    //console.log(examEndTime, "end");

    if (submissionType === "Auto Submission") {
      setSubmitMode(submissionType);
      setIsExamActive(false);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const email = user?.email;

        if (!email) {
          throw new Error("User email not found in local storage.");
        }

        const payload = {
          user_email: email,
          testimonial_text: "auto submission", // Using state value here
          rating: 0,
          captured_form: `setu-assessment_${test_type}_test_${testName}_mcq`,
        };

        //console.log("Payload:", payload); // For debugging

        const response = await fetch(`${SERVER_URL}/add-testimonial`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to submit feedback.");
        }

        const responseData = await response.json();
      } catch (error) {
        console.error(error);
      }

      // alert("Time's up! Exam submitted.");
    } else {
      setSubmitMode(submissionType);
      setIsExamActive(false);
    }

    const answersArray = generateAnswersArray();

    //console.log(initialTimeRef.current);
    const payload = {
      email: JSON.parse(localStorage.getItem("user")).email,
      total_time: formatTime(initialTimeRef.current - seconds),
      submission_mode: submissionType,
      selected_subject: subject_name,
      test_id: test_Id,
      submitted: true,
      attempted_questions: isCountAttempted,
      total_questions: total_questions,
      examStartTime: examStartTime,
      examEndTime: EndTime,
    };

    if (answersArray.length > 0) {
      payload.answers = answersArray;
    }
    try {
      const data = await submitTest(payload, test_Id);

      setIsSubmitPopupVisible(false);
    } catch (error) {
      console.error("Error submitting test:", error);
    }
  };

  const handleSubmitClick = () => {
    setIsSubmitPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsSubmitPopupVisible(false);
  };

  const showPopup = () => {
    setIsPopupVisible(true);
  };
  const handleShowHints = (questionIndex) => {
    const questionHints = isQuestions[questionIndex]?.hints || null;

    if (questionHints) {
      setCurrentHints(questionHints);
      setIsPopupVisible(true);
    } else {
      //  alert("No hints available for this question.");
    }
  };

  const hidePopup = () => {
    setIsPopupVisible(false);
  };

  const handleTabClick = (index, tab) => {
    setActiveTab(index);
    if (tab === "Questions") {
      setIsQuestionsButtonClicked(true);
      setIsTestButtonClicked(false);
    } else {
      setIsQuestionsButtonClicked(false);
      setIsTestButtonClicked(true);
    }
  };

  const handleOptionClick = (index, option, currentIndex) => {
    const currentTime = Date.now();

    if (activeQuestion === currentIndex && startTime) {
      const timeSpent = (currentTime - startTime) / 1000;
      setTimers((prevTimers) => ({
        ...prevTimers,
        [currentIndex]: (prevTimers[currentIndex] || 0) + timeSpent,
      }));
    }
    isQuestions[currentIndex].attempted = true;
    setIsQuestionsList(isQuestions);
    countAttempted();

    const updatedSelections = [...selectedOptions];

    updatedSelections[currentIndex] = index;
    setSelectedOptions(updatedSelections);
    //console.log(selectedOptions, `this is the selected option`);
    setStartTime(Date.now());
    saveTestProgress(isQuestions);
    sessionStorage.setItem(
      "selected_options",
      JSON.stringify(updatedSelections)
    );
  };

  const navigateToQuestion = (questionIndex) => {
    if (activeQuestion !== null && startTime) {
      const timeSpent = (Date.now() - startTime) / 1000;
      setTimers((prevTimers) => ({
        ...prevTimers,
        [activeQuestion]: (prevTimers[activeQuestion] || 0) + timeSpent,
      }));
      //console.log(timeSpent, "timeSpent");
    }
    //console.log(timers, "timer");

    setActiveQuestion(questionIndex);
    setStartTime(Date.now());
  };

  let count = 0;
  const countAttempted = () => {
    for (let i = 0; i < isQuestions.length; i++) {
      if (isQuestions[i].attempted === true) {
        count++;
      }
    }
    setIsCountAttempted(count);
  };

  useEffect(() => {
    progressLength();
  }, [isCountAttempted, isQuestions]);
  useEffect(() => {
    countAttempted();
  }, [isQuestions]);

  const progressLength = () => {
    setProgress(Math.ceil((isCountAttempted / isQuestions.length) * 100));
  };

  const nextQuestion = () => {
    if (currentIndex < isQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      sessionStorage.setItem("current_question_index", currentIndex + 1);
      navigateToQuestion(currentIndex + 1);
    }
    setIsExpanded(false);
    setIsCodeExpanded(false);
    // isQuestions[currentIndex].visited = true;
    // saveTestProgress(isQuestions);
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      sessionStorage.setItem("current_question_index", currentIndex - 1);
      navigateToQuestion(currentIndex - 1);
    }
    setIsExpanded(false);
    setIsCodeExpanded(false);
    // isQuestions[currentIndex].visited = true;

    // saveTestProgress(isQuestions);
  };
  const returnTest = () => {
    setIsQuestionsButtonClicked(false);
    setIsTestButtonClicked(true);
  };

  const toggleTimer = () => {
    setIsActive((prevState) => !prevState);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(100);
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const saveTestProgress = (questions) => {
    const updatedQuestions = questions.map((q) => {
      // //console.log(q.options[0])
      return {
        index: q.id,
        question_id: q.question_id,
        code: q.code,
        complexity_level: q.complexity_level,
        hints: q.hints,
        marks: q.marks,
        option_1: q.options[0],
        option_2: q.options[1],
        option_3: q.options[2],
        option_4: q.options[3],
        question_id: q.question_id,
        question_text: q.question,
        competency: q.competency,
        subcompetency: q.subcompetency,
        type: q.type,
        attempted: q.attempted,
        visited: q.visited,
      };
    });
    const test_details = sessionStorage.getItem("test_details");
    if (test_details) {
      let updatedTestDetails = JSON.parse(test_details);
      updatedTestDetails.test_details.allocated_questions = updatedQuestions;
      updatedTestDetails.test_details.duration = seconds;
      sessionStorage.setItem(
        "test_details",
        JSON.stringify(updatedTestDetails)
      );
    }
  };

  useEffect(() => {
    if (isQuestions.length !== 0) {
      isQuestions[currentIndex].visited = true;
      saveTestProgress(isQuestions);
    }
  }, [currentIndex]);

  useEffect(() => {
    sessionStorage.setItem("test_timer", JSON.stringify(timers));
  }, [timers]);

  // useEffect(() => {
  //   let timerId;
  //   timerId = setInterval(() => {
  //     setSeconds((prevSeconds) => {
  //       if (prevSeconds > 0) {
  //         return prevSeconds - 1;
  //       } else {
  //         return 0;
  //       }
  //     });
  //   }, 1000);
  //   return () => clearInterval(timerId);
  // }, []);
  const toggleOptionExpand = (optionIndex) => {
    const updatedExpansion = [...expandedOptions];
    updatedExpansion[currentIndex] = {
      ...updatedExpansion[currentIndex],
      [optionIndex]: !updatedExpansion[currentIndex]?.[optionIndex],
    };
    setExpandedOptions(updatedExpansion);
  };

  const isOptionExpanded = (optionIndex) =>
    expandedOptions[currentIndex]?.[optionIndex] || false;

  const getTruncatedText = (text, lines = 3) => {
    const maxLength = 100;
    // //console.log(text,"88888888888888888888")
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };
  const handleToggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
    setIsCodeExpanded((prevState1) => !prevState1);
  };

  useLayoutEffect(() => {
    const { status, message } = getTestStatus();
    if (!status) {
      // alert(message);
      setModalMessage(message);
      setShowModal(true);
      setCloseModal(() => {
        return () => {
          navigate("/");
        };
      });
    } else {
      if (localStorage.getItem("user")) {
        setIsExamActive(true);
        setActivateEventListner(true);
        navigateToQuestion(0);

        const timer = setTimeout(() => {
          setLoading(false);
        }, 5000);
        return () => clearTimeout(timer);
      } else {
        navigate("/login");
      }
    }
  }, []);

  const getTestStatus = () => {
    try {
      const testStatus = localStorage.getItem("test_status");
      const isOriginalTestTab = sessionStorage.getItem("is_original_test_tab");

      if (testStatus == null)
        return { status: false, message: "Test Not found" };
      if (isOriginalTestTab == null)
        return {
          status: false,
          message: "Test is Going on another tab!! Please complete it",
        };
      if (testStatus === "ongoing" && isOriginalTestTab === "true") {
        return { status: true, message: "Test running" };
      }

      return { status: false, message: "Unexpected error occured" };
    } catch (error) {
      console.error(error);
      return { status: false, message: "Unexpected error occured" };
    }
  };

  const questionVisited = (currentIndex, index) => {
    setCurrentIndex(index);
    sessionStorage.setItem("current_question_index", index);
    setViewMode("test");
    setIsExpanded(false);
    setIsCodeExpanded(false);
    navigateToQuestion(index);
    // isQuestions[currentIndex].visited = true;

    // saveTestProgress(isQuestions);
  };

  return (
    <>
      {showChild ? (
        <FeedbackForm
          onApiCallComplete={() => handleConfirmSubmit("Manual Submission")}
          examName={testName}
          examType={test_type}
        />
      ) : (
        <div className={classes["container"]}>
          {loading ? (
            <div className={classes["load-container"]}>
              <img src={loader} alt="Example GIF" width="100" />
            </div>
          ) : (
            <>
              <div className={classes["mcq-container"]}>
                <div className={classes["header-part"]}>
                  <img src={setuShortIcon} alt="" />
                  <div className={classes["header-part-right"]}>
                    <img src={menuIcon} alt="" />
                  </div>
                </div>

                <div className={classes["heading"]}>
                  <p className={classes["heading-p"]}>{subject_name}</p>

                  <button
                    className={classes["submit"]}
                    onClick={handleSubmitClick}
                  >
                    Submit the test
                  </button>
                  {isSubmitPopupVisible && (
                    <div className={classes["overlay"]}>
                      <div className={classes["submit-popup"]}>
                        <div>
                          <img src={gifIcon} alt="" />
                        </div>
                        <div className={classes["limit"]}>
                          <img src={alertIcon} alt="" />
                          <p>
                            Unattempted questions{" "}
                            <b className={classes["red"]}>
                              {" "}
                              {isQuestions.length - isCountAttempted}
                            </b>
                          </p>
                        </div>
                        <div className={classes["limit"]}>
                          <img src={alertIcon} alt="" />
                          <p>
                            Time remaining{" "}
                            <b className={classes["red"]}>
                              {formatTime(seconds)}
                            </b>
                          </p>
                        </div>
                        <p className={classes["main-q"]}>
                          Are you sure you want to submit the test ?
                        </p>
                        <div className={classes["popup-actions"]}>
                          <button
                            className={classes["cancel-button"]}
                            onClick={handleClosePopup}
                          >
                            No, continue
                          </button>
                          <button
                            className={classes["confirm-button"]}
                            onClick={
                              () => setShowChild(true)
                              // handleConfirmSubmit("Manual Submission")
                            }
                            disabled={isSubmitDisabled}
                          >
                            {!isSubmitDisabled
                              ? "Yes, Submit"
                              : "Submitting..."}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <hr className={classes["question-hr"]} />

                <div className={classes["tabs-parent"]}>
                  <div className={classes["tabs"]}>
                    <p
                      className={`${classes["test-tab"]} ${
                        viewMode === "test" ? classes["active-tab"] : ""
                      }`}
                      onClick={() => setViewMode("test")}
                    >
                      Test
                    </p>
                    <p
                      className={`${classes["question-tab"]} ${
                        viewMode === "questions" ? classes["active-tab"] : ""
                      }`}
                      onClick={() => setViewMode("questions")}
                    >
                      Questions
                    </p>
                  </div>
                </div>

                {viewMode === "test" ? (
                  <>
                    <div className={classes["completion-level"]}>
                      <div className={classes["time-range"]}>
                        <input
                          type="range"
                          value={progress}
                          readOnly
                          style={{
                            background: `linear-gradient(to right, #77EB7C ${progress}%, #e0e0e0 ${progress}%)`,
                          }}
                        />
                        <p className={classes["time-remains"]}>
                          {formatTime(seconds)} left
                        </p>
                      </div>
                      <div className={classes["q-num"]}>
                        <p className={classes["q-answered"]}>
                          {`${isCountAttempted}/${isQuestions.length} questions attempted`}
                        </p>
                      </div>
                    </div>

                    <div className={classes["web-question-part"]}>
                      <div className={classes["Question"]}>
                        <div className={classes["question-numbering"]}>
                          <div className={classes["question-only"]}>
                            <p className={classes["question-p"]}>
                              {currentIndex + 1}.
                            </p>
                            <p className={classes["question-p"]}>
                              {isExpanded ||
                              isQuestions[currentIndex]?.question.length <= 100
                                ? isQuestions[currentIndex].question
                                : getTruncatedText(
                                    isQuestions[currentIndex]?.question
                                  )}
                            </p>
                          </div>

                          {(isQuestions[currentIndex]?.question.length > 100 ||
                            isQuestions[currentIndex].code !== "None") && (
                            <p
                              className={classes["see-more-code"]}
                              onClick={handleToggleExpand}
                            >
                              {isExpanded ? " See Less" : " See More"}
                              {isCodeExpanded &&
                              isQuestions[currentIndex]?.code !== "NaN" ? (
                                <textarea
                                  className={classes["code"]}
                                  value={isQuestions[currentIndex]?.code}
                                ></textarea>
                              ) : (
                                ""
                              )}
                            </p>
                          )}
                        </div>

                        <p className={classes["question-p"]}>
                          [{isQuestions[currentIndex].marks} points]
                        </p>
                      </div>
                      {isQuestions[currentIndex].hints &&
                      isQuestions[currentIndex].hints !== "NaN" ? (
                        <div className={classes["hint"]}>
                          <img
                            src={hintIcon}
                            alt="Hint"
                            className={classes["hint-img"]}
                            onClick={() => handleShowHints(currentIndex)}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>

                    <div className={classes["Options"]}>
                      {isQuestions[currentIndex].options.map(
                        (option, index) => (
                          <div
                            key={`${index}-${
                              selectedOptions[currentIndex]
                                ? selectedOptions[currentIndex]
                                : "null"
                            }`}
                            className={classes["option-wrapper"]}
                          >
                            <input
                              type="radio"
                              name={`question-${currentIndex}`}
                              id={`option-${currentIndex}-${index}--${
                                selectedOptions[currentIndex]
                                  ? selectedOptions[currentIndex]
                                  : "null"
                              }`}
                              checked={selectedOptions[currentIndex] === index}
                              onChange={() =>
                                handleOptionClick(index, option, currentIndex)
                              }
                            />
                            <button
                              className={`${classes["option-button"]} ${
                                selectedOptions[currentIndex] === index
                                  ? classes["selected-option"]
                                  : ""
                              }`}
                            >
                              {isOptionExpanded(index) || option.length <= 100
                                ? option
                                : getTruncatedText(option, 100)}
                              {option.length > 100 && (
                                <b
                                  className={classes["see-more"]}
                                  onClick={() => toggleOptionExpand(index)}
                                >
                                  {isOptionExpanded(index)
                                    ? "See Less"
                                    : "See More"}
                                </b>
                              )}
                            </button>
                          </div>
                        )
                      )}
                    </div>

                    <div
                      className={`${classes["popup"]} ${
                        isPopupVisible
                          ? classes["popup-active"]
                          : classes["popup-hide"]
                      }`}
                    >
                      <div className={classes["popup-content"]}>
                        <div className={classes["top"]}>
                          <div className={classes["close"]}>
                            <img
                              src={closeIcon}
                              className={classes["close-button"]}
                              onClick={hidePopup}
                            />
                          </div>

                          <div className={classes["hints-body"]}>
                            <div className={classes["hints-heading"]}>
                              <p>
                                Here are hints to guide someone toward the
                                answer:
                              </p>
                            </div>
                            <div className={classes["hints-points"]}>
                              {currentHints ? (
                                Array.isArray(currentHints) ? (
                                  currentHints.map((hint, hintIndex) => (
                                    <div
                                      key={hintIndex}
                                      className={classes["sub-hints"]}
                                    >
                                      <p>{hintIndex + 1}.</p>
                                      <p>{hint}</p>
                                    </div>
                                  ))
                                ) : (
                                  <div className={classes["sub-hints"]}>
                                    <p>1.</p>
                                    <p>{currentHints}</p>
                                  </div>
                                )
                              ) : (
                                <p>No hints available for this question.</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className={classes["got-it"]}>
                          <button
                            className={classes["got-it-btn"]}
                            onClick={hidePopup}
                          >
                            Got it
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={classes["question-numbers"]}>
                    <div className={classes["details-section"]}>
                      <div className={classes["details-questions"]}>
                        <img src={questionIcon} alt="" />
                        <div className={classes["details-center"]}>
                          <p>{isQuestions.length}</p>
                          <p>questions</p>
                        </div>
                      </div>

                      <hr className={classes["vertical-line"]} />

                      <div className={classes["details-points"]}>
                        <img src={totalPointsIcon} alt="" />
                        <div className={classes["details-center"]}>
                          <p>{testDetails?.test_details?.total_marks || 0}</p>
                          <p>points total</p>
                        </div>
                      </div>

                      <hr className={classes["vertical-line"]} />

                      <div className={classes["details-time"]}>
                        <img src={timeLeftIcon} alt="" />
                        <div className={classes["details-center"]}>
                          <p>{formatTime(seconds)}</p>
                          <p>left</p>
                        </div>
                      </div>
                    </div>

                    <div className={classes["color-code"]}>
                      <div className={classes["unseen"]}>
                        <p className={classes["color-unseen"]}></p>
                        <p>Unseen</p>
                      </div>
                      <div className={classes["unattempted"]}>
                        <p className={classes["color-unattempted"]}></p>
                        <p>Unattempted</p>
                      </div>
                      <div className={classes["attempted"]}>
                        <p className={classes["color-attempted"]}></p>
                        <p>Attempted</p>
                      </div>
                      <div className={classes["current"]}>
                        <p className={classes["color-current"]}></p>
                        <p>Current</p>
                      </div>
                    </div>

                    <div className={classes["pointers"]}>
                      {isQuestions.map((question, index) => (
                        <button
                          key={index}
                          className={classes["question-number"]}
                          style={{
                            borderColor:
                              currentIndex === index
                                ? "#FFF59E"
                                : question.visited
                                ? question.attempted
                                  ? "#4CAF50"
                                  : "#64B5F6"
                                : "#FF5733",
                          }}
                          onClick={() => questionVisited(currentIndex, index)}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {viewMode === "test" ? (
                <div className={classes["navigation-test"]}>
                  <button
                    className={`${classes["prev-button"]} ${
                      currentIndex <= 0 ? classes["disabled"] : ""
                    }`}
                    onClick={prevQuestion}
                    disabled={currentIndex <= 0}
                  >
                    <img src={previousIcon} alt="" />
                    <p>Previuos</p>
                  </button>

                  <button
                    className={`${classes["next-button"]} ${
                      currentIndex >= isQuestions.length - 1
                        ? classes["disabled"]
                        : ""
                    }`}
                    onClick={nextQuestion}
                    disabled={currentIndex >= isQuestions.length - 1}
                  >
                    <p>Next</p>
                    <img src={nextIcon} alt="" />
                  </button>
                </div>
              ) : (
                <div className={classes["navigation-question"]}>
                  <button
                    className={classes["return-to-test"]}
                    onClick={() => setViewMode("test")}
                  >
                    Return to test
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Questions;
