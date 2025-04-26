import React from "react";
import classes from "./SubCompetency.module.css";

const SubCompetency = ({ label, percentage, color, topic }) => {
  return (
    <>
      <div className={classes["progress-bar-container"]}>
        <div className={classes["progress-label"]}>{label}</div>
        <div className={classes["progress"]}>
          <div className={classes["subcompetency-topic"]}>
            <p className={classes["subcompetency-topic-p"]}>{topic}</p>
          </div>
          <div className={classes["progress-fill-parent"]}>
            <div
              className={classes["progress-fill"]}
              style={{ width: `${percentage}%`, backgroundColor: color }}
            >
              <span className={classes["progress-percentage"]}>
                {percentage} %
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubCompetency;
