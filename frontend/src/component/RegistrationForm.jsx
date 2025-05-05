import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./RegistrationForm.module.css";

const TopMenu = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.topmenu}>
      <div className={styles.title}>TaskNest</div>
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

const RegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = () => {
    if (username === "" || password === "") {
      alert("username and password is mandatory");
    } else if (username === "Shreya" && password === "shreya123") {
      navigate("/dashboard");
    } else {
      alert("wrong username or password");
    }
  };
  return (
    <div className={styles.appContainer}>
      <TopMenu />
      <div className={styles.loginContainer}>
        <h2 className={styles.loginTitle}>Register</h2>
        <form className={styles.loginForm}>
          <input
            type="text"
            placeholder="Name"
            className={styles.input}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Profession"
            className={styles.input}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Institution/Organization"
            className={styles.input}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className={styles.input}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="LinkedIn URL"
            className={styles.input}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select className={styles.input}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input className={styles.input} type="text" placeholder="Country" />
          <button
            type="submit"
            className={styles.loginButton}
            onClick={handleLogin}
          >
            Register
          </button>
          <p style={{ color: "#817c7c", fontSize: "14px", textAlign: "left" }}>
            Have an account? Login{" "}
            <a
              href="/loginform"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              here
            </a>
          </p>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default RegistrationForm;
