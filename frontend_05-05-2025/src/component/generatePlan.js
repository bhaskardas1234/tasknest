const generatePlan = (userAnswers) => {
  const {
    wakeUp = "6 AM",
    sleep = "10 PM",
    breakfast = "8 AM",
    lunch = "1 PM",
    dinner = "8 PM",
    workout = "7 AM",
    workoutEnabled = true,
    study = "Morning",
    profession = "Employee",
    workHours = "9 AM - 5 PM",
    schoolHours = "8 AM - 2 PM",
  } = userAnswers;

  const plan = {};

  const to24 = (timeStr) => {
    console.log(timeStr);
    let [time, modifier] = timeStr.split(" ");
    console.log(time);
    console.log(modifier);
    let [h, m] = time.split(":").map(Number);
    console.log(h);
    console.log(m);
    if (!m) m = 0;
    if (modifier === "PM" && h < 12) h += 12;
    if (modifier === "AM" && h === 12) h = 0;
    console.log(h);
    console.log(m);
    return h + m / 60;
  };

  const from24 = (h) => `${((h + 11) % 12) + 1} ${h >= 12 ? "PM" : "AM"}`;

  const startHour = Math.floor(to24(wakeUp));
  const endHour = Math.floor(to24(sleep));

  for (let hour = startHour; hour < endHour; hour++) {
    plan[from24(hour)] = "Free Time";
  }

  plan[breakfast] = "Breakfast";
  plan[lunch] = "Lunch";
  plan[dinner] = "Dinner";

  if (workoutEnabled) {
    plan[workout] = "Workout";
  }

  if (profession === "Employee") {
    const [start, end] = workHours.split(" - ");
    for (let h = Math.floor(to24(start)); h < Math.floor(to24(end)); h++) {
      plan[from24(h)] = "Work";
    }
  }

  if (profession === "School Student") {
    const [start, end] = schoolHours.split(" - ");
    for (let h = Math.floor(to24(start)); h < Math.floor(to24(end)); h++) {
      plan[from24(h)] = "School";
    }
  }

  // Study time based on preference
  const studyHour =
    study === "Morning"
      ? Math.max(startHour + 1, 7)
      : study === "Afternoon"
      ? 15
      : 20;
  plan[from24(studyHour)] = "Study";

  return plan;
};

export default generatePlan;
