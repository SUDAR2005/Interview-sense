import React, { useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GlobalDataContext } from "../context/GlobalContext";

function ProfileComponent() {
  const { setIsLoggedIn } = useAuth();
  const { data } = useContext(GlobalDataContext);
  const navigate = useNavigate();

  const handleSubmit = () => {
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
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">Reg No:</span> {data.regno}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Department:</span> {data.department}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Year:</span> {data.year}
        </p>

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
