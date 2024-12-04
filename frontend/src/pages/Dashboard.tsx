import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
//import { IoMenu } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import { LuSearch } from "react-icons/lu";
import "./Dashboard.css";

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
  const [username, setUsername] = useState("");
  const [search, setSearch] = useState("");
  const [userID, setID] = useState("");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);


  

  useEffect(() => {
    const userInfo = localStorage.getItem("user-info");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setUsername(user.username);
      setID(user._id);
      //loadTournaments();
      console.error("USERID:", userID);
      console.error("USER:", username);
    }
  }, []);

  useEffect(() => {
    if (userID) {
      loadTournaments();
      console.error("Hello I am in here.")
    }
  }, [userID]);  // Trigger this effect whenever userID changes

  async function searchTournament()
  {
    let searchQuery = {search};
    console.warn(searchQuery);

    
    try
    {
    let result = await fetch("http://cop4331-team14.xyz:3000/api/searchTournaments", {
        method: 'POST',
        body: JSON.stringify(searchQuery),
        headers: {
            "Content-Type" : 'application/json',
            "Access-Control-Allow-Origin" : 'application/json',
            "Accept": 'application/json'
        }
    } ); 

    if( result.status == 500 )
      {
        console.warn("result code", result);
      } 

                  
     

  } //end of try
  catch (error) {
    console.error("Error:", error);
    //setMessage('Failed to connect to the server. Please try again later.');
}
  } 


  async function loadTournaments() {
    try {
      const response = await fetch("http://cop4331-team14.xyz:3000/api/searchTournaments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userID,
          page: 1,
          limit: 10,
        }),
      });

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
      <h1 className="greeting">Hello {username}!</h1>
      <Link to="/" className="logout-button">
        <TbLogout2 size={35} />
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

        <div className="Tournament-History">
          <h2 className="heading">Tournaments</h2>
          <table className="t-history">
            <thead>
              <tr>
                <th>Name</th>
                <th>Current Participants</th>
                <th>Total Participants</th>
                <th>Participants</th>
                <th>Update/Delete</th>
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
                      ? tournament.participants.filter((p) => typeof p === "string").join(", ") 
                      : ""}
                  </td>
                  <td>
                  <Link to={`/UpdateTournament/${tournament._id}`}><button className="update-btn">Update</button></Link>
                    <button className="delete-btn">Delete</button>
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
