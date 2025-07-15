import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { setIsLoggedIn } = useAuth();
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [isPassCrt, setPassCrt] = useState(null);
  const [isErr, setErrorStatus] = useState(false);
  const [errMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = "http://127.0.0.1:8000/login";

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/;

  const handleLogin = async (e) => {
    e.preventDefault();

    const isPasswordValid = handlePassword();
    if (!isPasswordValid) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ regno: regNo, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
      }

      const data = await response.json();
      console.log("Response Data:", data);
      setErrorStatus(false);
      setIsLoggedIn(true);
      navigate("/home");
    } catch (err) {
      setErrorStatus(true);
      setErrorMsg(err.message);
      console.error("Login Error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePassword = () => {
    const isValid = passwordRegex.test(password);
    setPassCrt(isValid);
    return isValid;
  };

  const closeErrorPopup = () => {
    setErrorStatus(false);
    setErrorMsg("");
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
      )}

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Login to{" "}
            <span className="text-[#147fdc] hover:text-[#7883ff]">
              InterviewSense
            </span>
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-700">Reg No</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 hover:ring-blue-500 focus:ring-blue-500"
                placeholder="Your register number"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700">Password</label>
              <input
                type="password"
                className={`w-full px-4 py-2 rounded-lg border ${
                  isPassCrt === false ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 hover:ring-blue-500 focus:ring-blue-500`}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {isPassCrt === false && (
                <p className="text-sm text-red-500 mt-1">
                  Password must be 8-20 chars, include uppercase, lowercase,
                  number, and symbol.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
