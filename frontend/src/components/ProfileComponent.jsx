import React, { useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GlobalDataContext } from "../context/GlobalContext";

function ProfileComponent() {
  const { setIsLoggedIn } = useAuth();
  const { data } = useContext(GlobalDataContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    const session_id = sessionStorage.getItem("access_token");
    sessionStorage.removeItem("access_token");
    try {
    await fetch(`http://localhost:8000/end-session?session_id=${sessionId}`, {
      method: "POST",
    });
  } catch (error) {
    console.error("Failed to end session:", error);
  }
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <img
          src={data.profileImage || "/profile.jpg"} // fallback image
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{data.name}</h1>
        <div className="justify-between">
          <div className="text-gray-600 mb-1 justify-around">
          <span className="font-semibold">Reg No:</span> {data.regno}
          </div>
          <div className="text-gray-600">
            <span className="font-semibold">Department:</span> {data.department}
          </div>
          <div className="text-gray-600">
            <span className="font-semibold">Year:</span> {data.year}
          </div>
          <div className="text-gray-600">
            <span className="font-semibold">Last Logged in:</span> {data.last_login}
          </div>
          <div className="text-gray-600">
            <span className="font-semibold">Aptitude Used:</span> {data.apti} / 1
          </div>
          <div className="text-gray-600">
            <span className="font-semibold">Coding Used:</span> {data.coding} / 1
          </div>
          <div className="text-gray-600">
            <span className="font-semibold">Time Spend in Chat:</span> {data.chat_durtion}
          </div>
        </div>
        
        <div className="mt-5">
          <button
            onClick={handleSubmit}
            className="ml-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-full font-semibold shadow transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileComponent;
