import express from 'express';
import register from './routes/Register.js';
import login from './routes/Login.js';
import createTournament from './routes/CreateTournament.js';
import deleteTournament from './routes/DeleteTournament.js';

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api", register);
app.use("/api", login);
app.use("/api", createTournament);
app.use("/api", deleteTournament);

app.get("/", (req, res) => {
    res.send("server is running");
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
