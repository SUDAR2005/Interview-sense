import React from "react";
import ProfileComponent from "../components/ProfileComponent";
import { FaUserCircle } from "react-icons/fa";
function Profile() {
    {/* Need to add backedn logic to get content */}
    const profileData = {
        name: "SUDAR MANIKANDAN S",
        regNo: "917722IT111",
        department: "IT",
        profileImage: "profile.jpg"
    };

    return <ProfileComponent {...profileData} />;
}

export default Profile;
