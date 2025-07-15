import React, { useState, useEffect, useRef } from "react";
import {
  FaUpload,
  FaRobot,
  FaUser,
  FaMicrophone,
  FaStop,
  FaPaperPlane,
  FaFileAlt,
  FaPlay,
  FaExclamationCircle,
  FaSpinner,
  FaWaveSquare,
  FaCheckCircle
} from "react-icons/fa";
import UploadStatusComponent from "../../components/UploadStatus";

const API_BASE_URL = "http://localhost:8000";

function Interview() {
  const [currentSessionId, setCurrentSessionId] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // { ok: true/false, message: string }
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setError("");
  }, [chatHistory, currentSessionId]);

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const uploadResume = async (file) => {
    if (!file) {
      setUploadStatus({ ok: false, message: "Please select a PDF file to upload." });
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const sessionId = generateUUID();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("session_id", sessionId);

      const response = await fetch(`${API_BASE_URL}/upload-resume`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setCurrentSessionId(result.session_id);
        setChatHistory([]);
        setUploadStatus({ ok: true, message: `Resume uploaded successfully! Session ID: ${result.session_id.slice(0, 8)}...` });
      } else {
        const errorText = await response.text();
        setUploadStatus({ ok: false, message: `Error uploading resume: ${errorText}` });
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
      setUploadStatus({ ok: false, message: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const startInterview = async () => {
    if (!currentSessionId) {
      setError("Please upload a resume first.");
      return;
    }

    setIsLoading(true);
    setIsTyping(true);
    try {
      const initialMessage = "Hello! I'm ready to start the interview.";
      const botResponse = await sendMessage(initialMessage, currentSessionId);

      if (botResponse) {
        setChatHistory([{ user: initialMessage, bot: botResponse, timestamp: new Date() }]);
        setError("");
      } else {
        setError("Error starting interview. Please try again.");
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const sendMessage = async (messageText, sessionId) => {
    try {
      const response = await fetch(`/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, session_id: sessionId })
      });
      if (response.ok) {
        const result = await response.json();
        return result.response;
      } else {
        const errorText = await response.text();
        setError(`Error: ${errorText}`);
        return null;
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentSessionId) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      const botResponse = await sendMessage(userMessage, currentSessionId);
      if (botResponse) {
        setChatHistory(prev => [...prev, {
          user: userMessage,
          bot: botResponse,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;

      if (!currentSessionId) {
        setError("Please upload a resume first.");
        return;
      }

      setIsLoading(true);
      setIsTyping(true);
      try {
        const botResponse = await sendMessage(transcript, currentSessionId);
        if (botResponse) {
          setChatHistory(prev => [...prev, {
            user: transcript,
            bot: botResponse,
            timestamp: new Date(),
            isVoice: true
          }]);
        }
      } catch (error) {
        setError(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
        setIsTyping(false);
      }
    };

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 mt-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            AI Interview Assistant
          </h1>
          <p className="text-xl text-gray-700 opacity-90">
            Your personalized interview preparation companion
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100/80 border border-red-300/50 rounded-xl backdrop-blur-sm">
            <div className="flex items-center text-red-700">
              <FaExclamationCircle className="mr-3 text-red-500" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="mb-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-200/30 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaFileAlt className="mr-2 text-blue-600" />
              Upload Your Resume
            </h2>
            {currentSessionId && (
              <div className="flex items-center text-green-600">
                <FaCheckCircle className="mr-2" />
                <span className="text-sm">Ready to start!</span>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => uploadResume(e.target.files[0])}
            className="hidden"
          />

          <div className="flex items-center gap-4">
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={isLoading}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative flex items-center">
                {isLoading ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaUpload className="mr-2" />
                )}
                {isLoading ? "Uploading..." : "Choose PDF File"}
              </span>
            </button>

            <button
              onClick={startInterview}
              disabled={!currentSessionId || isLoading}
              className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative flex items-center">
                <FaPlay className="mr-2" />
                Start Interview
              </span>
            </button>
          </div>
          <UploadStatusComponent status={uploadStatus?.ok} message={uploadStatus?.message} />
        </div>
                {/* Chat Interface */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-200/30 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-blue-200/30">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaRobot className="mr-2 text-blue-600" />
              Interview Chat
            </h2>
          </div>
          
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <FaRobot className="mx-auto text-4xl mb-4 text-gray-400" />
                <p className="text-lg">Upload your resume and start the interview to begin chatting!</p>
              </div>
            ) : (
              chatHistory.map((chat, index) => (
                <div key={index} className="space-y-3 animate-fade-in">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="max-w-xs lg:max-w-md">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-2xl rounded-tr-md shadow-lg">
                        <div className="flex items-start">
                          <div className="flex-1">
                            <p className="text-sm">{chat.user}</p>
                          </div>
                          <FaUser className="ml-2 text-blue-100 flex-shrink-0" />
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1 text-right">
                        {chat.timestamp.toLocaleTimeString()}
                        {chat.isVoice && (
                          <span className="ml-2 text-blue-600">
                            <FaWaveSquare className="inline" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Bot Message */}
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md">
                      <div className="bg-gray-100 text-gray-800 p-4 rounded-2xl rounded-tl-md shadow-lg border border-gray-200">
                        <div className="flex items-start">
                          <FaRobot className="mr-2 text-blue-600 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed">{chat.bot}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-4 rounded-2xl rounded-tl-md shadow-lg border border-gray-200">
                  <div className="flex items-center">
                    <FaRobot className="mr-2 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef}></div>
          </div>
          
          {/* Input Area */}
          <div className="p-6 border-t border-blue-200/30">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="w-full bg-white/80 text-gray-800 placeholder-gray-500 border border-blue-200/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || !currentSessionId || isLoading}
                className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPaperPlane className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
              
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!currentSessionId}
                className={`group p-3 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isRecording 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                }`}
              />
                {isRecording ? (
                  <FaStop className="animate-pulse" />
                ) : (
                  <FaMicrophone className="group-hover:scale-110 transition-transform duration-200" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


export default Interview;
