import express from 'express';
import register from './routes/register-user.js';
import login from './routes/login.js';
import createTournament from './routes/create-tournament.js'
import searchTournaments from './routes/search-tournaments.js'
import updateTournament from './routes/update-tournament.js'

const app = express();
const port = 3000;

//parse json for object format for request
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api", register);
app.use("/api", login);
app.use("/api", searchTournaments);
app.use("/api", createTournament);
app.use("/api", updateTournament);

app.get("/", (req, res) => {
    res.send("server is running");
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
