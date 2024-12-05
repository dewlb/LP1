//import React from 'react';
import { Link } from "react-router-dom";
import "./JoinTournament.css";
import { LuSearch } from "react-icons/lu";
import { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";

// Define Tournament interface
interface Tournament {
  _id: string;
  name: string;
  current_size: number;
  max_size: number;
  start: number;
  end: number;
}

function JoinTournament() {
  const [search, setSearch] = useState("");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [firstName, setName] = useState("");
  const [userID, setID] = useState("");

  useEffect(() => {
    const userInfo = localStorage.getItem("user-info");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setName(user.firstName);
      setID(user._id);
      //loadTournaments();
      console.error("USERID:", userID);
      console.error("NAME:", name);
    }
  }, []);

  const [, setMaxSize] = useState<number>(0);
  const [, setCurrentSize] = useState<number>(0);
  const [, setParticipants] = useState<string[]>([]);
  const [id] = useState<string | null>(null);
  const [, setTName] = useState<string>("");
  const [, setFormat] = useState<string>("");
  const [, setSport] = useState<string>("");
  const [, setStart] = useState<string>("");
  const [, setEnd] = useState<string>("");

  // Fetch current tournament details on mount
  useEffect(() => {
    console.log(id);
    if (id) {
      const fetchTournament = async () => {
        try {
          const response = await fetch(
            `http://cop4331-team14.xyz:3000/api/searchTournaments`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                objectId: id,
              }),
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch tournament data");
          }
          const data = await response.json();
          console.log(data);
          const tournament = data.tournaments[0];

          // Set the form with the fetched data
          setTName(tournament.name); // Correctly set the tournament name
          setMaxSize(tournament.max_size);
          setCurrentSize(tournament.current_size);
          setParticipants(tournament.participants || []); // Ensure it's an array
          setFormat(tournament.format);
          setSport(tournament.sport);
          setStart(tournament.start);
          setEnd(tournament.end);
        } catch (error) {
          console.error("Error fetching tournament data:", error);
        }
      };

      fetchTournament();
    }
  }, [id]); // Ensure id is included in the dependency array

  async function joinTournament(selectedID: string) {
    if (!selectedID) {
      console.error("No tournament selected.");
      return;
    }

    if (!firstName || !userID) {
      console.error(
        "User information is missing. Ensure the user is logged in."
      );
      return;
    }

    try {
      // Fetch the tournament's current details
      const response = await fetch(
        `http://cop4331-team14.xyz:3000/api/searchTournaments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ objectId: selectedID }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tournament data");
      }

      const data = await response.json();
      const tournament = data.tournaments[0];

      if (!tournament) {
        console.error("Tournament not found.");
        return;
      }

      const { max_size, current_size, participants } = tournament;

      // Check if the tournament is full
      if (current_size >= max_size) {
        console.warn("Tournament is full. Cannot join.");
        return;
      }

      // Update participants and current size
      const updatedParticipants = [...participants, firstName];
      const updatedCurrentSize = current_size + 1;

      // Prepare the payload for updating the tournament
      const payload = {
        tournamentID: selectedID,
        addUser: userID, //added line
        name: tournament.name,
        max_size: max_size,
        current_size: updatedCurrentSize,
        participants: updatedParticipants,
        //status: "Updated after join", // Adjust if needed
        format: tournament.format,
        sport: tournament.sport,
        start: tournament.start,
        end: tournament.end,
      };

      // Send the updated tournament data to the server
      const updateResponse = await fetch(
        "http://cop4331-team14.xyz:3000/api/updateTournament",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (updateResponse.ok) {
        console.log("Tournament updated successfully");
        searchAllTournament(); // Refresh the tournament list
      } else {
        console.error(
          "Failed to update tournament:",
          updateResponse.statusText
        );
      }
    } catch (error) {
      console.error("Error during join operation:", error);
    }
  }

  //Search your tournaments
  async function searchAllTournament() {
    if (!search.trim()) {
      console.warn("Search query is empty. Please enter a term to search.");
      return;
    }

    let payload = {};

    // Populate the payload based on the search query
    if (search.match(/^[a-f0-9]{24}$/)) {
      // If the search query looks like an ObjectId (24 hexadecimal characters)
      payload = { objectId: search };
    } else {
      // Otherwise, search by name or userId
      payload = {
        name: search,
        //userId: userID, // Include userId for filtering based on the logged-in user
      };
    }

    try {
      const response = await fetch(
        "http://cop4331-team14.xyz:3000/api/searchTournaments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.tournaments) {
          setTournaments(data.tournaments as Tournament[]);
        } else {
          console.warn("No tournaments found for your search query.");
          setTournaments([]); // Clear the list if no results
        }
      } else {
        console.error("Search request failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during tournament search:", error);
    }
  }

  return (
    <>
      <div className="join-background">
        <h1 className="start-greeting">Start playing!</h1>

        <Link to="/dashboard" className="back-button">
          <IoIosArrowRoundBack size={40} />
        </Link>
        <div className="search-container">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search"
          />
          <button onClick={searchAllTournament} className="tosearch-button">
            <LuSearch size={25} />
          </button>
        </div>

        <div className="Tournament-History">
          <h2 className="heading-1">Join a tournament!</h2>
          <table className="t-history">
            <thead>
              <tr>
                <th>Name</th>
                <th> Start Date</th>
                <th> End Date</th>
                <th>Current Participants</th>
                <th>Total Participants</th>
                <th>Join</th> {/* View Column */}
              </tr>
            </thead>
            <tbody>
              {tournaments.map((tournament) => (
                <tr key={tournament._id}>
                  <td>{tournament.name}</td>
                  <td>{tournament.start}</td>
                  <td>{tournament.end}</td>
                  <td>{tournament.current_size}</td>
                  <td>{tournament.max_size}</td>
                  <td>
                    <button
                      onClick={() => joinTournament(tournament._id)}
                      className="join-button"
                    >
                      Get playing!
                    </button>
                  </td>
                </tr>
              ))}
              {tournaments.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    No tournaments found. Try a different search!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default JoinTournament;
