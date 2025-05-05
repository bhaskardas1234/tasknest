import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./LoginForm.module.css";
import logo from "../assets/logo.png";
import { SERVER_URL } from "..";
import { useCookies } from "react-cookie";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

const TopMenu = () => {
  return (
    <div className={styles.topmenu}>
      <img className={styles.logo} src={logo}></img>
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();
  const handleLogin = async (event) => {
    event.preventDefault();
    if (email === "" || password === "") {
      console.log("email and password is mandatory");
    }
    const loginpayload = {
      email: email,
      password: password,
    };
    console.log(loginpayload);
    try {
      const response = await fetch(`${SERVER_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginpayload),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        console.log("successfully logged in", data.access_token);

        setCookie("token", data.access_token, {
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });
        navigate("/dashboard");
      } else {
        console.log("unable to login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginSuccess = (credentialResponse) => {
    console.log("Login Success", credentialResponse);
    googlefetch(credentialResponse.credential);
  };

  const handleLoginError = () => {
    console.log("Login Failed");
  };

  const googlefetch = async (credential) => {
    const googlepayload = {
      token: credential,
    };
    console.log(googlepayload);
    try {
      const response = await fetch(`${SERVER_URL}/auth/google-auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(googlepayload),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        console.log("successfully logged in using google", data.access_token);

        setCookie("token", data.access_token);
        navigate("/dashboard");
      } else {
        console.log("unable to login using google");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.appContainer}>
      <TopMenu />
      <div className={styles.loginContainer}>
        <h2 className={styles.loginTitle}>Login</h2>
        <form className={styles.loginForm}>
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            onChange={(e) => setEmail(e.target.value)}
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
            onClick={(e) => handleLogin(e)}
          >
            Login
          </button>
          <div className={styles.divider}>
            <span>or</span>
          </div>
          <button className={styles.googleButton}>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className={styles.googleIcon}
            />
            Login with Google
          </button>
          <GoogleOAuthProvider clientId="599450515753-huv81qig80su5ik590ggimtj5gn2jtqe.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
            />
          </GoogleOAuthProvider>

          <p style={{ color: "#6b7280", fontSize: "14px", textAlign: "left" }}>
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
      {/* <Footer /> */}
    </div>
  );
};

export default LoginForm;
