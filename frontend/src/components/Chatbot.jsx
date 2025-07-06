import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaRobot } from 'react-icons/fa';
import { BiChat } from 'react-icons/bi'
const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage = { type: 'user', text: input };
    const botReply = { type: 'bot', text: "I'm still learning! 😊" };

    setMessages((prev) => [...prev, userMessage, botReply]);
    setInput('');
  };

  return (
    <>
      {!isChatOpen ? (
        <div className="fixed bottom-4 right-4 z-50 bg-blue-500 p-3 rounded-full shadow-lg">
          <BiChat
            className="text-white text-3xl cursor-pointer"
            onClick={toggleChat}
            title="Open Chatbot"
          />
        </div>
      ) : (
        <div className="fixed bottom-4 right-4 z-50 w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center rounded-t-lg">
            <h2 className="text-lg font-semibold">Interview Sense Chatbot</h2>
            <AiOutlineClose
              onClick={toggleChat}
              className="text-xl cursor-pointer hover:text-red-200"
              title="Close"
            />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-md max-w-xs ${
                  msg.type === 'user'
                    ? 'bg-blue-100 self-end text-right ml-auto'
                    : 'bg-gray-100 text-left mr-auto'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="border-t p-2 flex items-center">
            <input
              type="text"
              className="flex-1 border rounded pb-7 pl-4 text-sm focus:outline-none"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
