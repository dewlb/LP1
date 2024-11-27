//import React from 'react';
import { Link } from "react-router-dom";
import "./Settings.css";
import { IoIosArrowRoundBack } from "react-icons/io";
import React, { useEffect, useState } from "react";

function Settings() {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    nation: "",
    birthdate: "",
    gender: "",
    phoneNumber: "",
    city: "",
    state: "",
    type: "",
    belt: "",
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
      <h1>Settings</h1>

      <Link to="/dashboard" className="back-button">
        <IoIosArrowRoundBack size={30} />
      </Link>

      <h2>{userInfo.username}</h2>
      <div className="wrapper">
        <h3>User Details</h3>
        <h4>First Name: {userInfo.firstName || "Unknown"}</h4>
        <h4>Middle Name: {userInfo.middleName || "Unknown"}</h4>
        <h4>Last Name: {userInfo.lastName || "Unknown"}</h4>
        <h4>Email: {userInfo.email || "Unknown"}</h4>
        <h4>Password: {userInfo.password || "Unknown"}</h4>
        <h4>Nationality: {userInfo.nation || "Unknown"}</h4>
        <h4>Birthdate: {userInfo.birthdate || "Unknown"}</h4>
        <h4>Gender: {userInfo.gender || "Unknown"}</h4>
      </div>

      <div className="wrapper">
        <h3>Contact And Residence</h3>
        <h4>Phone Number: {userInfo.phoneNumber || "Unknown"}</h4>
        <h4>City: {userInfo.city || "Unknown"}</h4>
        <h4>State: {userInfo.state || "Unknown"}</h4>
      </div>

      <h3>Delete Account</h3>
      <button className="delete-account-button" type="button">
        Delete Account
      </button>
    </>
  );
}

export default Settings;
