import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { FaLeaf, FaCode, FaPlay, FaLightbulb, FaTerminal, FaExclamationTriangle } from "react-icons/fa";

function CodingPreparationDisplay({ topic }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If no topic or it's still "default", do nothing:
    if (!topic || topic === "default") {
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // API call to your backend
    fetch(`http://127.0.0.1:8000/generate_code?title=${encodeURIComponent(topic)}`)
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center">
            <div className="flex justify-center mb-4">
              <FaExclamationTriangle className="text-red-500 text-6xl" />
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
          <FaCode className="mx-auto text-6xl text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Ready to Code?
          </h3>
          <p className="text-gray-500 max-w-md">
            Please select a concept to get started with coding problems and enhance your programming skills.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <FaLeaf className="text-2xl text-green-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              {topic} Problems
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Master your coding skills with these programming challenges
          </p>
        </div>

        {/* Problems Grid */}
        {Array.isArray(data) && data.length > 0 ? (
          <div className="space-y-8">
            {data.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
              >
                {/* Problem Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-semibold text-white leading-tight mb-2">
                        {item.question}
                      </h3>
                      <div className="flex items-center gap-2 text-purple-100">
                        <FaCode className="text-sm" />
                        <span className="text-sm">Programming Challenge</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Problem Content */}
                <div className="p-4 sm:p-6">
                  {/* Sample Cases */}
                  {item.samples && item.samples.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaPlay className="text-green-500" />
                        Sample Test Cases
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {item.samples.slice(0, 2).map((sample, sampleIndex) => (
                          <div
                            key={sampleIndex}
                            className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                          >
                            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                              <span className="font-medium text-gray-700">
                                Sample {sampleIndex + 1}
                              </span>
                            </div>
                            <div className="p-4">
                              <div className="mb-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <FaTerminal className="text-blue-500 text-sm" />
                                  <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                                    Input
                                  </span>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                                  <code className="text-blue-800 font-mono text-sm">
                                    {sample.input}
                                  </code>
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <FaPlay className="text-green-500 text-sm" />
                                  <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                                    Output
                                  </span>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                  <code className="text-green-800 font-mono text-sm">
                                    {sample.output}
                                  </code>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  {item.explanation && (
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-2 mb-3">
                        <FaLightbulb className="text-amber-600" />
                        <span className="font-semibold text-amber-800 text-lg">
                          Explanation
                        </span>
                      </div>
                      <p className="text-amber-800 leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  )}
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
                Please pick a valid topic to see coding problems.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        {data && data.length > 0 && (
          <div className="mt-8 text-center p-6 bg-white rounded-xl shadow-md">
            <p className="text-gray-600">
              • 
              <span className="text-purple-600 font-medium ml-1">
                Happy coding and good luck!
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodingPreparationDisplay;