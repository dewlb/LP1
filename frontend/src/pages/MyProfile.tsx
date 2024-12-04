//import React from 'react';
import { Link } from "react-router-dom";
import "./MyProfile.css";
import { IoIosArrowRoundBack } from "react-icons/io";
import React, { useEffect, useState } from "react";

function MyProfile()
{
  const [userOwnedTournaments, setUserOwnedTournaments] = useState([]);

  useEffect(() =>
  {
    const fetchTournaments = async () =>
    {
      const storedUserInfo = localStorage.getItem("user-info");
      if (storedUserInfo)
      {
        try
        {
          const info = JSON.parse(storedUserInfo);
          const id = info.id;

          const response = await fetch("http://cop4331-team14.xyz:3000/api/searchTournaments", {
            method: 'POST',
            body: JSON.stringify({ owner: id }),
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
          });

          if (response.ok)
          {
            const result = await response.json();
            if (result.tournaments)
            {
              console.log(result.tournaments)
              setUserOwnedTournaments(result.tournaments);
            }
            console.log("Tournaments fetched:", result);
          } else
          {
            console.error("Failed to fetch tournaments:", response.statusText);
          }
        } catch (error)
        {
          console.error("Error:", error);
        }
      }
    };

    fetchTournaments(); // Call the async function
  }, []);

  const tournaLink = (props: any) =>
  {
    return (
      <li
        key={props.name}
        style={{
          border: "1px solid #ccc",
          margin: "10px 0",
          borderRadius: "5px",
          padding: "15px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Link to={`/item/${props._id}`}>{props.name}</Link>
      </li>
    )
  }


  return (
    <div>
      <Link to="/dashboard" className="back-button">
        <IoIosArrowRoundBack size={30} />
      </Link>
      <div className="wrapper">
        <h1>My Profile</h1>

        <div>
          <h2>Tournaments I created</h2>
          <ul>
            {userOwnedTournaments.map((item) => tournaLink(item))}
          </ul>
        </div>

        <div>
          <h2>Tournaments I'm in</h2>
          <h3>(No tournaments to show yet)</h3>
        </div>
      </div>
    </div>
  );

}

export default MyProfile;
