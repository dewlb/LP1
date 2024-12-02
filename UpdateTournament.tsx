import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // For tournament ID and navigation
import "./UpdateTournament.css";

function UpdateTournament() {
  const { tournamentId } = useParams(); // Get tournament ID from the URL
  const navigate = useNavigate();

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
    // Add more sports if needed
  ];

  // Form state
  const [tournamentData, setTournamentData] = useState({
    name: "",
    max_size: "",
    current_size: "",
    participants: [],
    status: 0,
  });

  // Fetch existing tournament details
  useEffect(() => {
    async function fetchTournamentDetails() {
      try {
        const response = await fetch(`/api/tournaments/${tournamentId}`);
        const data = await response.json();
        setTournamentData({
          name: data.name,
          max_size: data.max_size.toString(),
          current_size: data.current_size.toString(),
          participants: data.participants || [],
          status: data.status,
        });
      } catch (error) {
        console.error("Error fetching tournament data:", error);
      }
    }
    fetchTournamentDetails();
  }, [tournamentId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: tournamentData.name,
      max_size: parseInt(tournamentData.max_size), // Convert to number
      current_size: parseInt(tournamentData.current_size), // Convert to number
      participants: tournamentData.participants,
      tournamentID: tournamentId,
      status: tournamentData.status,
    };

    try {
      const response = await fetch("/updateTournament", {
        method: "POST", // Matches the API endpoint method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Tournament updated successfully!");
        navigate("/tournaments"); // Redirect to tournaments list
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update tournament.");
      }
    } catch (error) {
      console.error("Error updating tournament:", error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTournamentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="update-tournament">
      <h1>Update Tournament</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Tournament Name:
          <input
            type="text"
            name="name"
            value={tournamentData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Sport:
          <select
            name="sport"
            value={tournamentData.sport || ""}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select a sport
            </option>
            {sportsOptions.map((sport, index) => (
              <option key={index} value={sport.name}>
                {sport.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Max Participants:
          <input
            type="number"
            name="max_size"
            value={tournamentData.max_size}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Current Participants:
          <input
            type="number"
            name="current_size"
            value={tournamentData.current_size}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Update Tournament</button>
      </form>
    </div>
  );
}

export default UpdateTournament;