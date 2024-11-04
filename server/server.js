import express from 'express';
//import register from './routes/Register.js';
import register from './routes/Login.js';

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api", register);

app.get("/", (req, res) => {
    res.send("server is running");
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

