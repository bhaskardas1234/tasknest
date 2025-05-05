import { useEffect, useState } from "react";
import generatePlan from "./generatePlan"; // your function to build a plan
import DailyPlanGrid from "./DailyPlanGrid"; // your grid component

function DailyPlanPage() {
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("dailyPlanData");
    if (data) {
      const answers = JSON.parse(data);
      const generatedPlan = generatePlan(answers);
      setPlan(generatedPlan);
    }
  }, []);

  return (
    <div>
      <h2>Your Daily Plan</h2>
      {plan ? <DailyPlanGrid plan={plan} /> : <p>Generating plan...</p>}
    </div>
  );
}

export default DailyPlanPage;
