import React from "react";

function ProfileComponent({ name, regNo, department, profileImage }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <img
          src={profileImage}
          alt="Profile Image"
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{name}</h1>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">Reg No:</span> {regNo}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Department:</span> {department}
        </p>
      </div>
    </div>
  );
}

export default ProfileComponent;
