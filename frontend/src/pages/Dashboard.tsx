import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { IoIosAddCircleOutline } from "react-icons/io";
import { LuSearch } from "react-icons/lu";
import "./Dashboard.css";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { TbTournament } from "react-icons/tb";
import Tournament from "./TournamentPage";

interface Tournament {
  _id: string;
  name: string;
  current_size: number;
  max_size: number;
  participants: string[];
  start: number;
  end: number;
}

function Dashboard() {
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [userID, setID] = useState("");
  const [createdTournaments, setCreatedTournaments] = useState<Tournament[]>(
    []
  );
  const [joinedTournaments, setJoinedTournaments] = useState<Tournament[]>([]);
  const [activeTab, setActiveTab] = useState<"created" | "joined">("created");

  useEffect(() => {
    const userInfo = localStorage.getItem("user-info");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setName(user.firstName);
      setID(user._id);
    }
  }, []);

  useEffect(() => {
    if (userID) {
      loadCreatedTournaments();
      loadJoinedTournaments();
    }
  }, [userID]);

  // Function to delete a tournament
  async function deleteTournament(tournamentId: string) {
    try {
      const response = await fetch(
        `http://cop4331-team14.xyz:3000/api/deleteTournament/${tournamentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Tournament deleted successfully!");
        // Reload the tournaments after deletion
        loadCreatedTournaments();
      } else {
        alert("Failed to delete tournament.");
      }
    } catch (error) {
      console.error("Error deleting tournament:", error);
      alert("Error deleting tournament.");
    }
  }

  // Function to search tournaments based on the search query
  async function searchTournament() {
    if (search.trim() === "") {
      // If the search input is empty, load all tournaments again
      loadCreatedTournaments(); // reload created tournaments
      loadJoinedTournaments(); // reload joined tournaments
      return;
    }

    try {
      const response = await fetch(
        "http://cop4331-team14.xyz:3000/api/searchTournaments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchTerm: search, userId: userID }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.tournaments) {
          // Filter the tournaments based on search term if needed
          const filteredTournaments = data.tournaments.filter(
            (tournament: Tournament) =>
              tournament.name.toLowerCase().includes(search.toLowerCase())
          );
          setCreatedTournaments(filteredTournaments);
          setJoinedTournaments(filteredTournaments);
        }
      } else {
        alert("Error searching tournaments.");
      }
    } catch (error) {
      console.error("Error searching tournaments:", error);
      alert("Error searching tournaments.");
    }
  }

  // Load tournaments the user created
  async function loadCreatedTournaments() {
    try {
      const response = await fetch(
        "http://cop4331-team14.xyz:3000/api/searchTournaments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userID }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.tournaments) {
          setCreatedTournaments(data.tournaments);
        }
      } else {
        console.error(
          "Failed to fetch created tournaments:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching created tournaments:", error);
    }
  }

  async function loadJoinedTournaments() {
    try {
      const response = await fetch(
        "http://cop4331-team14.xyz:3000/api/searchTournaments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userID }), // Pass the userId here
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.tournaments) {
          const joinedTournaments = data.tournaments.filter(
            (tournament: Tournament) => {
              return tournament.participants.includes(userID); // User is in the participants list
            }
          );
          setJoinedTournaments(joinedTournaments);
        }
      } else {
        console.error(
          "Failed to fetch joined tournaments:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching joined tournaments:", error);
    }
  }

  return (
    <div className="background">
      <h1 className="greeting">Hello {name}!</h1>
      <Link to="/" className="logout-button">
        <TbLogout2 size={50} />
      </Link>

      <div className="dashbody">
        <div className="buttons-group">
          <Link to="/createTournament">
            <button className="create-button">
              <IoIosAddCircleOutline size={35} />
            </button>
          </Link>

          <div className="search-box">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search"
            />
            <button onClick={searchTournament} className="search-button">
              <LuSearch size={25} />
            </button>
          </div>
        </div>
        <h3 className="join">Want to join a tournament instead?</h3>
        <div className="join-container">
          <Link to="/joinTournament">
            <button className="join-btn">Join Tournament!</button>
          </Link>
        </div>
        {/* Tabs */}
        <div className="tabs">
          <div
            className={`tab ${activeTab === "created" ? "active" : ""}`}
            onClick={() => setActiveTab("created")}
          >
            Created Tournaments
          </div>
          <div
            className={`tab ${activeTab === "joined" ? "active" : ""}`}
            onClick={() => setActiveTab("joined")}
          >
            Joined Tournaments
          </div>
        </div>
        {/* Tab content */}
        {activeTab === "created" && (
          <div className="tab-content">
            {/* Display Created Tournaments */}
            <table className="t-history">{/* table headers and rows */}</table>
          </div>
        )}
      </div>

      <div className="Tournament-History">
        {activeTab === "created" && (
          <>
            <h2 className="heading">Tournaments</h2>
            <table className="t-history">
              <thead>
                <tr>
                  <th>Name</th>
                  <th> Start Date</th>
                  <th> End Date</th>
                  <th>Current Participants</th>
                  <th>Total Participants</th>
                  <th>Participants</th>
                  <th>Update/Delete</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {createdTournaments.map((tournament) => (
                  <tr key={tournament._id}>
                    <td>{tournament.name}</td>
                    <td>{tournament.start}</td>
                    <td>{tournament.end}</td>
                    <td>{tournament.current_size}</td>
                    <td>{tournament.max_size}</td>
                    <td>{tournament.participants.join(", ")}</td>
                    <td>
                      <Link to={`/UpdateTournament/${tournament._id}`}>
                        <button className="update-btn">
                          <CiEdit />
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this tournament?"
                            )
                          ) {
                            deleteTournament(tournament._id);
                          }
                        }}
                        className="delete-btn"
                      >
                        <MdDeleteOutline />
                      </button>
                    </td>
                    <td>
                      <Link to={`/TournamentDetails/${tournament._id}`}>
                        <button className="view-btn">
                          <TbTournament />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "joined" && (
          <>
            <h2 className="heading">Tournaments</h2>
            <table className="t-history">
              <thead>
                <tr>
                  <th>Name</th>
                  <th> Start Date</th>
                  <th> End Date</th>
                  <th>Current Participants</th>
                  <th>Total Participants</th>
                  <th>Participants</th>
                  <th>Update/Delete</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {joinedTournaments.length > 0 ? (
                  joinedTournaments.map((tournament) => (
                    <tr key={tournament._id}>
                      <td>{tournament.name}</td>
                      <td>{tournament.start}</td>
                      <td>{tournament.end}</td>
                      <td>{tournament.current_size}</td>
                      <td>{tournament.max_size}</td>
                      <td>{tournament.participants.join(", ")}</td>
                      <td>
                        <Link to={`/TournamentDetails/${tournament._id}`}>
                          <button className="view-btn">
                            <TbTournament />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10}>
                      You have not joined any tournaments yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
