// import React, { useEffect, useState } from "react";
// import styles from "./Theme.module.css";

// const Theme = () => {
//   const [isDark, setIsDark] = useState(false);
//   const [primaryColor, setPrimaryColor] = useState("#4f46e5"); // default: indigo

//   useEffect(() => {
//     document.documentElement.style.setProperty("--primary-color", primaryColor);
//     document.body.className = isDark ? styles.dark : styles.light;
//   }, [isDark, primaryColor]);

//   const colorOptions = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.heading}>Theme Settings</h1>

//       {/* Dark Mode Toggle */}
//       <div className={styles.toggleContainer}>
//         <label className={styles.toggleLabel}>
//           <input
//             type="checkbox"
//             checked={isDark}
//             onChange={() => setIsDark(!isDark)}
//           />
//           Enable Dark Mode
//         </label>
//       </div>

//       {/* Color Palette */}
//       <div>
//         <h2 className={styles.subheading}>Primary Color</h2>
//         <div className={styles.colorPalette}>
//           {colorOptions.map((color) => (
//             <button
//               key={color}
//               onClick={() => setPrimaryColor(color)}
//               className={styles.colorButton}
//               style={{
//                 backgroundColor: color,
//                 border:
//                   primaryColor === color
//                     ? "2px solid #000"
//                     : "2px solid transparent",
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Sample Button */}
//       <div className={styles.buttonDemo}>
//         <button
//           className={styles.sampleButton}
//           style={{ backgroundColor: primaryColor }}
//         >
//           Sample Button
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Theme;

import React, { useEffect, useState } from "react";
import styles from "./Theme.module.css";

const Theme = () => {
  const [isDark, setIsDark] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#4f46e5"); // default: indigo

  // Load dark mode preference on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("isDark");
    const storedColor = localStorage.getItem("primaryColor");

    if (storedTheme !== null) {
      setIsDark(JSON.parse(storedTheme));
    }

    if (storedColor) {
      setPrimaryColor(storedColor);
    }
  }, []);

  // Apply theme changes to body
  useEffect(() => {
    // Apply dark/light class globally
    document.body.className = isDark ? "dark" : "light";

    // Apply primary color globally
    document.documentElement.style.setProperty("--primary-color", primaryColor);

    // Store preferences
    localStorage.setItem("isDark", JSON.stringify(isDark));
    localStorage.setItem("primaryColor", primaryColor);
  }, [isDark, primaryColor]);

  const colorOptions = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Theme Settings</h1>

      {/* Dark Mode Toggle */}
      <div className={styles.toggleContainer}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={isDark}
            onChange={() => setIsDark(!isDark)}
          />
          Enable Dark Mode
        </label>
      </div>

      {/* Color Palette */}
      <div>
        <h2 className={styles.subheading}>Primary Color</h2>
        <div className={styles.colorPalette}>
          {colorOptions.map((color) => (
            <button
              key={color}
              onClick={() => setPrimaryColor(color)}
              className={styles.colorButton}
              style={{
                backgroundColor: color,
                border:
                  primaryColor === color
                    ? "2px solid #000"
                    : "2px solid transparent",
              }}
            />
          ))}
        </div>
      </div>

      {/* Sample Button */}
      <div className={styles.buttonDemo}>
        <button
          className={styles.sampleButton}
          style={{ backgroundColor: primaryColor }}
        >
          Sample Button
        </button>
      </div>
    </div>
  );
};

export default Theme;
