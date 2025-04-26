import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./PageNotFound.module.css";
import access from "../assets/access.png";

const PageNotFound = () => {
  const navigate = useNavigate();
  // const email = JSON.parse(localStorage.getItem("user")).email;

  const goHome = () => {
    navigate("/"); // Navigates to the previous page
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className={classes["container"]}>
      <div className={classes["mcq-container"]}>
        <div className={classes["mid-container"]}>
          <div className={classes["img-container"]}>
            <img src={access} alt="" className={classes["img"]} />
          </div>
          <div className={classes["heading"]}>
            <p>
              404
            </p>
          </div>
          <div className={classes["sub-heading"]}>
            <p>
              Page Not Found
            </p>
          </div>
          <div className={classes["btn-container"]}>
            <button className={classes["btn"]} onClick={goHome}>
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
