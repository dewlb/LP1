import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CreateTournament.css";
import ProgressBar from "./ProgressBar";
//import red from "../assets/red.png";

// icons
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

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
  const [filteredSports, setFilteredSports] = useState<{ name: string }[]>([]);

  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [selectedSport, setSelectedSport] = useState<string | null>(null); // Explicitly set the type as string or null
  const [message, setMessage] = useState("");
  //const [loading, setLoading] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  interface Sport {
    name: string;
  }

  const handleSelectSport = (sport: Sport) => {
    setSelectedSport(sport.name);
    setSearchTerm(sport.name);
    setFilteredSports([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && highlightIndex < filteredSports.length - 1) {
      setHighlightIndex((prev) => prev + 1);
    } else if (e.key === "ArrowUp" && highlightIndex > 0) {
      setHighlightIndex((prev) => prev - 1);
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      handleSelectSport(filteredSports[highlightIndex]);
    }
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFormat(e.target.value);
  };
  const handleTournamentNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTournamentName(e.target.value);
  };

  //////////// date
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDateSubmission = () => {
    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be later than end date.");
      return;
    }
    console.log("Start Date:", startDate, "End Date:", endDate);
    // Proceed with backend submission or advance to the next step
  };

  /////////////// Participants
  const [participantNames, setParticipantNames] = useState<string[]>([]);

  const handleNumParticipantsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setNumParticipants(value);
    // Update participantNames array to match the new number of participants
    setParticipantNames(new Array(Number(value)).fill(""));
  };

  ///// Get username
  // const [username, setUsername] = useState("");
  const [userID, setID] = useState("");

  useEffect(() => {
    // Retrieve user info from local storage
    const userInfo = localStorage.getItem("user-info");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setID(user._id);
    }
  }, []);

  //// Submit
  const handlePrevious = () => {
    // Logic for the Previous button
    setStep(step - 1);
    setMessage(""); // Clear the success message when navigating to the previous step
  };

  const goToTournamentInfo = () => {
    setIsMessageVisible(false); // Hide the message container when the button is clicked
    setStep(1); // Navigate to the Tournament Info tab
  };

  const [isMessageVisible, setIsMessageVisible] = useState(true); // Default is true, meaning the message is visible
  const [isFirstVisit, setIsFirstVisit] = useState(true); // This will be true when the user first loads the page

  useEffect(() => {
    if (isFirstVisit) {
      setIsMessageVisible(false); // Hide message container on first visit
      setIsFirstVisit(false); // Set isFirstVisit to false after the first visit
    }
  }, [isFirstVisit]); // This runs once on component mount
  /////////// Clear form

  const clearForm = () => {
    setTournamentName("");
    setSelectedFormat("");
    setNumParticipants("");
    setSearchTerm("");
    setFilteredSports([]);
    setSelectedSport(null);
    setMessage("");
    setHighlightIndex(-1);
    setStartDate("");
    setEndDate("");
  };

  // API Call to create tournament
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateTournament = async () => {
    if (
      !tournamentName ||
      !selectedFormat ||
      !numParticipants ||
      !selectedSport ||
      !endDate ||
      !startDate
    ) {
      setMessage("Please fill out all fields.");
      setIsMessageVisible(true); // Show the message container
      return;
    }

    const requestBody = {
      name: tournamentName,
      userID: userID, // Replace with the actual user ID
      size: parseInt(numParticipants, 10),
      sport: selectedSport,
      format: selectedFormat,
      start: startDate,
      end: endDate,
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
        setMessage("Tournament created successfully!");
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

    setMessage("Tournament created successfully!");
    setIsMessageVisible(true); // Show the message container
  };

  //  Progress Bar  //
  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 5) setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  return (
    <div>
      <div className="title">
        <h1>Create Tournament</h1>
      </div>
      <Link to="/dashboard" className="back-button">
        Back
      </Link>
      <ProgressBar currentStep={step} />
      <div className="step-content">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div>
            <div className="tournament-name-container">
              <label
                htmlFor="tournament-name"
                className="tournament-name-label"
              >
                Enter Tournament Name:
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
                Select Tournament Format:
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
          </div>
        )}

        {/* Step 2: Tournament Date and Status */}
        {step === 2 && (
          <div className="center-container">
            <div className="date-status">
              <div className="date-input-container">
                <div className="date-field">
                  <label htmlFor="start-date" className="sd-label">
                    Start Date:
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    name="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="date-field">
                  <label htmlFor="end-date" className="ed-label">
                    End Date:
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    name="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Participants */}
        {step === 3 && (
          <div className="participants-container">
            <label htmlFor="opponent" className="opponent-label">
              Enter Number:
            </label>
            <input
              type="number"
              id="opponent"
              className="numParticipants"
              value={numParticipants} // Set value to the state
              onChange={handleNumParticipantsChange} // Update state on input change
              placeholder="Enter number of participants"
              min="1" // Ensure only valid numbers are entered
            />
          </div>
        )}

        {step === 4 && (
          <div className="autocomplete-container">
            <label htmlFor="sport" className="autocomplete-label">
              Search Sport:
            </label>
            <div className="autocomplete-input-wrapper">
              <input
                type="text"
                id="sport"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Search sport..."
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
        )}

        {step === 5 && (
          <div>
            <div className="submit-button-container">
              <button onClick={handleCreateTournament}>Submit</button>
            </div>

            {isMessageVisible && (
              <div className="message-container">
                <button className="new-btn" onClick={goToTournamentInfo}>
                  Create another tournament!
                </button>
                {message && <div className="message">{message}</div>}
              </div>
            )}

            {/* Display the success or error message if available */}

            <div className="navigation-buttons">
              <button onClick={handlePrevious}>
                {" "}
                <IoIosArrowBack /> Previous
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="navigation-buttons">
        <button onClick={prevStep} disabled={step === 1}>
          <IoIosArrowBack /> Previous
        </button>
        <button onClick={nextStep} disabled={step === 5}>
          Next <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
}

export default CreateTournament;
