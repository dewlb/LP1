//import React from 'react';
import { Link } from "react-router-dom";
import "./JoinTournament.css";
import { CiSearch } from "react-icons/ci";
import React, { useEffect, useState } from "react";

function JoinTournament() {
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
      <h1>Join Tournament</h1>
      <h2>Search a Tournament by Name or Location</h2>

      <Link to="/dashboard" className="back-button">
        Back
      </Link>

      <div className="search">
        <div className="searchInput">
          <input type="text" placeholder="Search"></input>
          <CiSearch className="icon" />
        </div>
        <div className="dataResult"></div>
      </div>

      <div className="Tournaments">
        <table className="tournamentResults">
          <th> Name </th>
          <th> Date </th>
          <th> Location </th>
          <th> Details </th>
        </table>
      </div>
    </>
  );
}

export default JoinTournament;
