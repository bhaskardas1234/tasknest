import { useState, useEffect } from "react";
import styles from "./chatbot.module.css";
import { useNavigate } from "react-router-dom";

const chatFlow = {
  start: {
    question: "Hi! I'm here to help you plan your day. Shall we begin?",
    options: [
      { label: "Yes", next: "wakeUpTime" },
      { label: "No, thanks", next: "end" },
    ],
  },

  wakeUpTime: {
    question: "What time do you usually wake up?",
    options: [
      { label: "5 AM", next: "sleepTime" },
      { label: "6 AM", next: "sleepTime" },
      { label: "7 AM", next: "sleepTime" },
      { label: "8 AM", next: "sleepTime" },
    ],
  },

  sleepTime: {
    question: "What time do you usually go to sleep?",
    options: [
      { label: "9 PM", next: "breakfastTime" },
      { label: "10 PM", next: "breakfastTime" },
      { label: "11 PM", next: "breakfastTime" },
      { label: "12 AM", next: "breakfastTime" },
    ],
  },

  breakfastTime: {
    question: "When do you have your breakfast?",
    options: [
      { label: "7 AM", next: "lunchTime" },
      { label: "8 AM", next: "lunchTime" },
      { label: "9 AM", next: "lunchTime" },
    ],
  },

  lunchTime: {
    question: "When do you usually have lunch?",
    options: [
      { label: "12 PM", next: "dinnerTime" },
      { label: "1 PM", next: "dinnerTime" },
      { label: "2 PM", next: "dinnerTime" },
    ],
  },

  dinnerTime: {
    question: "When do you usually have dinner?",
    options: [
      { label: "7 PM", next: "doWorkout" },
      { label: "8 PM", next: "doWorkout" },
      { label: "9 PM", next: "doWorkout" },
    ],
  },

  doWorkout: {
    question: "Do you do any workouts or exercise?",
    options: [
      { label: "Yes", next: "workoutTime" },
      { label: "No", next: "studyPref" },
    ],
  },

  workoutTime: {
    question: "What time do you usually exercise?",
    options: [
      { label: "Morning", next: "studyPref" },
      { label: "Evening", next: "studyPref" },
    ],
  },

  studyPref: {
    question: "When do you prefer studying or doing focused work?",
    options: [
      { label: "Morning", next: "profession" },
      { label: "Afternoon", next: "profession" },
      { label: "Night", next: "profession" },
    ],
  },

  profession: {
    question: "What's your current role?",
    options: [
      { label: "School Student", next: "schoolTiming" },
      { label: "Employee", next: "workTiming" },
      { label: "Other", next: "generate" },
    ],
  },

  schoolTiming: {
    question: "What are your school hours?",
    options: [
      { label: "8 AM - 2 PM", next: "generate" },
      { label: "9 AM - 3 PM", next: "generate" },
    ],
  },

  workTiming: {
    question: "What are your work hours?",
    options: [
      { label: "9 AM - 5 PM", next: "generate" },
      { label: "10 AM - 6 PM", next: "generate" },
      { label: "Flexible/Remote", next: "generate" },
    ],
  },

  generate: {
    question:
      "Thanks! Click the button below to generate your personalized daily plan.",
    options: [{ label: "Generate Plan", next: "end", isGenerate: true }],
  },

  end: {
    question:
      "Your daily plan is ready! 🎯 You can now view or adjust it as needed.",
    options: [],
  },
};

function Chatbot() {
  const [currentNode, setCurrentNode] = useState("start");
  const [chatHistory, setChatHistory] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    setChatHistory([{ sender: "bot", text: chatFlow["start"].question }]);
  }, []);

  const handleOptionClick = (option) => {
    // if (option.isGenerate) {
    //   const plan = generatePlan(userAnswers); // Use collected answers
    //   setDailyPlan(plan); // Show the plan UI
    //   setChatHistory((prev) => [
    //     ...prev,
    //     { sender: "bot", text: chatFlow["end"].question },
    //   ]);
    //   return;
    // }
    if (option.isGenerate) {
      // Optional: store answers in localStorage or state management
      localStorage.setItem("dailyPlanData", JSON.stringify(userAnswers));

      // Navigate to plan page
      navigate("/daily-plan");
      return;
    }
    setUserAnswers((prev) => ({
      ...prev,
      [currentNode]: option.label,
    }));
    const newNode = option.next;

    setChatHistory((prev) => [
      ...prev,
      { sender: "user", text: option.label },
      { sender: "bot", text: chatFlow[newNode].question },
    ]);

    setCurrentNode(newNode);
  };

  const renderOptions = () => {
    const node = chatFlow[currentNode];
    if (!node.options.length) return null;

    return node.options.map((opt, index) => (
      <button
        key={index}
        onClick={() => handleOptionClick(opt)}
        className={styles.buttons}
      >
        {opt.label}
      </button>
    ));
  };

  return (
    <div className={styles.maincontainer}>
      <div className={styles.questiontext}>
        {chatHistory.map((entry, index) => (
          <div
            key={index}
            className={`${styles.messageBubble} ${
              entry.sender === "user" ? styles.userMessage : styles.botMessage
            }`}
          >
            <p>{entry.text}</p>
          </div>
        ))}
        <div>{renderOptions()}</div>
      </div>
    </div>
  );
}

export default Chatbot;
