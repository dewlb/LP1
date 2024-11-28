//import React from 'react';
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { TbLogout2 } from "react-icons/tb";
import { IoMenu } from "react-icons/io5";
import { useEffect, useState } from "react";

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
    <div className="background">
      <h1 className="greeting">Hello {username}!</h1>
      <Link to="/" className="logout-button">
        <TbLogout2 size={35} />
      </Link>

    <div className="dashbody">


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
        <h2 className="heading">Tournaments</h2>
        <table className="t-history">
          <thead>
            <tr>
              <th>Name</th>
              <th>Current Participants</th>
              <th>Total Participants</th>
              <th>Participants</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      </div>
      </div>
    </>
  );
}

export default Dashboard;
