import { useState } from "react";
import Chatbot from "./chatbot"; // Your existing chatbot component
import { MessageCircle, X } from "lucide-react";
import styles from "./ChatbotWidget.module.css";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Popup Window */}
      {isOpen && (
        <div className={styles.chatPopup}>
          <div className={styles.titlecross}>
            <div className={styles.chatwithus}>
              <h4 className="text-sm font-semibold">Chat with us</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeBtn}
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-2">
            <Chatbot />
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(true)}
        // className="fixed bottom-20 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
        className={styles.floatingChatBtn}
        title="Chat"
      >
        <MessageCircle />
      </button>
    </>
  );
};

export default ChatbotWidget;
