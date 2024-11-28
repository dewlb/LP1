//import React from 'react';
import { Link } from "react-router-dom";
import "./CreateTournament.css";


function CreateTournament() {


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
