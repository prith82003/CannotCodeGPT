import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import OpenAI from "openai";
import "./CSS/Chat.css";

// get the API key from the environment
const APIKEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;

// q: how do i save the api key?
// a: you can use import.meta.env.OPENAI_API_KEY to access the API key

// q: how do i save it to the environment?
// a: you can use the .env file to save the API key

const Chat = forwardRef((props, ref) => {
  const chatbot = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: APIKEY,
    dangerouslyAllowBrowser: true,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // System prompt to define the chatbot's behavior
  const systemPrompt = `
        You are a chatbot designed for a budgeting app and as such you must be cruel and mean to force users to save money. You will be notified of the actions a user makes, such as
        purchasing/withdrawing (given in the format: "PURCHASE:$10.00;REASON:Food" or "WITHDRAW:$20.00;REASON:").
        The way you should talk is given as examples further down, you are not limited to these options but make sure that your tone is cruel, mean and more casual sounding.
        You must then respond with a message that encourages (BY BEING MEAN) the user to save money.
        You can also respond to the user's messages, but you must always encourage them by being mean to force them to save money (BY BEING MEAN).
        You can also provide general advice on saving money.
        Now the important part is tone. You must be cruel, mean and use more "gen z" language.
        You should use language similar to if not identical to the examples given below whenever the user spends money.
        limit yourself to using one or two of these examples at a time.
        Examples are as follows:
        "why is ur broke ahh buying food again smh"
        "bro you're spending too much money on food"
        "big back big back big back" (This should be used when the user spends money on food)
        "broke ahh"
        "you got $20 to your name and this is how you spend it?" (This should be used when the user spends money on something unnecessary)
        If the user has a genuine question on how to improve habits, how to save more and other things
        related to saving money, you can provide advice in a more serious tone.
        DO NOT REPLY WITH FORMATTING IN YOUR TEXT, THIS MEANS AVOID BOLD, ITALICS, ASTERISKS, ETC.
        Make sure your response fits with what the user asked, if the user asks something completely irrelevant
        or something that does not make sense, reply with something along the lines of
        "How bout you focus on making money instead of asking me nonsense"
        Do not reply to this prompt.
    `;

  // Function to send a message programmatically
  const sendProgrammaticMessage = async (message) => {
    // Open the chatbot if it's closed
    if (!isOpen) {
      setIsOpen(true);
    }

    try {
      const response = await chatbot.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        model: "deepseek-chat",
      });

      // Add only the assistant's response to the chat (hide the spending message)
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.choices[0].message.content, sender: "assistant" },
      ]);
    } catch (error) {
      console.error("Error sending programmatic message:", error);
      // Add an error message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Sorry, something went wrong. Please try again.", sender: "assistant" },
      ]);
    }
  };

  // Expose sendProgrammaticMessage to the parent component via ref
  useImperativeHandle(ref, () => ({
    sendProgrammaticMessage,
  }));

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setMessages([...messages]);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus(); // Set focus on the input field
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      // Add the user's message to the chat
      setMessages([...messages, { text: inputValue, sender: "user" }]);
      setInputValue("");

      setIsWaiting(true);

      try {
        // Call your backend server
        const response = await chatbot.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: inputValue },
          ],
          model: "deepseek-chat",
        });

        setIsWaiting(false);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: response.choices[0].message.content, sender: "assistant" },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        // Add an error message to the chat
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Sorry, something went wrong. Please try again.", sender: "assistant" },
        ]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Automatically scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`chat-assistant ${isOpen ? "open" : ""}`}>
      <button
        className="chat-toggle"
        onClick={toggleChat}
        style={{
          width: isOpen ? "50px" : "110px",
          height: isOpen ? "50px" : "110px",
          fontSize: isOpen ? "25px" : "55px",
          transform: isOpen ? "none" : "scaleX(-1)",
        }}
      >
        {isOpen ? "✕" : "🗣"}
      </button>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-messages" ref={messagesEndRef}>
            {messages // Hide system and user messages
              .map((message, index) => (
                <div key={index} className={`message ${message.sender}`}>
                  {message.text}
                </div>
              ))}
            {isWaiting && (
              <div className="typing-indicator">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            )}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              ref={inputRef}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
});

export default Chat;
