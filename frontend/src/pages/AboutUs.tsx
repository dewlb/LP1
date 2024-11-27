//import React from 'react';
import { Link } from "react-router-dom";
import "./AboutUs.css";
import { IoIosArrowRoundBack } from "react-icons/io";
import React, { useEffect, useState } from "react";

function AboutUs() {
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
      <h1>About Us</h1>

      <Link to="/dashboard" className="back-button">
        <IoIosArrowRoundBack size={30} />
      </Link>

      <div className="wrapper">
        <h2>Mobile: Alex Beaufort</h2>
        <h2>Front End: Gracie Doherty</h2>
        <h2>Project Mangager/Front End: Ethan Jewell</h2>
        <h2>API: Sami Najib</h2>
        <h2>API: Hector Ramos</h2>
        <h2>Front End: Veronica Vargas</h2>
      </div>
      <p></p>
      <button
        className="GitHub"
        type="button"
        onClick={() => window.open("https://github.com/dewlb/LP1", "_blank")}
      >
        GitHub
      </button>
    </>
  );
}

export default AboutUs;
