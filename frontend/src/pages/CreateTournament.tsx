//import React from 'react';
import { Link } from "react-router-dom";
import "./CreateTournament.css";
import React, { useEffect, useState } from "react";

function CreateTournament() {
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
      <div className="body">
        <h1>Create Tournament</h1>
      </div>
      <Link to="/dashboard" className="back-button">
        Back
      </Link>
    </>
  );
}

export default CreateTournament;
