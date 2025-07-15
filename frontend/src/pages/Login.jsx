import React, {useState} from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
function Login() {
    const { setIsLoggedIn } = useAuth();
    const [regNo, setRegNo] = useState("");
    const [password, setPassword] = useState("");
    const [isPassCrt, setPassCrt] = useState(null);
    const [isErr,  setErrorStatus] = useState(false);
    const [errMsg, setErrorMsg] = useState("");
    

    const navigate = useNavigate();
    // password regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/;
    
    const BASE_URL = 'http://127.0.0.1:8000/login'
    // login handle
  const handleLogin = async (e) => {
    e.preventDefault();

    const isPasswordValid = handlePassword();

    if (!isPasswordValid) {
      console.warn("Validation failed");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}?regno=${encodeURIComponent(regNo)}&password=${encodeURIComponent(password)}`,
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
      setIsLoggedIn(true);
      navigate("/home");
    } catch (err) {
      setErrorStatus(true);
      setErrorMsg(err.message);
      console.error("Fetch Error:", err.message);
    }
  };
    // check password
    const handlePassword = () => {
    const isValid = passwordRegex.test(password);
    setPassCrt(isValid);
    return isValid;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login to <span className="text-[#147fdc] hover:text-[#7883ff]">InterviewSense</span>
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">Reg No</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 hover:ring-blue-500 focus:ring-blue-500"
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
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 hover:ring-blue-500 focus:ring-blue-500"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Login
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
  );
}

export default Login;

