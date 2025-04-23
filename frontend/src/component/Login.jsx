import React, { useState } from "react";
import ShareButtons from "../component/ShareButtons"; // Ensure correct path
import styles from "./Login.module.css"; // Import CSS for modal

function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const shareUrl = "https://yourwebsite.com";
  const title = "Check out this awesome website!";
  const text = "hellow every one";

  return (
    <div className="App">
      <h1>Welcome to My Share App</h1>
      <button
        className={styles.openModalButton}
        onClick={() => setIsModalOpen(true)}
      >
        Open Share Modal
      </button>

      {/* Modal */}
      {isModalOpen && (
        <ShareButtons
          url={shareUrl}
          title={title}
          text={text}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Login;
