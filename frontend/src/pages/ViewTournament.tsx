import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./viewTournament.css";

const ViewTournament: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<string>();

  // State initialization
  const [name, setName] = useState<string>("");
  const [maxSize, setMaxSize] = useState<number>(0);
  const [currentSize, setCurrentSize] = useState<number>(0);
  const [participants, setParticipants] = useState<string[]>([]);
  const [format, setFormat] = useState<string>("");
  const [sport, setSport] = useState<string>("");
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [rounds, setRounds] = useState<string[][][]>([]);
  const [message, setMessage] = useState<string>("");
  const [matchResults, setMatchResults] = useState<{ [key: string]: number }>(
    {}
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editRoundIndex, setEditRoundIndex] = useState<number | null>(null);
  const [editMatchIndex, setEditMatchIndex] = useState<number | null>(null);
  const [newWinner, setNewWinner] = useState<string>("");

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
              body: JSON.stringify({ objectId: id }),
            }
          );
          if (!response.ok) throw new Error("Failed to fetch tournament data");

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

          if (tournament.participants.length > 1) {
            const initialRound = generateMatches(
              tournament.participants,
              tournament.format
            );
            setRounds([initialRound]);
          }
        } catch (error) {
          console.error("Error fetching tournament data:", error);
        }
      };

      fetchTournament();
    }
  }, [id]);

  const generateMatches = (
    participants: string[],
    format: string
  ): string[][] => {
    const matches: string[][] = [];

    if (format === "round-robin") {
      for (let i = 0; i < participants.length; i++) {
        for (let j = i + 1; j < participants.length; j++) {
          matches.push([participants[i], participants[j]]);
        }
      }
    } else if (format === "seeded" || format === "single-elimination") {
      if (participants.length % 2 !== 0) {
        participants.push("-----");
      }

      for (let i = 0; i < participants.length; i += 2) {
        matches.push([participants[i], participants[i + 1]]);
      }
    }

    return matches;
  };

  const handleMatchResult = (
    winner: string,
    roundIndex: number,
    matchIndex: number
  ) => {
    const newRounds = [...rounds];
    const currentRound = newRounds[roundIndex];

    currentRound[matchIndex] = [winner, "-----"];
    setRounds(newRounds);

    if (format === "round-robin") {
      const updatedResults = { ...matchResults };
      updatedResults[winner] = (updatedResults[winner] || 0) + 1;
      setMatchResults(updatedResults);
    }

    const allResolved = currentRound.every(
      ([team1, team2]) => team1 !== "" && team2 === "-----"
    );

    if (allResolved) {
      let winners = currentRound
        .map((match) => match[0])
        .filter((team) => team !== "-----");

      if (format === "round-robin") {
        const sortedParticipants = Object.entries(matchResults).sort(
          ([, wins1], [, wins2]) => wins2 - wins1
        );
        const winner = sortedParticipants[0][0];
        setMessage(`Congratulations! The winner is ${winner}`);
        return;
      }

      if (winners.length === 1) {
        setMessage(`Congratulations! The winner is ${winners[0]}`);
        return;
      }

      if (winners.length % 2 !== 0) {
        winners.push("-----");
      }

      if (newRounds.length === roundIndex + 1) {
        const nextRound = generateMatches(winners, format);
        setRounds([...newRounds, nextRound]);
      }
    }
  };

  const handleEditWinner = (
    roundIndex: number,
    matchIndex: number,
    currentWinner: string
  ) => {
    setIsEditing(true);
    setEditRoundIndex(roundIndex);
    setEditMatchIndex(matchIndex);
    setNewWinner(currentWinner);
  };

  const handleSaveEdit = () => {
    if (editRoundIndex !== null && editMatchIndex !== null) {
      const newRounds = [...rounds];
      const currentRound = newRounds[editRoundIndex];

      currentRound[editMatchIndex] = [newWinner, "-----"];
      setRounds(newRounds);

      setIsEditing(false);
      setEditRoundIndex(null);
      setEditMatchIndex(null);
      setNewWinner("");
    }
  };

  return (
    <div className="tournament-container">
      <h1 className="tournament-title">Tournament - {name}</h1>

      {rounds.map((round, roundIndex) => (
        <div key={roundIndex} className="round">
          <div className="round-title">Round {roundIndex + 1}</div>

          {round.map((match, matchIndex) => (
            <div key={matchIndex} className="match">
              {roundIndex === rounds.length - 1 &&
              match[0] !== "-----" &&
              match[1] === "-----" ? (
                <span className="team winner">{match[0]}</span>
              ) : (
                <span
                  className="team"
                  onClick={() =>
                    handleMatchResult(match[0], roundIndex, matchIndex)
                  }
                  style={{ cursor: "pointer" }}
                >
                  {match[0]}
                </span>
              )}

              {roundIndex === rounds.length - 1 &&
              match[1] !== "-----" &&
              match[0] === "-----" ? (
                <span className="team winner">{match[1]}</span>
              ) : (
                match[1] !== "-----" && (
                  <span
                    className="team"
                    onClick={() =>
                      handleMatchResult(match[1], roundIndex, matchIndex)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {match[1]}
                  </span>
                )
              )}

              {isEditing &&
                editRoundIndex === roundIndex &&
                editMatchIndex === matchIndex && (
                  <div className="edit-winner">
                    <input
                      type="text"
                      value={newWinner}
                      onChange={(e) => setNewWinner(e.target.value)}
                    />
                    <button onClick={handleSaveEdit}>Save</button>
                  </div>
                )}
            </div>
          ))}
        </div>
      ))}

      {message && <div className="winner-message">{message}</div>}

      <div className="details-container">
        <div>
          <strong>Sport:</strong> {sport}
        </div>
        <div>
          <strong>Format:</strong> {format}
        </div>
        <div>
          <strong>Start:</strong> {start} | <strong>End: </strong>
          {end}
        </div>
        <div>
          <strong>{currentSize}</strong> out of <strong>{maxSize}</strong>{" "}
          participants are enrolled
        </div>
      </div>

      <button className="back-button" onClick={() => navigate("/dashboard")}>
        Back
      </button>
    </div>
  );
};

export default ViewTournament;
