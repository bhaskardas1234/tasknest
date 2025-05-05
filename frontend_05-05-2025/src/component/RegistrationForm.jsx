import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import styles from "./RegistrationForm.module.css";
import { SERVER_URL } from "..";

const TopMenu = () => {
  const navigate = useNavigate();

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

const RegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("");
  const [institution, setInstitution] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [linkedInURL, setLinkedInURL] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  // const handleLogin = () => {
  //   if (username === "" || password === "") {
  //     alert("username and password is mandatory");
  //   } else if (username === "Shreya" && password === "shreya123") {
  //     navigate("/dashboard");
  //   } else {
  //     alert("wrong username or password");
  //   }
  // };
  const handleRegister = async (event) => {
    event.preventDefault();
    const registerpayload = {
      username: username,
      password: password,
      email: email,
      mode: "user",
      image: "",
      profession: profession,
      institution: institution,
      phone_number: phoneNumber,
      linkedin_url: linkedInURL,
      gender: gender,
      country: country,
    };
    console.log(registerpayload);
    try {
      const response = await fetch(`${SERVER_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerpayload),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        console.log("successfully registered");
        navigate("/loginform");
      } else {
        console.log("unable to register");
      }
    } catch (err) {
      console.error(err);
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
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            className={styles.input}
            onChange={(e) => setUsername(e.target.value)}
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
            onChange={(e) => setProfession(e.target.value)}
          />
          <input
            type="text"
            placeholder="Institution/Organization"
            className={styles.input}
            onChange={(e) => setInstitution(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className={styles.input}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <input
            type="text"
            placeholder="LinkedIn URL"
            className={styles.input}
            onChange={(e) => setLinkedInURL(e.target.value)}
          />
          <select
            className={styles.input}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            className={styles.input}
            type="text"
            placeholder="Country"
            onChange={(e) => setCountry(e.target.value)}
          />
          <button
            type="submit"
            className={styles.loginButton}
            onClick={(e) => handleRegister(e)}
          >
            Register
          </button>
          <p style={{ color: "#6b7280", fontSize: "14px", textAlign: "left" }}>
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
      {/* <Footer /> */}
    </div>
  );
};

export default RegistrationForm;
