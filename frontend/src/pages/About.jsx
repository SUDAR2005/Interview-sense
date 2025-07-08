import React from "react";
import InterviewProcess from "../components/InterviewProcess";

function About() {
  return (
    <section className="flex flex-col items-start px-6 py-10 max-w-6xl mx-auto">
      
      {/* About Title with underline */}
      <div className="mb-8">
        <h1 className="text-3xl mb-8 font-semibold text-gray-800 relative inline-block after:content-[''] after:block after:w-16 after:h-1 after:bg-gray-600 after:mt-2">
          About
        </h1>
        <div className="justify-baseline">
            <span className="text-[#147fdc] hover:text-[#7883ff] hover: cursor-pointer">InterviewSense</span> will act as a prep partner in your interview preparation process.
            It will help the candidates, learn new things and prepare themselves for the placement. The application has In-person interview chatbot to give you a realtime
            interview experience, Aptitude question generator and Coding Question generator based on topic you desire to learn.
        </div>
      </div>

      {/* Interview Process Title with underline */}
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 relative inline-block after:content-[''] after:block after:w-64 after:h-1 after:bg-gray-600 after:mt-2">
          Interview Process at TCE
        </h2>
      </div>

      {/* Flow component */}
      <InterviewProcess />
    </section>
  );
}

export default About;
