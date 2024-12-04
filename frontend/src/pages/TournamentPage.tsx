import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Tournament = () => {
    const { id } = useParams();
    const [tournament, setTournament] = useState('');

    useEffect(() => {
        const fetchTournaments = async () => {
          const storedUserInfo = localStorage.getItem("user-info");
          if (storedUserInfo) {
            try {
              const response = await fetch("http://cop4331-team14.xyz:3000/api/searchTournaments", {
                method: 'POST',
                body: JSON.stringify({ objectId: id }),
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json"
                }
              });
      
              if (response.ok) {
                const result = await response.json();
                if(result.tournaments){
                  console.log(result.tournaments)
                  setTournament(result.tournaments[0]);
                }
                console.log("Tournaments fetched:", result);
              } else {
                console.error("Failed to fetch tournaments:", response.statusText);
              }
            } catch (error) {
              console.error("Error:", error);
            }
        }
    };
    fetchTournaments();
  }, []);

  return (
      <>
        {JSON.stringify(tournament, null, 2)}
      </>
  )
}

export default Tournament;