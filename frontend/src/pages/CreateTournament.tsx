import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CreateTournament.css";

// The list of sports

function CreateTournament() {
  const sportsOptions = [
    { name: "Badminton" },
    { name: "Baseball" },
    { name: "Basketball" },
    { name: "Bowling" },
    { name: "Cheerleading" },
    { name: "Cornhole" },
    { name: "Cycling" },
    { name: "Disc Golf" },
    { name: "Dodgeball" },
    { name: "Fencing" },
    { name: "Flag Football" },
    { name: "Golf" },
    { name: "Ice Hockey" },
    { name: "Jiu Jitsu" },
    { name: "Judo" },
    { name: "Karate" },
    { name: "Kendo" },
    { name: "Kiteboarding" },
    { name: "Lacrosse" },
    { name: "Paintball" },
    { name: "Pickleball" },
    { name: "Rock Climbing" },
    { name: "Rowing" },
    { name: "Rugby" },
    { name: "Running" },
    { name: "Sailing" },
    { name: "Soccer" },
    { name: "Softball" },
    { name: "Spikeball" },
    { name: "Surfing" },
    { name: "Swimming" },
    { name: "Table Tennis" },
    { name: "Tae Kwon Do" },
    { name: "Tennis" },
    { name: "Ultimate Frisbee" },
    { name: "Volleyball" },
    { name: "Wrestling" },
  ];

  const [tournamentName, setTournamentName] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [numParticipants, setNumParticipants] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSports, setFilteredSports] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [selectedSport, setSelectedSport] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query) {
      setFilteredSports(
        sportsOptions.filter((sport) =>
          sport.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredSports([]);
    }
  };

  const handleSelectSport = (sport) => {
    setSelectedSport(sport.name);
    setSearchTerm(sport.name);
    setFilteredSports([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" && highlightIndex < filteredSports.length - 1) {
      setHighlightIndex((prev) => prev + 1);
    } else if (e.key === "ArrowUp" && highlightIndex > 0) {
      setHighlightIndex((prev) => prev - 1);
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      handleSelectSport(filteredSports[highlightIndex]);
    }
  };

  const handleFormatChange = (e) => {
    setSelectedFormat(e.target.value);
  };

  const handleTournamentNameChange = (e) => {
    setTournamentName(e.target.value);
  };

  const handleNumParticipantsChange = (e) => {
    setNumParticipants(e.target.value);
  };

  const clearForm = () => {
    setTournamentName("");
    setSelectedFormat("");
    setNumParticipants("");
    setSearchTerm("");
    setFilteredSports([]);
    setSelectedSport(null);
    setMessage("");
    setHighlightIndex(-1);
  };

  // API Call to create tournament
  const handleCreateTournament = async () => {
    if (
      !tournamentName ||
      !selectedFormat ||
      !numParticipants ||
      !selectedSport
    ) {
      setMessage("Please fill out all fields.");
      return;
    }

    const requestBody = {
      name: tournamentName,
      userID: "exampleUserID123", // Replace with the actual user ID
      size: parseInt(numParticipants, 10),
    };

    try {
      setLoading(true);
      const response = await fetch(
        "http://cop4331-team14.xyz:3000/api/createTournament",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();

      if (response.status === 200) {
        setMessage(result.message || "Tournament created successfully.");
        clearForm();
      } else if (response.status === 409) {
        setMessage(result.error || "Tournament with this name already exists.");
      } else {
        setMessage(
          result.error || "Unable to create tournament. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating tournament:", error);
      setMessage("Failed to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="title">
        <h1>Create Tournament</h1>
      </div>
      <Link to="/dashboard" className="back-button">
        Back
      </Link>

      <div className="tournament-name-container">
        <label htmlFor="tournament-name" className="tournament-name-label">
          1) Enter Tournament Name:
        </label>
        <input
          type="text"
          id="tournament-name"
          className="tournament-name"
          value={tournamentName} // Use a variable for the tournament name
          onChange={handleTournamentNameChange} // Update state on input change
          placeholder="Enter tournament name" // Clarify that it's for the tournament name
        />
      </div>

      <div className="dropdown-container">
        <label htmlFor="tournament-format" className="dropdown-label">
          2) Select Tournament Format:
        </label>
        <select
          id="tournament-format"
          value={selectedFormat}
          onChange={handleFormatChange}
          className="dropdown-select"
        >
          <option value="" disabled>
            -- Select Format --
          </option>
          <option value="single-elimination">Single Elimination</option>
          <option value="round-robin">Round Robin</option>
          <option value="seeded">Seeded</option>
        </select>
      </div>

      <div className="participants-container">
        <label htmlFor="opponent" className="opponent-label">
          3) Enter Number of Participants:
        </label>
        <input
          type="number"
          id="opponent"
          className="numParticipants"
          value={numParticipants} // Set value to the state
          onChange={handleNumParticipantsChange} // Update state on input change
          placeholder="Enter number of participants"
        />
      </div>

      <div className="autocomplete-container">
        <label htmlFor="sport" className="autocomplete-label">
          4) Search for a Sport:
        </label>
        <div className="autocomplete-input-wrapper">
          <input
            type="text"
            id="sport"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder="Search for a sport..."
            className="autocomplete-input"
          />
          {filteredSports.length > 0 && (
            <ul className="suggestions-list">
              {filteredSports.map((sport, index) => (
                <li
                  key={sport.name}
                  className={`suggestion-item ${
                    index === highlightIndex ? "highlighted" : ""
                  }`}
                  onClick={() => handleSelectSport(sport)}
                >
                  {sport.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <button type="button" id="clear-form-button" onClick={clearForm}>
          Clear Form
        </button>
      </div>

      <div>
        <button
          type="button"
          id="continueButton"
          onClick={handleCreateTournament}
        >
          Create Tournament
        </button>
      </div>

      {message && <div className="message">{message}</div>}
    </>
  );
}

export default CreateTournament;
