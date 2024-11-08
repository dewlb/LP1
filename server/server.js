import express from 'express';
import register from './routes/Register.js';
import login from './routes/Login.js';
import readTournament from './routes/ReadTournament.js'
import createTournament from './routes/CreateTournament.js'

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api", register);
app.use("/api", login);
app.use("/api", readTournament);
app.use("/api", createTournament)

app.get("/", (req, res) => {
    res.send("server is running");
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

