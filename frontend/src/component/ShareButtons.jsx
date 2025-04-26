/* this portion working properly */
import React, { useState, useRef, useEffect } from "react";
import classes from "./ShareButtons.module.css";
import gmail from "../assets/gmailIcon.png";
import whatsapp from "../assets/wpimage.png";
import Linkedin from "../assets/linkdinIcon.png";
import Telegram from "../assets/telegramIcon.png";
import { Copy, X, Check } from "lucide-react";

const ShareButtons = ({
  url,
  title,
  text,
  onClose,
  totalMarks,
  obtainedMarks,
  assessmentname,
}) => {
  const [showSharePopup, setShowSharePopup] = useState(true);
  const [copied, setCopied] = useState(false);
  const popupRef = useRef(null);
  const shareUrl = url; // Replace with your actual URL
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (showSharePopup) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showSharePopup]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toBoldUnicode = (str) => {
    const boldChars = {
      A: "𝐀",
      B: "𝐁",
      C: "𝐂",
      D: "𝐃",
      E: "𝐄",
      F: "𝐅",
      G: "𝐆",
      H: "𝐇",
      I: "𝐈",
      J: "𝐉",
      K: "𝐊",
      L: "𝐋",
      M: "𝐌",
      N: "𝐍",
      O: "𝐎",
      P: "𝐏",
      Q: "𝐐",
      R: "𝐑",
      S: "𝐒",
      T: "𝐓",
      U: "𝐔",
      V: "𝐕",
      W: "𝐖",
      X: "𝐗",
      Y: "𝐘",
      Z: "𝐙",
      a: "𝐚",
      b: "𝐛",
      c: "𝐜",
      d: "𝐝",
      e: "𝐞",
      f: "𝐟",
      g: "𝐠",
      h: "𝐡",
      i: "𝐢",
      j: "𝐣",
      k: "𝐤",
      l: "𝐥",
      m: "𝐦",
      n: "𝐧",
      o: "𝐨",
      p: "𝐩",
      q: "𝐪",
      r: "𝐫",
      s: "𝐬",
      t: "𝐭",
      u: "𝐮",
      v: "𝐯",
      w: "𝐰",
      x: "𝐱",
      y: "𝐲",
      z: "𝐳",
      0: "𝟎",
      1: "𝟏",
      2: "𝟐",
      3: "𝟑",
      4: "𝟒",
      5: "𝟓",
      6: "𝟔",
      7: "𝟕",
      8: "𝟖",
      9: "𝟗",
    };

    return str
      .split("")
      .map((c) => boldChars[c] || c)
      .join("");
  };

  //console.log(toBoldUnicode("Think you can beat me? Prove it."));

  // Gmail Share
  // const handleGmailShare = () => {
  //   const emailBodyUpdated = `Think you can beat me? ${toBoldUnicode(
  //     "Prove it."
  //   )} 💡🔥%0A
  // 📌 ${toBoldUnicode(
  //   "Take the challenge now!"
  // )} ${`https://setuqverse.com/exam-guide?exam_name=${encodeURIComponent(assessmentname)}`} %0A%0A

  // 🎯 ${toBoldUnicode(
  //   "This Assessment Didn’t Just Test Me—It Revealed Me."
  // )}  🎯%0A%0A

  // Just wrapped up my ${assessmentname} assessment at SETU SCHOOL, and let’s just say, it wasn’t your usual “tick-the-box” test. %0A%0A

  // This was a real challenge, testing my ability to apply knowledge, solve problems, and think critically. No hand-holding, no easy wins, just a head-on clash between what I’ve mastered and what still needs work. 💡%0A%0A

  // Final score? ${obtainedMarks}/${totalMarks} 🚀 View my complete scorecard here ${shareUrl} %0A%0A

  // If you’re just collecting certificates, this might not be for you. But if you want to measure your skills where it truly matters, then go ahead.`;
  

  //   const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
  //     title
  //   )}&body=${emailBodyUpdated}`;
  //   window.open(gmailUrl, "_blank");
  // };
  const handleGmailShare = () => {
   
  
    // Function to convert text to bold Unicode
    const toBoldUnicode = (text) => `𝐓𝐚𝐤𝐞 𝐭𝐡𝐞 𝐜𝐡𝐚𝐥𝐥𝐞𝐧𝐠𝐞 𝐧𝐨𝐰!`;
  
    // Construct email body
    const emailBody = `Think you can beat me? ${toBoldUnicode("Prove it.")} 💡🔥
  📌 ${toBoldUnicode("Take the challenge now!")}
  🔗 https://setuqverse.com/exam-guide?exam_name=${encodeURIComponent(assessmentname)}
  
  🎯 ${toBoldUnicode("This Assessment Didn’t Just Test Me—It Revealed Me.")} 🎯
  
  Just wrapped up my ${assessmentname} assessment at SETU SCHOOL, and let’s just say, it wasn’t your usual “tick-the-box” test.
  
  This was a real challenge, testing my ability to apply knowledge, solve problems, and think critically. No hand-holding, no easy wins, just a head-on clash between what I’ve mastered and what still needs work. 💡
  
  Final score? ${obtainedMarks}/${totalMarks} 🚀 View my complete scorecard here: ${shareUrl}
  
  If you’re just collecting certificates, this might not be for you. But if you want to measure your skills where it truly matters, then go ahead.`.trim();
  
    // Encode the email body for the URL
    const encodedEmailBody = encodeURIComponent(emailBody);
  
    // Construct Gmail share URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(title)}&body=${encodedEmailBody}`;
  
    // Open Gmail in a new tab
    window.open(gmailUrl, "_blank");
  };
  


    const handleWhatsAppShare = () => {
      const messagetouser = `Think you can beat me? *Prove it.* 💡🔥
      📌 *Take the challenge now!* ${`https://setuqverse.com/exam-guide?exam_name=${encodeURIComponent(assessmentname)}`} 
      
      *Not all assessments reveal true potential—but this one does.*
      No fluff. No memorization. Just real-world skills put to the test. I scored *${obtainedMarks}/${totalMarks}!* 🚀 View my complete scorecard here: ${shareUrl}
      At *SETU SCHOOL*, they don’t test what I can recall—but what I can do. This challenge pushed my thinking, sharpened my skills, and showed where I stand. Are you up for it?`;
      
    // Ensure emojis remain properly formatted
    const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      messagetouser
    )}`;

    window.open(whatsappLink, "_blank");
  };

  // Telegram Share
  const handleTelegramShare = () => {
    const message = `Think you can beat me? ${toBoldUnicode("Prove it.")} 💡🔥
  📌 ${toBoldUnicode("Take the challenge now!")} ${"https://setuqverse.com/"} 

  🎯 ${toBoldUnicode("This Assessment Didn’t Just Test Me—It Revealed Me.")}  🎯

  Just wrapped up my ${assessmentname} assessment at SETU SCHOOL, and let’s just say, it wasn’t your usual “tick-the-box” test. 

  This was a real challenge, testing my ability to apply knowledge, solve problems, and think critically. No hand-holding, no easy wins, just a head-on clash between what I’ve mastered and what still needs work. 💡

  Final score?  ${obtainedMarks}/${totalMarks} 🚀 View my complete scorecard here ${shareUrl}

  If you’re just collecting certificates, this might not be for you. But if you want to measure your skills where it truly matters, then go ahead.`;

    const telegramLink = `https://t.me/share/url?url=${encodeURIComponent(
      message
    )}`;
    window.open(telegramLink, "_blank");
  };

  // LinkedIn Share
  const handleLinkedInShare = () => {
    const message = `Think you can beat me? ${toBoldUnicode("Prove it.")} 💡🔥
  📌 ${toBoldUnicode("Take the challenge now!")} ${"https://setuqverse.com/"} 

  🎯 ${toBoldUnicode("This Assessment Didn’t Just Test Me—It Revealed Me.")}  🎯

  Just wrapped up my ${assessmentname} assessment at SETU SCHOOL, and let’s just say, it wasn’t your usual “tick-the-box” test. 

  This was a real challenge, testing my ability to apply knowledge, solve problems, and think critically. No hand-holding, no easy wins, just a head-on clash between what I’ve mastered and what still needs work. 💡

  Final score?  ${obtainedMarks}/${totalMarks} 🚀 View my complete scorecard here [shortened link or the result]

  If you’re just collecting certificates, this might not be for you. But if you want to measure your skills where it truly matters, then go ahead.`;

    const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true`;
    window.open(linkedInUrl, "_blank");
  };

  return (
    <>
      {showSharePopup && (
        <div className={classes["popup-overlay"]}>
          <div className={classes["popup-content"]} ref={popupRef}>
            <div className={classes["popup-header"]}>
              <h2>🔗 Share this link</h2>
              <X className={classes["close-icon"]} onClick={onClose} />
            </div>

            {/* Input Field with Copy Button */}
            <div className={classes["input-container"]}>
              <input type="text" value={shareUrl} readOnly />
              <button className={classes["copy-btn"]} onClick={copyToClipboard}>
                <span
                  className={`${classes["icon-wrapper"]} ${
                    copied ? classes["copied"] : ""
                  }`}
                >
                  {copied ? (
                    <Check size={18} color="green" />
                  ) : (
                    <Copy size={18} />
                  )}
                </span>
              </button>
            </div>

            {/* Copied Message */}
            <span
              className={`${classes["copied-message"]} ${
                copied ? classes["show"] : ""
              }`}
            >
              Copied!
            </span>

            {/* Share Buttons */}
            <div className={classes["share-buttons"]}>
              <a
                onClick={handleWhatsAppShare}
                target="_blank"
                rel="noopener noreferrer"
                className={classes["whatsapp"]}
              >
                <img src={whatsapp} alt="" />
              </a>
              <a
                onClick={handleTelegramShare}
                target="_blank"
                rel="noopener noreferrer"
                className={classes["telegram"]}
              >
                <img src={Telegram} alt="" />
              </a>
              <a onClick={handleGmailShare} className={classes["gmail"]}>
                <img src={gmail} alt="" />
              </a>
              {/* <a
                onClick={handleLinkedInShare}
                target="_blank"
                rel="noopener noreferrer"
                className={classes["linkedin"]}
              >
                <img src={Linkedin} alt="" />
              </a> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButtons;
