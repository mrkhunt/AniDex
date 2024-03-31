import React, { useState } from "react";
import "./chatbox.css";
import axios from "axios";
import ChatBubble from "./ChatBubble";
import ChatBubbleRespond from "./ChatBubbleRespond";

const Chatbox = () => {
    const [chat, setChat] = useState('');
    const [log, setLog] = useState([]);

    const handleChange = (e) => {
        setChat(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (chat.trim() !== "") {
            // Send the user's message to the chatbot
            const newUserMessage = { text: chat, sender: "user" };
            setLog(prevLog => [...prevLog, newUserMessage]);
            setChat(""); // Clear the input field

            try {
                // Send a GET request to the API endpoint to generate a response
                const response = await axios.get("/api/generateStory", {
                    params: { prompt: chat }
                });
                const { story } = response.data;

                // Add the chatbot's response to the messages
                const newChatbotMessage = { text: story, sender: "chatbot" };
                setLog(prevLog => [...prevLog, newChatbotMessage]);
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
                        {/* Check if message text is an object */}
                        {typeof message.text === "object" ? (
                            // If it's an object, render each part of the story
                            message.text.parts.map((part, partIndex) => (
                                <ChatBubble name={"SQuirrel"} time={"11"} text={part.text} />

                            ))
                        ) : (
                            // If it's not an object, just render the text

                            <ChatBubbleRespond time={"11"} text={message.text} />
                        )}
                    </div>
                ))}
            </div>
            <form className="forms" onSubmit={handleSubmit}>
                <input class="shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="chatbox-input" type="text" placeholder="Questions..." value={chat} onChange={handleChange} />
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ask</button>
            </form>
        </>
    )
}

export default Chatbox;
