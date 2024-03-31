import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatBubble from "./ChatBubble";
import ChatBubbleRespond from "./ChatBubbleRespond";

const Chatbox = ({ currentImage }) => {
  const [chat, setChat] = useState("");
  const [log, setLog] = useState([]);

  useEffect(() => {
    // Simulate a message from the chatbot when the component mounts
    initiateChat();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const initiateChat = async () => {
    try {
      // Send a request to the API endpoint to generate an initial message
      const response = await axios.get("/api/generateStory", {
        params: {
          prompt: `Hello, you are very specifically a ${currentImage.name} specialist in animal conservation. You are talking to students to engage them about SDGs so you are to be as concise as possible. Please reply this message with a concise introduction of yourself and your animal. Strictly be concise in all of your subsequent replies. Concise in this case would mean in 3 sentences or less.`,
        }, // Provide a default prompt here
      });
      const { story } = response.data;

      // Add the chatbot's initial message to the messages
      const initialChatbotMessage = { text: story, sender: "chatbot" };
      setLog((prevLog) => [...prevLog, initialChatbotMessage]);
    } catch (error) {
      console.error("Error generating initial message:", error);
    }
  };

  const handleChange = (e) => {
    setChat(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (chat.trim() !== "") {
      // Send the user's message to the chatbot
      const newUserMessage = { text: chat, sender: "user" };
      setLog((prevLog) => [...prevLog, newUserMessage]);
      setChat(""); // Clear the input field

      try {
        // Send a GET request to the API endpoint to generate a response
        const response = await axios.get("/api/generateStory", {
          params: { prompt: chat },
        });
        const { story } = response.data;

        // Add the chatbot's response to the messages
        const newChatbotMessage = { text: story, sender: "chatbot" };
        setLog((prevLog) => [...prevLog, newChatbotMessage]);
      } catch (error) {
        console.error("Error generating response:", error);
      }
    }
  };

  return (
    <>
      <div className="chat-container">
        {log.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {typeof message.text === "object" ? (
              message.text.parts.map((part, partIndex) => (
                <ChatBubble key={partIndex} text={part.text} />
              ))
            ) : (
              <ChatBubbleRespond key={index} text={message.text} />
            )}
          </div>
        ))}
      </div>
      <form
        className="fixed bottom-[120px] justify-center mx-auto left-[20vw] gap-4"
        onSubmit={handleSubmit}
      >
        <input
          className="shadow appearance-none border rounded w-48 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="chatbox-input"
          type="text"
          placeholder="Questions..."
          value={chat}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Ask
        </button>
      </form>
    </>
  );
};

export default Chatbox;
