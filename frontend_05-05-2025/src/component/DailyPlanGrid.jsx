import styles from "./DailyPlanGrid.module.css"; // You’ll style this later

function DailyPlanGrid({ plan }) {
  const hours = Object.keys(plan);

  return (
    <div className={styles.gridContainer}>
      {hours.map((hour, i) => (
        <div key={i} className={styles.cell}>
          <div className={styles.hour}>{hour}</div>
          <div className={styles.task}>{plan[hour]}</div>
        </div>
      ))}
    </div>
  );
}

export default DailyPlanGrid;
