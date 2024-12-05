import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import "./viewTournament.css";

const ViewTournament: React.FC = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const { id } = useParams<string>();

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
  const [matches, setMatches] = useState<[string, string][]>([]); // Correct type for matches

  // Fetch current tournament details on mount or when the ID changes
  useEffect(() => {
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
          const tournament = data.tournaments[0];

          setName(tournament.name);
          setMaxSize(tournament.max_size);
          setCurrentSize(tournament.current_size);
          setParticipants(tournament.participants);
          setFormat(tournament.format);
          setSport(tournament.sport);
          setStart(tournament.start);
          setEnd(tournament.end);

          // Check if there's only one participant
          if (tournament.participants && tournament.participants.length === 1) {
            setMatches([
              [`${tournament.participants[0]} has won the tournament!`, ""],
            ]);
          } else {
            // Generate matches if there are multiple participants
            const generatedMatches = generateMatches(tournament.participants);
            setMatches(generatedMatches);
          }
        } catch (error) {
          console.error("Error fetching tournament data:", error);
        }
      };

      fetchTournament();
    }
  }, [id]);

  // Generates matches from participants
  const generateMatches = (participants: string[]): any[] => {
    let matches = [];

    // Ensure participants is a multiple of 2
    while (participants.length % 2 !== 0) {
      participants.push("-----"); // This handles odd number of participants
    }

    // Pair participants into matches
    for (let i = 0; i < participants.length; i += 2) {
      // Check if both participants are valid (not "-----")
      if (participants[i] !== "-----" && participants[i + 1] !== "-----") {
        matches.push([participants[i], participants[i + 1]]);
      } else if (
        participants[i] !== "-----" &&
        participants[i + 1] === "-----"
      ) {
        // If only the first participant is valid, it's a bye-round
        matches.push([participants[i]]);
      } else if (
        participants[i] === "-----" &&
        participants[i + 1] !== "-----"
      ) {
        // Handle the edge case where the first participant is "-----" and second is valid
        matches.push([participants[i + 1]]);
      }
    }

    return matches;
  };

  const handleViewTournament = async () => {
    const payload = {
      tournamentID: id,
      name,
      max_size: maxSize,
      current_size: currentSize,
      participants,
      format,
      sport,
      start,
      end,
    };

    try {
      const response = await fetch(
        "http://cop4331-team14.xyz:3000/api/updateTournament",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

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
    <div className="tournament-container">
      <h1 className="tournament-title">Tournament - {name}</h1>
      <div className="details-container">
        <div className="space">
          <strong>Sport:</strong> {sport}
          <p></p>
        </div>
        <div className="space">
          <strong>Format:</strong> {format}
          <p></p>
        </div>
        <div className="space">
          <strong>Start:</strong> {start} | <strong>End: </strong>
          {end}
          <p></p>
        </div>
        <div className="space">
          <strong>{currentSize}</strong> out of <strong>{maxSize}</strong>{" "}
          participants are enrolled
        </div>
      </div>

      {/* Render the tournament bracket */}
      {matches.length > 0 && (
        <div className="bracket">
          {matches.map((match, index) => (
            <div key={index} className="match">
              {/* If there's only one participant, display the winner message */}
              {currentSize === 1 ? (
                <span>{match[0]}</span> // No "vs" here for the single participant
              ) : (
                <span>
                  {match[0]} vs {match[1]}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* If there's a message (error or success), display it */}
      {message && <p>{message}</p>}
      <button className="back-button" onClick={handleBackClick}>
      <IoIosArrowRoundBack size={40} />
      </button>
      <button
        className="trash"
        onClick={handleViewTournament}
        style={{ display: "none" }}
      >
        Trash
      </button>
    </div>
  );
};

export default ViewTournament;
