import React, { useState, useEffect } from "react";
import { FaLeaf, FaCheckCircle, FaLightbulb, FaCode, FaBrain, FaExclamationTriangle } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner.jsx";



function AptitudePreparationDisplay({ topic }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If no topic or it's still "default", do nothing:
    if (!topic || topic === "default" || sessionStorage.getItem('apti') <= 0) {
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // API call to your backend
    fetch(`http://127.0.0.1:8000/generate_aptitude?title=${encodeURIComponent(topic)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json(); 
      })
      .then((json) => {
        setData(json);  
        setLoading(false);
      })
      .catch((error) => {
        console.error("API error:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [topic]);
    
    // fetch("http://127.0.0.1:8000/update",{
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       regNo: sessionStorage.getItem("regNo"),
    //       last_login: sessionStorage.getItem("last_login"),
    //       apti: sessionStorage.getItem('apti'),
    //       coding: sessionStorage.getItem('coding'),
    //       chat_duration: sessionStorage.getItem('chat_duration'),
    //     })
    //   }
    // ).then(res=>{
    //   if (!res.ok) {
    //       throw new Error(`HTTP error! status: ${res.status}`);
    //     }
    //     return res.json(); 
    //   })
    //   .then((json) => {
    //     console.log(json)
    //   })

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <FaBrain className="text-red-500 text-6xl" />
          </div>
          <h3 className="text-xl font-semibold text-red-700 mb-2">
            Error Loading Problems
          </h3>
          <p className="text-red-600 max-w-md mb-4">
            {error}
          </p>
          <p className="text-gray-500 text-sm">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );


  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center">
          <FaBrain className="mx-auto text-6xl text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Ready to Practice?
          </h3>
          <p className="text-gray-500 max-w-md">
            Please select a concept to get started with Aptitude problems and enhance your skills.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <FaBrain className="text-2xl text-green-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              {topic} Problems
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Test your knowledge with these carefully crafted questions
          </p>
        </div>

        {/* Problems Grid */}
        {Array.isArray(data) && data.length > 0 ? (
          <div className="space-y-6">
            {data.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
              >
                {/* Question Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white leading-tight">
                      {item.question}
                    </h3>
                  </div>
                </div>

                {/* Question Content */}
                <div className="p-4 sm:p-6">
                  {/* Options */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wide">
                      Options
                    </h4>
                    <div className="grid gap-2 sm:gap-3">
                      {item.options.map((opt, i) => (
                        <div
                          key={i}
                          className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <span className="text-gray-700 font-medium">
                            {opt}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Answer */}
                  <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCheckCircle className="text-green-600" />
                      <span className="font-semibold text-green-800">
                        Correct Answer
                      </span>
                    </div>
                    <p className="text-green-700 font-medium">
                      {item.answer}
                    </p>
                  </div>

                  {/* Explanation */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaLightbulb className="text-blue-600" />
                      <span className="font-semibold text-blue-800">
                        Explanation
                      </span>
                    </div>
                    <p className="text-blue-700 leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <div className="text-yellow-500 text-5xl mb-4">
                🤔
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Problems Found
              </h3>
              <p className="text-gray-500">
                Please pick a valid topic to see practice problems.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        {data && data.length > 0 && (
          <div className="mt-8 text-center p-6 bg-white rounded-xl shadow-md">
            <p className="text-gray-600">
              • 
              <span className="text-blue-600 font-medium ml-1">
                Keep practicing to improve your skills!
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AptitudePreparationDisplay;