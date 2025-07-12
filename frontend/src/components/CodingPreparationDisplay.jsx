import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { FaLeaf } from "react-icons/fa";

function CodingPreparationDisplay({ topic }) {
  const [loading, setLoading] = useState(false);  // false by default
  const [data, setData] = useState(null);

  useEffect(() => {
    // If no topic or it's still "default", do nothing:
    if (!topic || topic === "default") {
      setData(null);
      return;
    }

    setLoading(true);

    // Example: adjust URL for your local API + topic
    fetch(`http://127.0.0.1:8000/generate_code?title=${encodeURIComponent(topic)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json(); // <-- parse JSON properly!
      })
      .then((json) => {
        setData(json);  // <-- this is your JSON array
        setLoading(false);
      })
      .catch((error) => {
        console.error("API error:", error);
        setLoading(false);
      });
  }, [topic]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!data) {
    return (
      <div className="text-center mt-4 text-gray-500">
        Please select a concept to get started.
      </div>
    );
  }

    return (
    <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaLeaf /> {topic} Problems
        </h2>

        {Array.isArray(data) && data.length > 0 ? (
        data.map((item, index) => (
            <div key={index} className="mb-6 border p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">{item.question}</h3>

            {item.samples && item.samples[0] && (
                <div className="mb-2">
                <strong>Sample 1:</strong>
                <div className="ml-4">
                    <p><strong>Input:</strong> {item.samples[0].input}</p>
                    <p><strong>Output:</strong> {item.samples[0].output}</p>
                </div>
                </div>
            )}

            {item.samples && item.samples[1] && (
                <div className="mb-2">
                <strong>Sample 2:</strong>
                <div className="ml-4">
                    <p><strong>Input:</strong> {item.samples[1].input}</p>
                    <p><strong>Output:</strong> {item.samples[1].output}</p>
                </div>
                </div>
            )}

            {item.explanation && (
                <div>
                <strong>Explanation:</strong>
                <p>{item.explanation}</p>
                </div>
            )}
            </div>
        ))
        ) : (
        <div className="text-center text-gray-500">
            No problems found. Please pick a valid topic.
        </div>
        )}
    </div>
    );
}
export default CodingPreparationDisplay;
