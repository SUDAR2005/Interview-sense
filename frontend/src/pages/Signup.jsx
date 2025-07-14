import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Signup() {
    const [url, setURL] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate()
    const handleSignUp = (e) => {
        e.preventDefault();
        console.log("Siging in with:",url);
        console.log("Password:",password);
        navigate('/');
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Sign up to <span className="text-[#147fdc] hover:text-[#7883ff]">InterviewSense</span>
        </h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">Skillrack URL</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 hover:ring-blue-500 focus:ring-blue-500"
              placeholder="Copy Skillrack Profile URL"
              value={url}
              onChange={(e) => setURL(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 hover:ring-blue-500 focus:ring-blue-500"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 hover:ring-blue-500 focus:ring-blue-500"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Sign up
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
