import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Dashboard.module.css";
import {
  FaStar,
  FaCalendarAlt,
  FaPalette,
  FaCommentDots,
  FaQuestionCircle,
  FaCog,
  FaBell,
  FaUserCircle,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
} from "react-icons/fa";
import { FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaClock, FaRegCheckCircle, FaExclamationCircle } from "react-icons/fa";
import MyCalendar from "./MyCalendar";
import { useCookies } from "react-cookie";
import cookie from "react-cookies";
import { SERVER_URL } from "..";
import ChatbotWidget from "./ChatbotWidget";
import logo from "../assets/logo.png";
import Theme from "./Theme";

// async function fetchWithAutoRefresh(url, options = {}) {
//   const accessToken = cookie.load("token");
//   console.log(accessToken);
//   const response = await fetch(url, {
//     ...options,
//     headers: {
//       ...options.headers,
//       Authorization: `Bearer ${accessToken}`,
//     },
//     credentials: "include", // Always include credentials for future refresh
//   });

//   if (response.status === 401) {
//     // Access token expired or invalid
//     console.log("Access token expired. Trying to refresh...");

//     const refreshResponse = await fetch(`${SERVER_URL}/refresh`, {
//       method: "POST",
//       credentials: "include", // Very important for sending refresh cookie
//     });

//     if (refreshResponse.ok) {
//       const refreshData = await refreshResponse.json();
//       const newAccessToken = refreshData.access_token;

//       // Save new access token
//       // localStorage.setItem("access_token", newAccessToken);
//       cookie.remove("token");
//       cookie.save("token", newAccessToken);

//       // Retry original request with new token
//       const retryResponse = await fetch(url, {
//         ...options,
//         headers: {
//           ...options.headers,
//           Authorization: `Bearer ${newAccessToken}`,
//         },
//         credentials: "include",
//       });

//       return retryResponse;
//     } else {
//       // Refresh token failed. Maybe user session is really expired.
//       //logout and cookie clear
//       throw new Error("Session expired. Please login again.");
//     }
//   }

//   return response;
// }

export async function fetchWithAutoRefresh(url, options = {}) {
  const accessToken = localStorage.getItem("accessToken");
  console.log(url, options);
  console.log(accessToken, "dkfkdjkfjdjfdjfjdj");
  // Set headers (merge existing headers)
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${accessToken}`,
    // "Content-Type": "application/json", // Assume JSON body by default
  };

  console.log(headers);

  // Initial request
  let response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Send cookies (refresh token)
  });

  console.log(url, options);

  // If access token is expired
  if (response.status === 401) {
    console.warn("Access token expired, trying to refresh...");

    // Try to refresh access token using refresh token (stored in cookie)
    const refreshRes = await fetch(`${SERVER_URL}/refresh`, {
      method: "POST",
      Authorization: `Bearer ${accessToken}`,
      credentials: "include", // Important: send refresh cookie
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      const newAccessToken = data.access_token;

      // Save new access token
      cookie.save("token", newAccessToken, { path: "/" });

      // Retry original request with new token
      const retryHeaders = {
        ...(options.headers || {}),
        Authorization: `Bearer ${newAccessToken}`,
        "Content-Type": "application/json",
      };

      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
        credentials: "include",
      });

      return response;
    } else {
      // Refresh failed - user needs to login again

      throw new Error("Session expired. Please log in again.");
    }
  }

  return response;
}
const refreshAccessToken = async () => {
  const res = await fetch("http://localhost:8000/refresh", {
    method: "POST",
    credentials: "include",  // Required for sending HttpOnly cookies
  });

  const data = await res.json();

  if (res.ok && data.access_token) {
    localStorage.setItem("access_token", data.access_token);
    return true;
  }

  return false;
};
const authFetch = async (url, method = "GET", body = null) => {
  const token = localStorage.getItem("accessToken");

 
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // use access token here
  };

  const options = {
    method,
    headers,
    credentials: "include",  // <-- important for cookie-based refresh!
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (response.status === 401) {
    // Token might be expired → try refreshing
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry original request after refresh
      return authFetch(url, method, body);
    }
    else{
      //  there will be the logout functionlity local storage cleare and logout function call to the backendautomatically
    }
  }

  return response.json();
};




const SideNav = ({
  isCollapsed,
  toggleCollapse,
  activeView,
  setActiveView,
}) => {
  const navItems = [
    { icon: <FaStar />, label: "Starred" },
    { icon: <FaExclamationTriangle />, label: "Urgent Tasks" },
    { icon: <FaCalendarAlt />, label: "Calendar" },
    { icon: <FaPalette />, label: "Theme" },
    { icon: <FaCommentDots />, label: "Feedback" },
    { icon: <FaQuestionCircle />, label: "FAQ" },
    { icon: <FaCog />, label: "Settings" },
  ];

  return (
    <div className={`${styles.sidenav} ${isCollapsed ? styles.collapsed : ""}`}>
      <button className={styles.hamburger} onClick={toggleCollapse}>
        {isCollapsed ? <FaBars /> : <FaTimes />}
      </button>
      {navItems.map((item, idx) => (
        <div
          key={idx}
          className={`${styles.navItem} ${
            activeView === item.label ? styles.active : ""
          }`}
          onClick={() => setActiveView(item.label)}
        >
          {item.icon}
          {!isCollapsed && <span>{item.label}</span>}
        </div>
      ))}
    </div>
  );
};

const TopMenu = ({
  activeCategory,
  setActiveCategory,
  onAddCategory,
  categories,
  activeView,
  setActiveView,
}) => {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const profileRef = useRef(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfilePopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollByAmount = 100; // scroll step

  const handleScrollLeft = () => {
    scrollRef.current.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
  };

  const handleScrollRight = () => {
    scrollRef.current.scrollBy({ left: scrollByAmount, behavior: "smooth" });
  };

  return (
    <div className={styles.topmenu}>
      {/* <div className={styles.title}>TaskNest</div> */}
      <img className={styles.logo} src={logo}></img>

      <div className={styles.menuItemsWrapper}>
        <FaChevronLeft
          className={styles.arrowIcon}
          onClick={handleScrollLeft}
        />
        <div className={styles.menuItems} ref={scrollRef}>
          {categories.map((item, idx) => (
            <span
              key={idx}
              className={
                item === activeCategory
                  ? styles.activeMenuItem
                  : styles.menuItem
              }
              onClick={() => {
                setActiveView("Task List");
                setActiveCategory(item);
              }}
            >
              {item}
            </span>
          ))}
        </div>
        <FaPlus className={styles.addIcon} onClick={onAddCategory} />
        <FaChevronRight
          className={styles.arrowIcon}
          onClick={handleScrollRight}
        />
      </div>

      <div className={styles.topIcons}>
        <FaBell className={styles.icon} />
        <div
          className={styles.profileWrapper}
          ref={profileRef}
          onClick={() => setShowProfilePopup(!showProfilePopup)}
        >
          <FaUserCircle className={styles.icon} />
          {showProfilePopup && (
            <div className={styles.profilePopup}>
              <p>Hi, Shreya</p>
              <p onClick={() => navigate("/myprofile")}>My Profile</p>
              <p onClick={() => navigate("/loginform")}>Logout</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} TaskNest. All rights reserved.</p>
    </footer>
  );
};

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [totalTaskList, setTotalTaskList] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDeadline, setTaskDeadline] = useState(Date.now());
  const [taskPriority, setTaskPriority] = useState("--Select--");
  const [taskDescription, setTaskDescription] = useState("");
  const [activeCategory, setActiveCategory] = useState("Work");
  const [isEditMode, setIsEditMode] = useState(false);
  const [sendReminder, setSendReminder] = useState(false);
  const [editTaskIndex, setEditTaskIndex] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [newCategoryType, setNewCategoryType] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [activeView, setActiveView] = useState("Task List");
  const [editTaskClicked, setEditTaskClicked] = useState(null);

  const filteredTasks = totalTaskList.filter((task) => {
    return task.category_name === activeCategory;
  });
  console.log(filteredTasks);
  useEffect(() => {
    getAllCategories();
    getAllTasks();
  }, []);

  useEffect(() => {
    console.log(totalTaskList);
    const filtered = totalTaskList.filter(
      (task) => task.category_name === activeCategory
    );
    console.log(filtered);
  }, [totalTaskList, activeCategory]);

  useEffect(() => {
    console.log(tasks);
  }, [tasks]);

  useEffect(() => {
    console.log(categories);
    setCategoryList(categories.map((cat) => cat.category_name));
  }, [categories]);

  const getAllTasks = async () => {
    const accessToken = cookie.load("token");
    try{
      const res = authFetch(`${SERVER_URL}/tasks/grouped-by-category`);
      const data = await res.json();
      console.log(data,"huu uaahh");
      setTotalTaskList(data);
      if (res.ok) {
        console.log("tasks fetched successfully");
      } else {
        console.log("unable to fetch");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getAllCategories = async () => {
    try {
      // console.log(cookies.token);
      const data = await authFetch(`${SERVER_URL}/categories`);
      setCategories(data.categories);
      
    } catch (err) {
      console.error(err);
    }
  };

  const addCategory = async () => {
    const categoryToAdd =
      newCategoryType === "Other" ? customCategory : newCategoryType;
    if (categoryToAdd && !categoryList.includes(categoryToAdd)) {
      setCategories((prev) => [...prev, categoryToAdd]);
      setActiveCategory(categoryToAdd);
    }
    const categorypayload = {
      category_name: categoryToAdd,
    };
    try {
      const data= await authFetch(`${SERVER_URL}/category`,"POST",categorypayload);
    
      // try {
      //   const response = await fetch(`${SERVER_URL}/category`, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${cookies.token}`,
      //     },
      //     body: JSON.stringify(categorypayload),
      //   });
      //   const data = await response.json();
     
        getAllCategories();
        setShowCategoryPopup(false);
        setNewCategoryType("");
        setCustomCategory("");
      
    } catch (err) {
      console.error(err);
      setShowCategoryPopup(false);
      setNewCategoryType("");
      setCustomCategory("");
    }
  };

  const handleSaveEdit = async () => {
    const activeCategoryObj = categories.find(
      (cat) => cat.category_name === activeCategory
    );

    const categoryId = activeCategoryObj ? activeCategoryObj.category_id : null;

    const editTask = {
      task_title: taskTitle,
      deadline: taskDeadline,
      priority: taskPriority,
      description: taskDescription,
      status: "Pending",
      starred: false,
      reminder: "2025-04-26T16:50:35.025Z",
      category_id: categoryId,
    };

    
    try {
      const data = await authFetch(
        `${SERVER_URL}/task/${editTaskClicked.task_id}`,"PUT",editTask)
       ;
      
      
      
      
        getAllTasks();
        setShowPopup(false);
      
    } catch (err) {
      console.error(err);
      setShowPopup(false);
    }
  };

  const handleSave = async () => {
    const activeCategoryObj = categories.find(
      (cat) => cat.category_name === activeCategory
    );

    const categoryId = activeCategoryObj ? activeCategoryObj.category_id : null;

    const newTask = {
      task_title: taskTitle,
      deadline: taskDeadline,
      priority: taskPriority,
      description: taskDescription,
      status: "Pending",
      starred: false,
      reminder: "2025-04-26T16:50:35.025Z",
      category_id: categoryId,
    };

    console.log(cookies.token);
    try {
      const data = await authFetch(`${SERVER_URL}/task`,"POST" ,newTask);
     
      // try {
      //   const response = await fetch(`${SERVER_URL}/task`, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${cookies.token}`,
      //     },
      //     body: JSON.stringify(newTask),
      //   });
      //   const data = await response.json();
      console.log(data);
     
        console.log("task added successfully");
        getAllTasks();
      
    } catch (err) {
      console.error(err);
    }

    setTaskTitle("");
    setSelectedCategory("");
    setTaskDeadline("");
    setTaskDescription("");
    setIsEditMode(false);
    setEditTaskIndex(null);
    setShowPopup(false);
  };

  // const handleEdit = (index, taskId) => {
  //   setIsEditMode(true);
  //   // setEditTaskIndex(idx);
  //   setTaskTitle();
  //   setSelectedCategory();
  //   setTaskDeadline();
  //   setTaskDescription();
  //   setShowPopup(true);
  //   handleSave(taskId);
  // };

  const handleDelete = async (index, taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmDelete) {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
    }
    try {
      const data = await authFetch(`${SERVER_URL}/task/${taskId}`,"DELETE");
      
      // try {
      //   const response = await fetch(`${SERVER_URL}/task/${taskId}`, {
      //     method: "DELETE",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${cookies.token}`,
      //     },
      //   });
      //   const data = await response.json();
     
        getAllTasks();
      
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStar = async (index, category, taskId) => {
    console.log(index, category, typeof category);
    const updatedTasks = [...totalTaskList];
    let currentstarredstatus = false;
    for (let i = 0; i < updatedTasks.length; i++) {
      console.log(
        "hi ",
        updatedTasks[i].category,
        typeof updatedTasks[i].category
      );
      if (updatedTasks[i].category_name === category) {
        updatedTasks[i].tasks[index].starred =
          !updatedTasks[i].tasks[index].starred;
        currentstarredstatus = updatedTasks[i].tasks[index].starred;
      }
    }

    const starPayload = {
      starred: !currentstarredstatus,
    };
    try {
      const data= await authFetch(
        `${SERVER_URL}/task/${taskId}/star`,"PATCH",starPayload);
       
     
      // try {
      //   const response = await fetch(`${SERVER_URL}/task/${taskId}/star`, {
      //     method: "PATCH",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${cookies.token}`,
      //     },
      //     body: JSON.stringify(starPayload),
      //   });
      //   const data = await response.json();
      
    } catch (err) {
      console.error(err);
    }
    setTotalTaskList(updatedTasks);
  };

  const toggleComplete = async (index, task, category, taskId) => {
    console.log(index, taskId, category, typeof category);
    const updatedTasks = [...totalTaskList];
    let currentstatus = "";
    for (let i = 0; i < updatedTasks.length; i++) {
      console.log(
        "hi ",
        updatedTasks[i].category_name,
        typeof updatedTasks[i].category_name
      );
      if (updatedTasks[i].category_name === category) {
        if (updatedTasks[i].tasks[index].status !== "Completed") {
          updatedTasks[i].tasks[index].status = "Completed";
          currentstatus = updatedTasks[i].tasks[index].status;
        } else {
          if (!isOverdue(task)) {
            updatedTasks[i].tasks[index].status = "Pending";
            currentstatus = updatedTasks[i].tasks[index].status;
          } else {
            updatedTasks[i].tasks[index].status = "Deadline over";
            currentstatus = updatedTasks[i].tasks[index].status;
          }
        }
      }
    }

    const statusPayload = {
      status: currentstatus,
    };
    try {
      const data = await authFetch(
        `${SERVER_URL}/task/${taskId}/status`,"PATCH",statusPayload);
       
     
      // try {
      //   const response = await fetch(`${SERVER_URL}/task/${taskId}/status`, {
      //     method: "PATCH",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${cookies.token}`,
      //     },
      //     body: JSON.stringify(statusPayload),
      //   });
      //   const data = await response.json();
      
    } catch (err) {
      console.error(err);
    }
    console.log(updatedTasks);
    setTotalTaskList(updatedTasks);
  };

  const handleClickOutside = (e) => {
    if (e.target.classList.contains(styles.popupOverlay)) {
      setShowPopup(false);
      setIsEditMode(false);
      setActiveCategory(activeCategory);
      setTaskTitle("");
      setTaskDeadline("");
      setTaskDescription("");
    }
  };

  const isOverdue = (task) => {
    const taskDate = new Date(task.deadline);
    const today = new Date();
    taskDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  return (
    <div className={styles.dashboardContainer}>
      <TopMenu
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={categoryList}
        onAddCategory={() => setShowCategoryPopup(true)}
        activeView={activeView}
        setActiveView={setActiveView}
      />
      <div className={styles.mainContainer}>
        <SideNav
          isCollapsed={collapsed}
          toggleCollapse={() => setCollapsed(!collapsed)}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <div className={styles.mainContent}>
          <div className={styles.pageContent}>
            {activeView === "Calendar" && (
              <div className={styles.calendarDeadline}>
                <div>
                  <MyCalendar
                    tasks={tasks}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                  />
                  <div>
                    <p
                      style={{
                        paddingTop: "15px",
                        fontWeight: "bold",
                        color: "gray",
                      }}
                    >
                      Events
                    </p>
                    {/* {tasks.filter(
                    (task) =>
                      new Date(task.deadline).toDateString() ===
                        selectedDate.toDateString() &&
                      task.category === "Events"
                  ).length === 0 ? ( */}
                    {totalTaskList
                      .flatMap((category) =>
                        category.tasks.map((task, taskIdx) => ({
                          ...task,
                          category_name: category.category_name, // 👈 attach category name to each task
                          originalIndex: taskIdx,
                        }))
                      )
                      .filter((task) => {
                        console.log(
                          new Date(task.deadline).toDateString(),
                          selectedDate.toDateString()
                        );
                        return (
                          new Date(task.deadline).toDateString() ===
                            selectedDate.toDateString() &&
                          task.category_name === "Events"
                        );
                      }).length === 0 ? (
                      <div className={styles.noevents}>
                        No Events on this day.
                      </div>
                    ) : (
                      <ul>
                        {/* {tasks
                        .filter(
                          (task) =>
                            new Date(task.deadline).toDateString() ===
                              selectedDate.toDateString() &&
                            task.category === "Events"
                        )
                        .map((task, idx) => ( */}
                        {totalTaskList
                          .flatMap((category) =>
                            category.tasks.map((task, taskIdx) => ({
                              ...task,
                              category_name: category.category_name, // 👈 attach category name to each task
                              originalIndex: taskIdx,
                            }))
                          )
                          .filter((task) => {
                            console.log(
                              new Date(task.deadline).toDateString(),
                              selectedDate.toDateString()
                            );
                            return (
                              new Date(task.deadline).toDateString() ===
                                selectedDate.toDateString() &&
                              task.category_name === "Events"
                            );
                          })
                          .map((task, idx) => (
                            <div key={idx} className={styles.eventItem}>
                              <p>{task.task_title}</p>
                            </div>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className={styles.deadlineTasks}>
                  <h3 className={styles.calendarTaskListTitle}>
                    Deadlines on {selectedDate.toDateString()}
                  </h3>
                  {totalTaskList
                    .flatMap((category) =>
                      category.tasks.map((task, taskIdx) => ({
                        ...task,
                        category_name: category.category_name, // 👈 attach category name to each task
                        originalIndex: taskIdx,
                      }))
                    )
                    .filter((task) => {
                      console.log(
                        new Date(task.deadline).toDateString(),
                        selectedDate.toDateString()
                      );
                      return (
                        new Date(task.deadline).toDateString() ===
                          selectedDate.toDateString() &&
                        task.category_name !== "Events"
                      );
                    }).length === 0 ? (
                    <div className={styles.nodeadline}>
                      No tasks due on this day.
                    </div>
                  ) : (
                    <ul>
                      {/* {tasks
                      .filter(
                        (task) =>
                          new Date(task.deadline).toDateString() ===
                            selectedDate.toDateString() &&
                          task.category !== "Events"
                      )
                      .map((task, idx) => (
                        <div key={idx} className={styles.deadlineTaskItem}>
                          <p>{task.title}</p>
                          <div className={styles.deadlineTaskCategory}>
                            {task.category}
                          </div>
                        </div>
                      ))} */}
                      {totalTaskList
                        .flatMap((category) =>
                          category.tasks.map((task, taskIdx) => ({
                            ...task,
                            category_name: category.category_name, // 👈 attach category name to each task
                            originalIndex: taskIdx,
                          }))
                        )
                        .filter((task) => {
                          console.log(
                            new Date(task.deadline).toDateString(),
                            selectedDate.toDateString()
                          );
                          return (
                            new Date(task.deadline).toDateString() ===
                              selectedDate.toDateString() &&
                            task.category_name !== "Events"
                          );
                        })
                        .map((task, idx) => (
                          <div key={idx} className={styles.deadlineTaskItem}>
                            <p>{task.task_title}</p>
                          </div>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {activeView === "Starred" && (
              <>
                <h2 className={styles.taskListTitle}>Starred Tasks</h2>
                {totalTaskList
                  .flatMap((category) => category.tasks)
                  .filter((task) => task.starred).length === 0 ? (
                  <p>No starred tasks right now!</p>
                ) : (
                  <ul className={styles.taskList}>
                    {totalTaskList
                      .flatMap((category) =>
                        category.tasks.map((task, taskIdx) => ({
                          ...task,
                          category_name: category.category_name, // 👈 attach category name to each task
                          originalIndex: taskIdx,
                        }))
                      )
                      .filter((task) => task.starred)
                      .map((task, idx) => {
                        let bgColorStatus = "rgb(218, 218, 218)";
                        if (task.status === "Completed")
                          bgColorStatus = "rgb(192, 255, 192)";
                        else if (isOverdue(task))
                          bgColorStatus = "rgb(255, 217, 215)";

                        return (
                          <div
                            key={idx}
                            className={`${styles.taskItem} ${styles.taskDefault}`}
                          >
                            <div
                              className={`${styles.statusIndicator}`}
                              style={{ backgroundColor: bgColorStatus }}
                            >
                              {task.status === "Completed" ? (
                                <div className={styles.completedStatus}>
                                  <FaRegCheckCircle
                                    className={styles.statusIcon}
                                  />
                                  <span>Completed</span>
                                </div>
                              ) : isOverdue(task) ? (
                                <div className={styles.overdueStatus}>
                                  <FaExclamationCircle
                                    className={styles.statusIcon}
                                  />
                                  <span>Deadline Over</span>
                                </div>
                              ) : (
                                <div className={styles.pendingStatus}>
                                  <FaClock className={styles.statusIcon} />
                                  <span>Pending</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <h3>{task.task_title}</h3>
                              <p>{task.category_name}</p>
                              <p>
                                Deadline:{" "}
                                {new Date(task.deadline).toLocaleDateString(
                                  "en-GB"
                                )}
                              </p>
                              <p>{task.description}</p>
                            </div>

                            <div className={styles.taskActions}>
                              <FaEdit
                                className={styles.iconBtn}
                                title="Edit"
                                onClick={() => {
                                  setIsEditMode(true);
                                  setEditTaskIndex(idx);
                                  setTaskTitle(task.title);
                                  setSelectedCategory(task.category);
                                  setTaskDeadline(task.deadline);
                                  setTaskDescription(task.description);
                                  setShowPopup(true);
                                }}
                              />
                              <FaTrash
                                className={styles.iconBtn}
                                title="Delete"
                                onClick={() => handleDelete(idx)}
                              />
                              <FaStar
                                className={`${styles.iconBtn} ${
                                  task.starred ? styles.starred : ""
                                }`}
                                title={
                                  task.starred ? "Unstar Task" : "Star Task"
                                }
                                onClick={() =>
                                  toggleStar(
                                    idx,
                                    task.category_name,
                                    task.task_id
                                  )
                                }
                              />

                              <FaCheckCircle
                                className={`${styles.iconBtn} ${
                                  task.status === "Completed"
                                    ? styles.completed
                                    : ""
                                }`}
                                title={
                                  task.status === "Completed"
                                    ? "Mark as Incomplete"
                                    : "Mark as Done"
                                }
                                onClick={() =>
                                  toggleComplete(
                                    task.originalIndex,
                                    task,
                                    task.category_name,
                                    task.task_id
                                  )
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                  </ul>
                )}
              </>
            )}

            {activeView === "Urgent Tasks" && (
              <>
                <h2 className={styles.taskListTitle}>Urgent Tasks</h2>
                {totalTaskList
                  .flatMap((category) => category.tasks)
                  .filter((task) => task.priority === "high").length === 0 ? (
                  <p>No urgent tasks right now!</p>
                ) : (
                  <ul className={styles.taskList}>
                    {totalTaskList
                      .flatMap((category) =>
                        category.tasks.map((task, taskIdx) => ({
                          ...task,
                          category_name: category.category_name, // 👈 attach category name to each task
                          originalIndex: taskIdx,
                        }))
                      )
                      .filter((task) => task.priority === "high")
                      .map((task, idx) => {
                        let bgColorStatus = "rgb(218, 218, 218)";
                        if (task.status === "Completed")
                          bgColorStatus = "rgb(192, 255, 192)";
                        else if (isOverdue(task))
                          bgColorStatus = "rgb(255, 217, 215)";

                        return (
                          <div
                            key={idx}
                            className={`${styles.taskItem} ${styles.taskDefault}`}
                          >
                            <div
                              className={`${styles.statusIndicator}`}
                              style={{ backgroundColor: bgColorStatus }}
                            >
                              {task.status === "Completed" ? (
                                <div className={styles.completedStatus}>
                                  <FaRegCheckCircle
                                    className={styles.statusIcon}
                                  />
                                  <span>Completed</span>
                                </div>
                              ) : isOverdue(task) ? (
                                <div className={styles.overdueStatus}>
                                  <FaExclamationCircle
                                    className={styles.statusIcon}
                                  />
                                  <span>Deadline Over</span>
                                </div>
                              ) : (
                                <div className={styles.pendingStatus}>
                                  <FaClock className={styles.statusIcon} />
                                  <span>Pending</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <h3>{task.task_title}</h3>
                              <p>{task.category_name}</p>
                              <p>
                                Deadline:{" "}
                                {new Date(task.deadline).toLocaleDateString(
                                  "en-GB"
                                )}
                              </p>
                              <p>{task.description}</p>
                            </div>

                            <div className={styles.taskActions}>
                              <FaEdit
                                className={styles.iconBtn}
                                title="Edit"
                                onClick={() => {
                                  setIsEditMode(true);
                                  setEditTaskIndex(idx);
                                  setTaskTitle(task.title);
                                  setSelectedCategory(task.category);
                                  setTaskDeadline(task.deadline);
                                  setTaskDescription(task.description);
                                  setShowPopup(true);
                                }}
                              />
                              <FaTrash
                                className={styles.iconBtn}
                                title="Delete"
                                onClick={() => handleDelete(idx)}
                              />
                              <FaStar
                                className={`${styles.iconBtn} ${
                                  task.starred ? styles.starred : ""
                                }`}
                                title={
                                  task.starred ? "Unstar Task" : "Star Task"
                                }
                                onClick={() =>
                                  toggleStar(
                                    idx,
                                    task.category_name,
                                    task.task_id
                                  )
                                }
                              />

                              <FaCheckCircle
                                className={`${styles.iconBtn} ${
                                  task.status === "Completed"
                                    ? styles.completed
                                    : ""
                                }`}
                                title={
                                  task.status === "Completed"
                                    ? "Mark as Incomplete"
                                    : "Mark as Done"
                                }
                                onClick={() =>
                                  toggleComplete(
                                    task.originalIndex,
                                    task,
                                    task.category_name,
                                    task.task_id
                                  )
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                  </ul>
                )}
              </>
            )}

            {activeView === "Task List" && (
              <>
                {" "}
                <h2 className={styles.taskListTitle}>Task List</h2>
                {filteredTasks.length === 0 ? (
                  <p>No tasks available. Add a new task!</p>
                ) : (
                  <ul className={styles.taskList}>
                    {filteredTasks[0].tasks.map((task, idx) => {
                      let bgColorStatus = "rgb(218, 218, 218)";
                      if (task.status === "Completed")
                        bgColorStatus = "rgb(192, 255, 192)";
                      else if (isOverdue(task))
                        bgColorStatus = "rgb(255, 217, 215)";

                      return (
                        <div
                          key={idx}
                          className={`${styles.taskItem} ${styles.taskDefault}`}
                        >
                          <div
                            className={`${styles.statusIndicator}`}
                            style={{ backgroundColor: bgColorStatus }}
                          >
                            {task.status === "Completed" ? (
                              <div className={styles.completedStatus}>
                                <FaRegCheckCircle
                                  className={styles.statusIcon}
                                />
                                <span>Completed</span>
                              </div>
                            ) : isOverdue(task) ? (
                              <div className={styles.overdueStatus}>
                                <FaExclamationCircle
                                  className={styles.statusIcon}
                                />
                                <span>Deadline Over</span>
                              </div>
                            ) : (
                              <div className={styles.pendingStatus}>
                                <FaClock className={styles.statusIcon} />
                                <span>Pending</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3>{task.task_title}</h3>
                            <p>{filteredTasks[0].category_name}</p>
                            <p>
                              Deadline:{" "}
                              {new Date(task.deadline).toLocaleDateString(
                                "en-GB"
                              )}
                            </p>
                            <p>{task.description}</p>
                          </div>

                          <div className={styles.taskActions}>
                            <FaEdit
                              className={styles.iconBtn}
                              title="Edit"
                              onClick={() => {
                                setIsEditMode(true);
                                setEditTaskIndex(idx);
                                setTaskTitle(task.task_title);
                                setSelectedCategory(task.category);
                                setTaskDeadline(task.deadline);
                                setTaskDescription(task.description);
                                setShowPopup(true);
                                setEditTaskClicked(task);
                              }}
                              // onClick={handleEdit(idx, task)}
                            />
                            <FaTrash
                              className={styles.iconBtn}
                              title="Delete"
                              onClick={() => handleDelete(idx, task.task_id)}
                            />
                            <FaStar
                              className={`${styles.iconBtn} ${
                                task.starred ? styles.starred : ""
                              }`}
                              title={task.starred ? "Unstar Task" : "Star Task"}
                              onClick={() =>
                                toggleStar(
                                  idx,
                                  filteredTasks[0].category_name,
                                  task.task_id
                                )
                              }
                            />

                            <FaCheckCircle
                              className={`${styles.iconBtn} ${
                                task.status === "Completed"
                                  ? styles.completed
                                  : ""
                              }`}
                              title={
                                task.status === "Completed"
                                  ? "Mark as Incomplete"
                                  : "Mark as Done"
                              }
                              onClick={() =>
                                toggleComplete(
                                  idx,
                                  task,
                                  filteredTasks[0].category_name,
                                  task.task_id
                                )
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </ul>
                )}
              </>
            )}

            {activeView === "Theme" && <Theme />}
            {activeView === ""}
            {showCategoryPopup && (
              <div
                className={styles.popupOverlay}
                onClick={(e) =>
                  e.target.classList.contains(styles.popupOverlay) &&
                  setShowCategoryPopup(false)
                }
              >
                <div className={styles.popupModal}>
                  <h2 className={styles.popupTitle}>Add a New Category</h2>

                  <select
                    value={newCategoryType}
                    onChange={(e) => setNewCategoryType(e.target.value)}
                    className={styles.popupInput}
                  >
                    <option value="">Select Category Type</option>
                    <option value="Jobs">Jobs</option>
                    <option value="Academics">Academics</option>
                    <option value="Dayout">Dayout</option>
                    <option value="Home">Home</option>
                    <option value="Other">Other</option>
                  </select>

                  {newCategoryType === "Other" && (
                    <input
                      type="text"
                      className={styles.popupInput}
                      placeholder="Enter new category name"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                    />
                  )}

                  <div className={styles.popupButtons}>
                    <button className={styles.popupBtn} onClick={addCategory}>
                      Save
                    </button>
                    <button
                      className={`${styles.popupBtn} ${styles.cancel}`}
                      onClick={() => setShowCategoryPopup(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* <Footer /> */}
        </div>
      </div>

      <ChatbotWidget />
      <button
        className={styles.floatingAddBtn}
        onClick={() => setShowPopup(true)}
      >
        +
      </button>

      {showPopup && (
        <div className={styles.popupOverlay} onClick={handleClickOutside}>
          <div className={styles.popupModal}>
            <h2 className={styles.popupTitle}>
              {isEditMode && activeCategory !== "Events" && "Edit Task"}
              {!isEditMode && activeCategory !== "Events" && "Add New Task"}
              {isEditMode && activeCategory === "Events" && "Edit Event"}
              {!isEditMode && activeCategory === "Events" && "Add New Event"}
            </h2>

            {activeCategory !== "Events" && (
              <input
                type="text"
                placeholder="Task Title"
                className={styles.popupInput}
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            )}

            {activeCategory === "Events" && (
              <input
                type="text"
                placeholder="Event Title"
                className={styles.popupInput}
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            )}

            <input
              value={activeCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.popupInput}
              readOnly
            ></input>

            <input
              type="date"
              className={styles.popupInput}
              value={
                taskDeadline
                  ? new Date(taskDeadline).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => {
                const selectedDate = e.target.value; // format "YYYY-MM-DD"
                if (selectedDate) {
                  const timestamp = new Date(selectedDate).getTime();
                  setTaskDeadline(timestamp);
                }
              }}
            />

            {/* Priority Dropdown */}
            {activeCategory !== "Events" && (
              <select
                className={styles.popupInput}
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            )}

            <textarea
              placeholder="Description"
              className={styles.popupTextarea}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />

            <div className={styles.toggleContainer}>
              <span style={{ color: "#313e63" }}>
                Send email reminder before{" "}
                {!activeCategory === "Events" ? "deadline" : "event"}
              </span>
              <div
                className={`${styles.toggleSwitch} ${
                  sendReminder ? styles.on : ""
                }`}
                onClick={() => setSendReminder((prev) => !prev)}
              >
                <div className={styles.toggleHandle}></div>
              </div>
            </div>

            <div className={styles.popupButtons}>
              <button
                className={styles.popupBtn}
                onClick={() => (isEditMode ? handleSaveEdit() : handleSave())}
              >
                Save
              </button>

              <button
                className={`${styles.popupBtn} ${styles.cancel}`}
                onClick={() => {
                  setShowPopup(false);
                  setIsEditMode(false);
                  setActiveCategory(activeCategory);
                  setTaskTitle("");
                  setTaskDeadline("");
                  setTaskDescription("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
