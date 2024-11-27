//import React from 'react';
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { TbLogout2 } from "react-icons/tb";
import { IoMenu } from "react-icons/io5";
import React, { useEffect, useState } from "react";

function Dashboard() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Retrieve user info from local storage
    const userInfo = localStorage.getItem("user-info");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setUsername(user.username);
    }
  }, []);

  return (
    <>
      <h1>Hello {username}!</h1>
      <Link to="/login" className="back-button">
        <TbLogout2 size={20} />
      </Link>

      <div className="Main-Actions">
        <Link to="/JoinTournament" className="action-button">
          Join Tournament
        </Link>
        <Link to="/CreateTournament" className="action-button">
          Create Tournament
        </Link>
      </div>

      <div className="dropdown">
        <button className="dropbtn">
          <IoMenu size={20} />
        </button>
        <div className="dropdown-content">
          <Link to="/MyProfile" className="my-profile">
            My Profile
          </Link>
          <Link to="/Settings" className="settings">
            Settings
          </Link>
          <Link to="/connect" className="connect">
            Connect
          </Link>
          <Link to="/aboutus" className="about-us">
            About Us
          </Link>
        </div>
      </div>

      <div className="Tournament-History">
        <h2>Tournament History</h2>
        <h4> You have participated in x tournaments.</h4>

        <table className="t-history">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Location</th>
              <th>Rank</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </>
  );
}

export default Dashboard;
