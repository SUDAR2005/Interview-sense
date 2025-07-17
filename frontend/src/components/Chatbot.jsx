import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaRobot, FaExclamationTriangle } from 'react-icons/fa';
import { BiChat } from 'react-icons/bi';

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
    // Clear error when opening/closing chat
    setError(null);
  };

  const getErrorMessage = (errorText) => {
    if (errorText.includes('ResourceExhausted') || errorText.includes('429')) {
      return {
        type: 'quota',
        title: 'Daily Limit Reached',
        message: 'You have exceeded your daily quota. Please try again tomorrow or upgrade your plan.',
        action: 'Learn more about API limits',
        link: 'https://ai.google.dev/gemini-api/docs/rate-limits'
      };
    } else if (errorText.includes('401') || errorText.includes('Unauthorized')) {
      return {
        type: 'auth',
        title: 'Authentication Error',
        message: 'There was an issue with authentication. Please check your API key.',
        action: 'Check API documentation',
        link: 'https://ai.google.dev/gemini-api/docs/get-started'
      };
    } else if (errorText.includes('503') || errorText.includes('Service Unavailable')) {
      return {
        type: 'service',
        title: 'Service Temporarily Unavailable',
        message: 'The AI service is temporarily unavailable. Please try again in a few minutes.',
        action: 'Retry',
        link: null
      };
    } else {
      return {
        type: 'general',
        title: 'Something went wrong',
        message: 'An unexpected error occurred. Please try again.',
        action: 'Retry',
        link: null
      };
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { type: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Replace this with your actual API call
      const response = await yourAPICall(input);
      const botReply = { type: 'bot', text: response };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error('Chatbot error:', err);
      setError(getErrorMessage(err.message));
      
      // Add an error message to the chat
      const errorMessage = { 
        type: 'error', 
        text: 'Sorry, I encountered an issue. Please see the error details above.' 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const retryLastMessage = () => {
    setError(null);
    // Get the last user message and resend it
    const lastUserMessage = messages.filter(msg => msg.type === 'user').pop();
    if (lastUserMessage) {
      setInput(lastUserMessage.text);
    }
  };

  const ErrorComponent = ({ error, onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
      <div className="flex items-start">
        <FaExclamationTriangle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-red-800 text-sm">{error.title}</h4>
          <p className="text-red-700 text-xs mt-1">{error.message}</p>
          <div className="mt-2 flex gap-2">
            {error.link && (
              <a
                href={error.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-xs underline"
              >
                {error.action}
              </a>
            )}
            {!error.link && error.action === 'Retry' && (
              <button
                onClick={onRetry}
                className="text-blue-600 hover:text-blue-800 text-xs underline"
              >
                {error.action}
              </button>
            )}
          </div>
        </div>
        <button
          onClick={() => setError(null)}
          className="text-red-400 hover:text-red-600 ml-2"
        >
          <AiOutlineClose size={14} />
        </button>
      </div>
    </div>
  );

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

          {/* Error Display */}
          {error && (
            <div className="p-3 border-b">
              <ErrorComponent error={error} onRetry={retryLastMessage} />
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-md max-w-xs ${
                  msg.type === 'user'
                    ? 'bg-blue-100 self-end text-right ml-auto'
                    : msg.type === 'error'
                    ? 'bg-red-100 text-red-700 text-left mr-auto'
                    : 'bg-gray-100 text-left mr-auto'
                }`}
              >
                {msg.text}
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="bg-gray-100 text-left mr-auto p-2 rounded-md max-w-xs">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                  <span className="text-gray-600">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="border-t p-2 flex items-center">
            <input
              type="text"
              className="flex-1 border rounded pb-7 pl-4 text-sm focus:outline-none"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || input.trim() === ''}
              className="ml-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;