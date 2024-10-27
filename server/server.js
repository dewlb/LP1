import express from "express";
import sendVerificationEmail from "./emailService.js";
import dotenv from 'dotenv';
import OAuth from "./routes/OAuth.js";

dotenv.config({ path: '/Users/seb/Desktop/LP1/server/env/.env' });

const app = express();
const port = 3000;

app.use("/api/login", OAuth);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
