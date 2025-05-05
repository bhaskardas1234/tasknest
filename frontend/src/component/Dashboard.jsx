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
      <div className={styles.title}>TaskNest</div>

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
  const [collapsed, setCollapsed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  // const categories = ["Work", "Personal", "Wishlist", "Birthday"];
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskPriority, setTaskPriority] = useState("--Select--");
  const [taskDescription, setTaskDescription] = useState("");
  const [activeCategory, setActiveCategory] = useState("Work");
  const [isEditMode, setIsEditMode] = useState(false);
  const [sendReminder, setSendReminder] = useState(false);
  const [editTaskIndex, setEditTaskIndex] = useState(null); // Index of task being edited
  const [categories, setCategories] = useState([
    "Work",
    "Personal",
    "Wishlist",
    "Birthday",
    "Events",
  ]);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [newCategoryType, setNewCategoryType] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  // const [priority, setPriority] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [activeView, setActiveView] = useState("Task List"); // 'tasks', 'calendar', 'starred'
  const filteredTasks = tasks.filter(
    (task) => task.category === activeCategory
  );

  const handleSave = () => {
    const newTask = {
      title: taskTitle,
      category: activeCategory,
      deadline: taskDeadline,
      description: taskDescription,
      isStarred: false,
      completed: false,
      priority: taskPriority,
    };

    console.log(newTask);
    console.log(isEditMode);
    console.log(editTaskIndex);
    console.log(isEditMode && editTaskIndex !== null);
    if (isEditMode && editTaskIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editTaskIndex] = {
        ...newTask,
        isStarred: tasks[editTaskIndex].isStarred,
        completed: tasks[editTaskIndex].completed,
      };
      setTasks(updatedTasks);
    } else {
      // Add new task
      setActiveCategory(activeCategory);
      setTaskTitle("");
      setTaskDeadline("");
      setTaskDescription("");
      setTaskPriority("");
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }

    // Reset all
    setTaskTitle("");
    setSelectedCategory("");
    setTaskDeadline("");
    setTaskDescription("");
    setIsEditMode(false);
    setEditTaskIndex(null);
    setShowPopup(false);
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmDelete) {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
    }
  };

  const toggleStar = (index, category) => {
    console.log(index, category, typeof category);
    const updatedTasks = [...tasks];
    let count = 0;

    for (let i = 0; i < updatedTasks.length; i++) {
      console.log(
        "hi ",
        updatedTasks[i].category,
        typeof updatedTasks[i].category
      );
      if (updatedTasks[i].category === category) {
        count++;
        console.log("hii ", count);
        if (count - 1 === index) {
          console.log("hiiii ");
          updatedTasks[i].isStarred = !updatedTasks[i].isStarred;
          break;
        }
      }
    }

    setTasks(updatedTasks);
  };

  useEffect(() => {
    console.log(tasks);
  }, [tasks]);

  const toggleComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
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
      <SideNav
        isCollapsed={collapsed}
        toggleCollapse={() => setCollapsed(!collapsed)}
        activeView={activeView}
        setActiveView={setActiveView}
      />
      <div className={styles.mainContent}>
        <TopMenu
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categories={categories}
          onAddCategory={() => setShowCategoryPopup(true)}
          activeView={activeView}
          setActiveView={setActiveView}
        />

        <div className={styles.pageContent}>
          {/* {activeView === "Calendar" && (
            <div className={styles.calendarDeadline}>
              <MyCalendar />
              <div>hi</div>
            </div>
          )} */}
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
                  {tasks.filter(
                    (task) =>
                      new Date(task.deadline).toDateString() ===
                        selectedDate.toDateString() &&
                      task.category === "Events"
                  ).length === 0 ? (
                    <p>No Events on this day.</p>
                  ) : (
                    <ul>
                      {tasks
                        .filter(
                          (task) =>
                            new Date(task.deadline).toDateString() ===
                              selectedDate.toDateString() &&
                            task.category === "Events"
                        )
                        .map((task, idx) => (
                          <div key={idx} className={styles.eventItem}>
                            <p>{task.title}</p>
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
                {tasks.filter((task) => {
                  console.log(task.category !== "Events");
                  return (
                    new Date(task.deadline).toDateString() ===
                      selectedDate.toDateString() && task.category !== "Events"
                  );
                }).length === 0 ? (
                  <p>No tasks due on this day.</p>
                ) : (
                  <ul>
                    {tasks
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
                          {/* <strong>{task.title}</strong> - {task.category} */}
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
              {tasks.filter((task) => task.isStarred).length === 0 ? (
                <p>No starred tasks right now!</p>
              ) : (
                <ul className={styles.taskList}>
                  {tasks
                    .filter((task) => task.isStarred)
                    .map((task, idx) => {
                      let bgColorStatus = "rgb(218, 218, 218)";
                      if (task.completed) bgColorStatus = "rgb(192, 255, 192)";
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
                            {task.completed ? (
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
                            <h3>{task.title}</h3>
                            <p>{task.category}</p>
                            <p>Deadline: {task.deadline}</p>
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
                                task.isStarred ? styles.starred : ""
                              }`}
                              title={
                                task.isStarred ? "Unstar Task" : "Star Task"
                              }
                              onClick={() => toggleStar(idx, task.category)}
                            />

                            <FaCheckCircle
                              className={`${styles.iconBtn} ${
                                task.completed ? styles.completed : ""
                              }`}
                              title={
                                task.completed
                                  ? "Mark as Incomplete"
                                  : "Mark as Done"
                              }
                              onClick={() => toggleComplete(idx)}
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
              {tasks.filter((task) => task.priority === "high").length === 0 ? (
                <p>No urgent tasks right now!</p>
              ) : (
                <ul className={styles.taskList}>
                  {tasks
                    .filter(
                      (task) =>
                        task.priority === "high" && task.category !== "Events"
                    )
                    .map((task, idx) => {
                      let bgColorStatus = "rgb(218, 218, 218)";
                      if (task.completed) bgColorStatus = "rgb(192, 255, 192)";
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
                            {task.completed ? (
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
                            <h3>{task.title}</h3>
                            <p>{task.category}</p>
                            <p>Deadline: {task.deadline}</p>
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
                                task.isStarred ? styles.starred : ""
                              }`}
                              title={
                                task.isStarred ? "Unstar Task" : "Star Task"
                              }
                              onClick={() => toggleStar(idx, task.category)}
                            />

                            <FaCheckCircle
                              className={`${styles.iconBtn} ${
                                task.completed ? styles.completed : ""
                              }`}
                              title={
                                task.completed
                                  ? "Mark as Incomplete"
                                  : "Mark as Done"
                              }
                              onClick={() => toggleComplete(idx)}
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
                  {filteredTasks.map((task, idx) => {
                    let bgColorStatus = "rgb(218, 218, 218)";
                    if (task.completed) bgColorStatus = "rgb(192, 255, 192)";
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
                          {task.completed ? (
                            <div className={styles.completedStatus}>
                              <FaRegCheckCircle className={styles.statusIcon} />
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
                          <h3>{task.title}</h3>
                          <p>{task.category}</p>
                          <p>Deadline: {task.deadline}</p>
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
                              task.isStarred ? styles.starred : ""
                            }`}
                            title={task.isStarred ? "Unstar Task" : "Star Task"}
                            onClick={() => toggleStar(idx, task.category)}
                          />

                          <FaCheckCircle
                            className={`${styles.iconBtn} ${
                              task.completed ? styles.completed : ""
                            }`}
                            title={
                              task.completed
                                ? "Mark as Incomplete"
                                : "Mark as Done"
                            }
                            onClick={() => toggleComplete(idx)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </ul>
              )}
            </>
          )}
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
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Wishlist">Wishlist</option>
                  <option value="Birthday">Birthday</option>
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
                  <button
                    className={styles.popupBtn}
                    onClick={() => {
                      const categoryToAdd =
                        newCategoryType === "Other"
                          ? customCategory
                          : newCategoryType;
                      if (
                        categoryToAdd &&
                        !categories.includes(categoryToAdd)
                      ) {
                        setCategories((prev) => [...prev, categoryToAdd]);
                        setActiveCategory(categoryToAdd);
                      }
                      setShowCategoryPopup(false);
                      setNewCategoryType("");
                      setCustomCategory("");
                    }}
                  >
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
        <Footer />
      </div>

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
              {/* {isEditMode && activeCategory === "Events"
                ? "Edit Event"
                : "Add New Event"} */}
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
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
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
              <span style={{ color: "#2b89b5" }}>
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
              <button className={styles.popupBtn} onClick={handleSave}>
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
