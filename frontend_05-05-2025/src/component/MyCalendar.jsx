import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./MyCalendar.css";
import { useState } from "react";

// const MyCalendar = () => {
//   const [value, setValue] = useState(new Date());
//   const isSameDay = (a, b) =>
//     a.getFullYear() === b.getFullYear() &&
//     a.getMonth() === b.getMonth() &&
//     a.getDate() === b.getDate();

//   return (
//     <Calendar
//       onChange={setValue}
//       value={value}
//       tileClassName={({ date }) => {
//         const today = new Date();
//         const isToday = isSameDay(date, today);
//         const isSelected = isSameDay(date, value);

//         if (isToday && isSelected) {
//           return "highlight-today-selected";
//         } else if (isToday) {
//           return "highlight-today";
//         } else if (isSelected) {
//           return "highlight-selected";
//         }
//         return null;
//       }}
//     />
//   );
// };

const MyCalendar = ({ tasks, selectedDate, setSelectedDate }) => {
  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <Calendar
      onChange={setSelectedDate}
      value={selectedDate}
      tileClassName={({ date }) => {
        const today = new Date();
        const isToday = isSameDay(date, today);
        const isSelected = isSameDay(date, selectedDate);

        if (isToday && isSelected) return "highlight-today-selected";
        if (isToday) return "highlight-today";
        if (isSelected) return "highlight-selected";

        return null;
      }}
    />
  );
};

export default MyCalendar;
