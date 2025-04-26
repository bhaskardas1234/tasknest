import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./LoginForm.module.css";

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

const LoginForm = () => {
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
        <h2 className={styles.loginTitle}>Login</h2>
        <form className={styles.loginForm}>
          <input
            type="text"
            placeholder="Email or Username"
            className={styles.input}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className={styles.loginButton}
            onClick={handleLogin}
          >
            Login
          </button>
          <div className={styles.divider}>or</div>
          <button className={styles.googleButton}>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className={styles.googleIcon}
            />
            Login with Google
          </button>
          <p style={{ color: "#817c7c", fontSize: "14px", textAlign: "left" }}>
            New user? Sign up{" "}
            <a
              href="/registrationform"
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

export default LoginForm;
