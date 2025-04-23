import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./MyProfile.module.css";

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

const MyProfile = () => {
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/120"
  );
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // sets preview
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      <TopMenu />
      <div className={styles.profileContainer}>
        <h2 className={styles.profileTitle}>My Profile</h2>
        <div className={styles.profileForm}>
          <div className={styles.imageSection}>
            <img
              src={profileImage}
              alt="Profile"
              className={styles.profileImage}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <button
              className={styles.popupBtn}
              onClick={() => fileInputRef.current.click()}
            >
              Change Image
            </button>
          </div>

          <input className={styles.popupInput} type="text" placeholder="Name" />
          <input
            className={styles.popupInput}
            type="email"
            placeholder="Email"
          />
          <input
            className={styles.popupInput}
            type="text"
            placeholder="Profession"
          />
          <input
            className={styles.popupInput}
            type="text"
            placeholder="Institution/Organization"
          />
          <input
            className={styles.popupInput}
            type="tel"
            placeholder="Phone Number"
          />
          <input
            className={styles.popupInput}
            type="text"
            placeholder="LinkedIn URL"
          />
          <select className={styles.popupInput}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            className={styles.popupInput}
            type="text"
            placeholder="Country"
          />

          <div className={styles.buttonRow}>
            <button className={styles.popupBtn}>Save</button>
            <button className={`${styles.popupBtn} ${styles.cancel}`}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyProfile;
