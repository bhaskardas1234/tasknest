import React, { useEffect, useState } from "react";
import classes from "./CompleteProfileQverse.module.css";
// import SETU from "../assets/SETULOGO.png";

// import profile from "../assets/profile-img.png";
// import logo from "../assets/Setu-Logo-mobile.png";
// import menumobile from "../assets/menu-icon.png";
import logo from "../assets/setu-logo-short.svg";
import menu from "../assets/menu.svg";
import profile from "../assets/profile.svg";
// import SETU_logo from "../assets/SETU_logo.svg";
import footerSetuIcon from "../assets/setu-logo-web-footer.svg";
import Toastify, { showToast } from "./Toastify";
import { SERVER_URL } from "../index.js";

import { useNavigate, useLocation } from "react-router-dom";

const CompleteProfileQverse = () => {
  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedin: "",
    phone: "",
    experience: "",
    organization: "",
  });

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleChangeNUmber = (e) => {
    const { name, value } = e.target;
  
    // Ensure only numeric values are stored
    const numericValue = value.replace(/\D/g, "");
  
    setFormData({ ...formData, [name]: numericValue });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormData({
      name: formData.name,
      email: formData.email,
      linkedin: formData.linkedin,
      phone: formData.phone,
      experience: formData.experience,
      organization: formData.organization,
    });

    const payload = {
      user_name: formData.name || null,
      profile_image: null,
      institute_or_organization: formData.organization || null,
      phone_no: formData.phone || null,
      linkedin_profile: formData.linkedin || null,
      designation_specialization: null,
      year_of_experience: formData.experience || 0,
      gender: null,
    };
    // setDisabled(true);

    try {
      const response = await fetch(`${SERVER_URL}/update-profile/${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        //console.log("ERROR");
        setError("Failed update profile. Try again.");
        return;
      }

      if (response.ok) {
        //console.log("SUCCESS");
        showToast("User details updated successfully");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      // setDisabled(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/user-results/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        //console.log(data);
        // setUserDetails(data);
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user details");
      }

      //console.log("User details fetched successfully:", data);

      setFormData({
        name: data.user_details?.user_name || "",
        email: data.user_details?.email || "",
        linkedin: data.user_details?.linkedin_profile || "",
        phone: data.user_details?.phone_no || "",
        experience: data.user_details?.year_of_experience || "",
        organization: data.user_details?.institute_or_organization || "",
      });

      return data;
    } catch (error) {
      console.error("Error fetching user details:", error.message);

      return null; // Returns null in case of failure
    }
  };
  const aboutUsRedirect = () => {
    window.open("https://setuschool.com/about", "_blank");
  };
  const RedirectForBusiness = () => {
    window.open("https://setuschool.com/setu-business", "_blank");
  };

  const privacyPolicyRedirect = () => {
    window.open("https://setuschool.com/privacy_policy", "_blank");
  };

  const termsAndConditionsRedirect = () => {
    window.open("https://setuschool.com/terms_condition", "_blank");
  };

  const blogsRedirect = () => {
    window.open("https://setuschool.com/all/blog", "_blank");
  };

  const contactUsRedirect = () => {
    window.open("https://setuschool.com/contact", "_blank");
  };

  const returnAndRefundPolicyRedirect = () => {
    window.open("https://setuschool.com/return_refund", "_blank");
  };

  return (
    <div className={classes["container"]}>
      <Toastify />
      <div className={classes["container"]}>
        <div className={classes["main"]}>
          <div className={classes["header"]}>
            <div className={classes["logo-div"]}>
              <img
                src={footerSetuIcon}
                alt=""
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
                className={classes["logo"]}
              />
              <p className={classes["about-us"]} onClick={aboutUsRedirect}>
                About Us
              </p>
              <p className={classes["about-us"]} onClick={RedirectForBusiness}>
                For Business
              </p>
            </div>
            <div className={classes["header-right"]}>
              {/* <button className={classes["free-assessment"]}>
                Take Free Assessment
              </button> */}
              <button className={classes["login-btn"]}>
                <img src={profile} alt="" className={classes["profile"]} />
              </button>
              <button className={classes["menu-btn"]}>
                <img src={menu} alt="" className={classes["menu"]} />
              </button>
            </div>
          </div>
          <div className={classes["header-div"]}>
            <div className={classes["header-logo"]}>
              <img
                src={logo}
                alt=""
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              />
            </div>
            <div>
              <p className={classes["about-us"]} onClick={aboutUsRedirect}>
                About Us
              </p>
            </div>
            <div>
              <p className={classes["about-us"]} onClick={RedirectForBusiness}>
                For Business
              </p>
            </div>
            <div className={classes["header-right-mobile"]}>
              {/* <div className={classes["free-assment"]}>
                Take Free Assessment
              </div> */}
              {/* <div className={classes["login"]}>login</div> */}
              <button className={classes["login-btn"]}>
                <img src={profile} alt="" className={classes["profile"]} />
              </button>
              <div className={classes[""]}>
                <img src={menu} alt="" />
              </div>
            </div>
          </div>

          <div className={classes["content"]}>
            <p className={classes["heading"]}>Complete your profile</p>
            <p className={classes["sub-heading"]}>
              This platform is frequented by senior industry leaders. By taking
              assessments and building your project portfolio on SETU, you can
              unlock new opportunities with top-tier companies. Maintaining a
              complete profile ensures you appear at the top of their searches.
            </p>
            <form
              onSubmit={handleSubmit}
              className={classes["input-container"]}
            >
              <div className={classes["inp-div"]}>
                <label htmlFor="name" className={classes["inp-level"]}>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your name"
                  className={classes["inp"]}
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className={classes["inp-div"]}>
                <label htmlFor="email" className={classes["inp-level"]}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="heisenberg@gmail.com"
                  className={classes["inp"]}
                  value={email}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className={classes["inp-div"]}>
                <label htmlFor="linkedin" className={classes["inp-level"]}>
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  name="linkedin"
                  id="linkedin"
                  placeholder="Paste your LinkedIn profile"
                  className={classes["inp"]}
                  value={formData.linkedin}
                  onChange={handleChange}
                />
              </div>
              <div className={classes["inp-div"]}>
                <label htmlFor="phone" className={classes["inp-level"]}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  name="phone"
                  id="phone"
                  placeholder="Enter your phone number"
                  className={classes["inp"]}
                  value={formData.phone}
                  onChange={handleChangeNUmber}
                />
              </div>
              <div className={classes["inp-div"]}>
                <label htmlFor="experience" className={classes["inp-level"]}>
                  Years of Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  id="experience"
                  placeholder="Enter your professional tenure"
                  className={classes["inp"]}
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>
              <div className={classes["inp-div"]}>
                <label htmlFor="organization" className={classes["inp-level"]}>
                  Current Organization
                </label>
                <input
                  type="text"
                  name="organization"
                  id="organization"
                  placeholder="Enter your organization"
                  className={classes["inp"]}
                  value={formData.organization}
                  onChange={handleChange}
                />
              </div>
              <div className={classes["btn-div"]}>
                <button
                  type="button"
                  className={classes["later-btn"]}
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Fill later
                </button>
                <button type="submit" className={classes["submit-btn"]}>
                  Submit
                </button>
              </div>
            </form>
          </div>

          <footer className={classes["landing-page-footer"]}>
            <img
              src={footerSetuIcon}
              className={classes["footer-setu-icon"]}
              alt=""
            />

            <p className={classes["email"]}>Email : mitra@setushool.com</p>
            <br />
            <p className={classes["email"]}>Phone & Whatsapp : 8100551189</p>
            <br />
            <p className={classes["address"]}>
              SETU, Awfis co-working space, 6th floor, Phase II, 50, Chowringee
              Road, Elgin, Kolkata, west Bengal 700071{" "}
            </p>

            <br />
            <p className={classes["about-p"]}>About </p>
            <ul className={classes["about-lists"]}>
              <li onClick={aboutUsRedirect}>About us</li>
              <li onClick={blogsRedirect}>Blogs</li>
              <li onClick={contactUsRedirect}>Contacts</li>
              <li onClick={privacyPolicyRedirect}>Privacy Policy</li>
              <li onClick={termsAndConditionsRedirect}>Terms & Conditions</li>
              <li onClick={returnAndRefundPolicyRedirect}>
                Return & Refund Policy
              </li>
            </ul>
          </footer>

          {/* Web Footer */}
          <div className={classes["footer"]}>
            <div className={classes["footer-first"]}>
              <img src={footerSetuIcon} alt="" />
              <p>Email : mitra@setuschool.com</p>
              <p>Phone & Whatsapp : 8100551189</p>
              <p>
                SETU, Awfis co-working space, 6th floor, Phase II,
                <br />
                50, Chowringee Road, Elgin, Kolkata, west Bengal 700071{" "}
              </p>
            </div>

            <div className={classes["footer-last-div"]}>
              <div className={classes["footer-last"]}>
                <p className={classes["footer-about"]}>About</p>
                <p onClick={aboutUsRedirect}>About us</p>
                <p onClick={blogsRedirect}>Blogs</p>
                <p onClick={contactUsRedirect}>Contact us</p>
              </div>
              <div className={classes["footer-last"]}>
                <p onClick={privacyPolicyRedirect}>Privacy Policy</p>
                <p onClick={termsAndConditionsRedirect}>Terms & Conditions</p>
                <p onClick={returnAndRefundPolicyRedirect}>
                  Return & Refund Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfileQverse;
