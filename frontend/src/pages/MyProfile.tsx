//import React from 'react';
import { Link } from "react-router-dom";
import "./MyProfile.css";
import { IoIosArrowRoundBack } from "react-icons/io";
import React, { useEffect, useState } from "react";

function MyProfile() {
  const [userInfo, setUserInfo] = useState({
    username: "",
    nation: "",
    age: "",
    school: "",
    tournName: "",
    weightClass: "",
    oppName: "",
    reason: "",
    place: "",
  });

  useEffect(() => {
    // Retrieve user info from local storage
    const storedUserInfo = localStorage.getItem("user-info");
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    }
  }, []);

  return (
    <>
      <h1>My Profile</h1>

      <Link to="/dashboard" className="back-button">
        <IoIosArrowRoundBack size={30} />
      </Link>
      <div className="wrapper">
        <h2>{userInfo.username}</h2>

        <h3>
          Nationality: {userInfo.nation || "Unknown"} | Age:{" "}
          {userInfo.age || "Unknown"}
        </h3>

        <h3>School: {userInfo.school || "Unknown"}</h3>
      </div>
      <p></p>
      <div className="wrapper">
        <h2>Past Tournaments </h2>
        <h3>
          Name: {userInfo.tournName || "Unknown"} (Weightclass):{" "}
          {userInfo.weightClass || "Unknown"}
        </h3>
        <h3>
          {" "}
          {userInfo.place || "Win/Loss"} - Opponent Name:{" "}
          {userInfo.oppName || "Unknown"} (reason for win/loss):{" "}
          {userInfo.reason || "Unknown"}
        </h3>
        <h3> (Rank): {userInfo.place || "Unknown"}</h3>
      </div>
    </>
  );
}

export default MyProfile;
