import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
//import { IoMenu } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import { LuSearch } from "react-icons/lu";
import "./Dashboard.css";

// New
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { TbTournament } from "react-icons/tb";

///

//add
//import { CiUser, CiLock } from "react-icons/ci";

// Define Tournament interface
interface Tournament {
  _id: string;
  name: string;
  current_size: number;
  max_size: number;
  participants: string[];
}

function Dashboard() {
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [userID, setID] = useState("");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [, setTournID] = useState("");

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

  useEffect(() => {
    if (userID) {
      loadTournaments();
      console.error("Hello I am in here.");
    }
  }, [userID]); // Trigger this effect whenever userID changes



  //Search your tournaments
  async function searchTournament() {
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
        userId: userID, // Include userId for filtering based on the logged-in user
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
  

  //Delete
  async function deleteTournament(tournamentID: string) {
    try {
      setTournID(tournamentID); // Set the selected tournament ID
      const response = await fetch(
        "http://cop4331-team14.xyz:3000/api/deleteTournament",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tournamentID,
          }),
        }
      );

      if (response.ok) {
        console.log("Tournament deleted successfully.");
        // Optionally, reload tournaments to reflect changes in the UI
        loadTournaments();
      } else {
        console.error("Failed to delete tournament:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting tournament:", error);
    }
  }

  async function loadTournaments() {
    try {
      const response = await fetch(
        "http://cop4331-team14.xyz:3000/api/searchTournaments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userID,
            page: 1,
            limit: 10,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.tournaments) {
          setTournaments(data.tournaments as Tournament[]); // Explicitly cast if needed
        } else {
          console.warn("No tournaments found");
        }
      } else {
        console.error("Failed to fetch tournaments:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
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

        <div className="join-container">
            <h3 className="join">Want to join a tournament instead?</h3>
            <Link to="/joinTournament"><button className="join-btn">Find a Tournament!</button></Link>
        </div>

        <div className="Tournament-History">
          <h2 className="heading">Created Tournaments</h2>
          <table className="t-history">
            <thead>
              <tr>
                <th>Name</th>
                <th>Current Participants</th>
                <th>Total Participants</th>
                <th>Participants</th>
                <th>Update/Delete</th> {/* Update/Delete Column */}
                <th>View</th> {/* View Column */}
              </tr>
            </thead>
            <tbody>
              {tournaments.map((tournament) => (
                <tr key={tournament._id}>
                  <td>{tournament.name}</td>
                  <td>{tournament.current_size}</td>
                  <td>{tournament.max_size}</td>
                  <td>
                    {Array.isArray(tournament.participants)
                      ? tournament.participants
                          .filter((p) => typeof p === "string")
                          .join(", ")
                      : ""}
                  </td>
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
                    {/* View Column */}
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
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
