//import React from 'react';
import { Link } from "react-router-dom";
import "./Connect.css";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useEffect, useState } from "react";

function Connect() {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    username: "",
    nation: "",
    birthdate: "",
    phoneNumber: "",
    instagram: "",
    snapchat: "",
    tikTok: "",
    sport: "",
    school: "",
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
      <h1>Connect</h1>

      <Link to="/dashboard" className="back-button">
        <IoIosArrowRoundBack size={30} />
      </Link>

       <h2>{userInfo.username}</h2>
      <div className="wrapper">
        <h3>User Details</h3>
        <h4>First Name: {userInfo.firstName || "Unknown"}</h4>
        <h4>Last Name: {userInfo.lastName || "Unknown"}</h4>
        <h4>Nationality: {userInfo.nation || "Unknown"}</h4>
        <h4>Birthdate: {userInfo.birthdate || "Unknown"}</h4>
        <h4>Phone Number: {userInfo.phoneNumber || "Unknown"}</h4>
        <h4>Instagram: {userInfo.instagram || "Unknown"}</h4>
        <h4>Snapchat: {userInfo.snapchat || "Unknown"}</h4>
        <h4>TikTok: {userInfo.tikTok || "Unknown"}</h4>
        <h4>Sport: {userInfo.sport || "Unknown"}</h4>
        <h4>School: {userInfo.school || "Unknown"}</h4>
      </div>
    </>
  );
}

export default Connect;
