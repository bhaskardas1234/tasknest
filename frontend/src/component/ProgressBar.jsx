import React from "react";
import classes from "./ProgressBar.module.css";

const ProgressBar = ({ label, percentage, color }) => {
  return (
    <>
      <div className={classes["progress-bar-container"]}>
        <div className={classes["progress"]}>
          <div
            className={classes["progress-fill"]}
            style={{ width: `${percentage}%`, backgroundColor: color }}
          ></div>
          <div className={classes["progress-percentage"]}>{percentage} %</div>
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
