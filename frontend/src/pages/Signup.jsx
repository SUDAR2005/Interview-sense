import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {

  const [url, setURL] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPassCrt, setPassCrt] = useState(null);
  const [isConfmPassCrt, setConfmPassCrt] = useState(null);
  const [isErr,  setErrorStatus] = useState(false);
  const [errMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:8000/signup";
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/;

  const handlePassword = () => {
    const isValid = passwordRegex.test(password);
    setPassCrt(isValid);
    return isValid;
  };

  const handleConfirmPassword = () => {
    const isMatch = password === confirmPassword;
    setConfmPassCrt(isMatch);
    return isMatch;
  };

  const closeErrorPopup = () => {
    // set all the error message to default state
    setURL('');
    setPassword('');
    setConfirmPassword('');

    setErrorStatus(false);
    setErrorMsg('');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const isPasswordValid = handlePassword();
    const isConfirmValid = handleConfirmPassword();

    if (!isPasswordValid || !isConfirmValid) {
      console.warn("Validation failed");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}?url=${encodeURIComponent(url)}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Request failed");
      }
      setErrorStatus(false)
      const data = await response.json();
      console.log("Response Data:", data);
      navigate("/");
    } catch (err) {
      setErrorStatus(true);
      setErrorMsg(err.message);
      console.error("Fetch Error:", err.message);
    }
  };

  return (
    
    <>  
    {isErr && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg relative max-w-sm mx-auto">
            <h2 className="text-xl font-bold mb-4">Error!</h2>
            <p className="mb-4">{errMsg}</p>
            <button
              onClick={closeErrorPopup}
              className="absolute top-2 right-2 text-white hover:text-gray-200 focus:outline-none"
            >
              &times;
            </button>
          </div>
        </div>
      )
    }
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
              onBlur={handlePassword}
              required
            />
            {isPassCrt === false && (
              <div className="text-red-500 text-sm mt-1">
                Password must be 8–20 characters long, include uppercase, lowercase, number and special character!
              </div>
            )}
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 hover:ring-blue-500 focus:ring-blue-500"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={handleConfirmPassword}
              required
            />
            {isConfmPassCrt === false && (
              <div className="text-red-500 text-sm mt-1">
                Passwords do not match. Please check!
              </div>
            )}
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
    </>
  );
}
