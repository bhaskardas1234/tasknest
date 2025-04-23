// corrected




import React, { useState, useEffect } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import classes from "./LandingPage.module.css";
import SETU2 from "../assets/SETU2.svg";
import animation from "../assets/animation.gif";
import { useUserActivity } from "../context/UserActivityContext";

const LandingPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();



  // these are topic setu based on
  const words = ["Data", "AI-GenAI", "ML", "Engineering", "Product"];
  const { logActivity, activityHistory, clearActivity } = useUserActivity();
  const location=useLocation()

  useEffect(()=>{
    
    logActivity({
      event: "view_page",
      source_page:`${location.pathname}`,
      activity: `User reached to the website`,
      event_timeline: new Date().toLocaleString(),
    });

  },[])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000); // Change word every 2 seconds
    return () => clearInterval(interval); // Clean up interval on unmount
  }, [words.length]);

  const getStarted = () => {
    navigate("/login");
  };

  return (
    <div className={classes["container"]}>
      <div className={classes["start-container"]}>
        <div className={classes["start"]}>
          <div className={classes["animation"]}>
            <img src={animation} alt="" className={classes["animation-img"]} />
          </div>
          <div className={classes["dive"]}>
            <p className={classes["dive-p"]}>
              Dive into{" "}
              <span className={classes["highlight"]}>
                {words[currentIndex]}
              </span>
            </p>
          </div>
          <div className={classes["test-start"]}>
            <button className={classes["test-start-btn"]} onClick={getStarted}>
              <p>Get started</p>
              <img src={SETU2} alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
