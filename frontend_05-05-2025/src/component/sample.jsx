import React from "react";
import styles from "./sample.module.css";
import logo from "../assets/logo.png";
import {
  FaStar,
  FaRegStar,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaCalendarAlt,
  FaPalette,
  FaCommentDots,
  FaQuestionCircle,
  FaCog,
} from "react-icons/fa";

export default function TodoLayout() {
  const tasks = [
    { title: "Buy groceries", starred: true, done: false },
    { title: "Finish report", starred: false, done: true },
    { title: "Team meeting at 3 PM", starred: false, done: false },
  ];

  const renderStatusIcon = (done) =>
    done ? (
      <FaCheckCircle color="#10B981" title="Done" />
    ) : (
      <FaClock title="Pending" />
    );

  return (
    <div className={styles.container}>
      <header className={styles.topbar}>
        <img className={styles.logo} src={logo}></img>
        <div className={styles.userSection}>
          <span className={styles.userText}>Welcome, User</span>
          <button className={styles.logoutButton}>Logout</button>
        </div>
      </header>

      <div className={styles.main}>
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            <a href="#">
              <FaStar /> Starred
            </a>
            <a href="#">
              <FaExclamationCircle /> Urgent
            </a>
            <a href="#">
              <FaCalendarAlt /> Calendar
            </a>
            <a href="#">
              <FaPalette /> Theme
            </a>
            <a href="#">
              <FaCommentDots /> Feedback
            </a>
            <a href="#">
              <FaQuestionCircle /> FAQ
            </a>
            <a href="#">
              <FaCog /> Settings
            </a>
          </nav>
        </aside>

        <main className={styles.content}>
          <h2 className={styles.heading}>Today's Tasks</h2>
          <div className={styles.taskList}>
            {tasks.map((task, index) => (
              <div key={index} className={styles.taskItem}>
                <div className={styles.taskText}>{task.title}</div>
                <div className={styles.taskActions}>
                  <button title="Status" className={styles.iconButton}>
                    {renderStatusIcon(task.done)}
                  </button>
                  <button title="Edit" className={styles.iconButton}>
                    <FaEdit />
                  </button>
                  <button title="Delete" className={styles.iconButton}>
                    <FaTrash />
                  </button>
                  <button title="Star" className={styles.iconButton}>
                    {task.starred ? <FaStar color="#facc15" /> : <FaRegStar />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* <footer className={styles.footer}>
        &copy; 2025 My To-Do App. All rights reserved.
      </footer> */}
    </div>
  );
}
