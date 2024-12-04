import express from 'express';
import register from './routes/register-user.js';
import login from './routes/login-user.js';
import createTournament from './routes/create-tournament.js'
import searchTournaments from './routes/search-tournaments.js'
import updateTournament from './routes/update-tournament.js'
import deleteTournament from './routes/delete-tournament.js'
import reset from './routes/reset-password.js'
import cors from 'cors';

const app = express();
const port = 3000;

//parse json for object format for request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", register);
app.use("/api", login);
app.use("/api", searchTournaments);
app.use("/api", createTournament);
app.use("/api", updateTournament);
app.use("/api", deleteTournament);
app.use("/api", reset);

app.get("/", (req, res) => {
    res.send("server is running");
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

export default app;