import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './UpdateTournament.css';
import { IoIosArrowRoundBack } from "react-icons/io";

const CreateTournament: React.FC = () =>
{

    // Initialize state
    const [name, setName] = useState<string>("");
    const [maxSize, setMaxSize] = useState<number>(0);
    const [format, setFormat] = useState<string>("");
    const [sport, setSport] = useState<string>("");
    const [start, setStart] = useState<string>("");
    const [end, setEnd] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [isError, setIsError] = useState<boolean>(false);
    const [userID, setID] = useState<string>("");

    useEffect(() => {
        const userInfo = localStorage.getItem("user-info");
        if (userInfo) {
          const user = JSON.parse(userInfo);
          setID(user._id);
          console.log("USERID:", userID);
        }
    }, []);

    const handleCreateTournament = async () =>
    {
        const payload = {
            userID: userID,
            name,
            size: maxSize,
            format,
            sport,
            start,
            end,
        };

        try
        {
            const response = await fetch("http://cop4331-team14.xyz:3000/api/createTournament", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok)
            {
                throw new Error("Tournament name already taken.");
            }

            const data = await response.json();
            setIsError(false);
            setMessage(data.message || "Tournament created successfully");
        } catch (error)
        {
            console.error("Error updating tournament:", error);
            setIsError(true);
            setMessage("Tournament with that name already exists.");
        }
    };

    return (
        <div className="update-tournament-form">
            <Link to="/dashboard">
                <IoIosArrowRoundBack size={30} />
            </Link>
            <h2>Create Tournament</h2>
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
                min={new Date().toISOString().split("T")[0]} // Set minimum date to today
                onChange={(e) => setStart(e.target.value)}
            />
            <input
                type="date"
                placeholder="End Date"
                value={end || ""}
                min={start || new Date().toISOString().split("T")[0]} // End date should be after start or today
                onChange={(e) => setEnd(e.target.value)}
            />

            <button onClick={handleCreateTournament}>Create Tournament</button>
            <p style={{ color: isError ? "red" : "green" }}>{message}</p>
        </div>
    );
};

export default CreateTournament;
