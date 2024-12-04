import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom"; // Import useParams
import './UpdateTournament.css';
import { IoIosArrowRoundBack } from "react-icons/io";

const UpdateTournament: React.FC = () => {
  const { id } = useParams(); // Grab id from the URL

  // Initialize state
  const [name, setName] = useState<string>("");
  const [maxSize, setMaxSize] = useState<number>(0);
  const [currentSize, setCurrentSize] = useState<number>(0);
  const [participants, setParticipants] = useState<string[]>([]);
  const [format, setFormat] = useState<string>("");
  const [sport, setSport] = useState<string>("");
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // Fetch current tournament details on mount
  useEffect(() => {
    console.log(id);
    if (id) {
      const fetchTournament = async () => {
        try {
          const response = await fetch(`http://cop4331-team14.xyz:3000/api/searchTournaments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              objectId:id
            }),
          });
          if (!response.ok) {
            throw new Error("Failed to fetch tournament data");
          }
          const data = await response.json();
          console.log(data)
          const tournament = data.tournaments[0];

          // Set the form with the fetched data
          setName(tournament.name);
          setMaxSize(tournament.max_size);
          setCurrentSize(tournament.current_size);
          setParticipants(tournament.participants);
          setFormat(tournament.format);
          setSport(tournament.sport);
          setStart(tournament.start);
          setEnd(tournament.end);
        } catch (error) {
          console.error("Error fetching tournament data:", error);
          setMessage("Error fetching tournament data");
        }
      };

      fetchTournament();
    }
  }, []);

  const handleUpdateTournament = async () => {
    const payload = {
      tournamentID: id,
      name,
      max_size: maxSize,
      current_size: currentSize,
      participants: participants,
      status,
      format,
      sport,
      start,
      end,
    };

    try {
      const response = await fetch("http://cop4331-team14.xyz:3000/api/updateTournament", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update tournament");
      }

      const data = await response.json();
      setMessage(data.message || "Tournament updated successfully");
    } catch (error) {
      console.error("Error updating tournament:", error);
      setMessage("Error updating tournament. Check console for details.");
    }
  };

  return (
    <div className="update-tournament-form">
      <Link to="/dashboard">
        <IoIosArrowRoundBack size={30} />
      </Link>
      <h2>Update Tournament</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max Size"
        value={maxSize || ""}
        onChange={(e) => setMaxSize(Number(e.target.value) || 0)}
      />
      <input
        type="number"
        placeholder="Current Size"
        value={currentSize || 0}
        onChange={(e) => setCurrentSize(Number(e.target.value) || 0)}
      />
      <input
        type="text"
        placeholder="Format"
        value={format}
        onChange={(e) => setFormat(e.target.value)}
      />
      <input
        type="text"
        placeholder="Sport"
        value={sport}
        onChange={(e) => setSport(e.target.value)}
      />
      <input
        type="date"
        placeholder="Start Date"
        value={start || ""}
        onChange={(e) => setStart(e.target.value)}
      />
      <input
        type="date"
        placeholder="End Date"
        value={end || ""}
        onChange={(e) => setEnd(e.target.value)}
      />
      <button onClick={handleUpdateTournament}>Update Tournament</button>
      <p>{message}</p>
    </div>
  );
};

export default UpdateTournament;
