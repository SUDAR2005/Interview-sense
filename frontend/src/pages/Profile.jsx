import React from "react";
import ProfileComponent from "../components/ProfileComponent";
import { FaUserCircle } from "react-icons/fa";

function Profile() {
    const profileData = {
        name: "User",
        regNo: "917722ITXYZ",
        department: "IT",
        profileImage: "profile.jpg"
    };

    return <>
        <ProfileComponent {...profileData} />;

    </>
}

export default Profile;
