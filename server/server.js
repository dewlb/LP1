import express from "express";
import sendVerificationEmail from "./emailService.js";
import dotenv from 'dotenv';

dotenv.config({ path: '/Users/seb/Desktop/LP1/server/env/.env' });

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

sendVerificationEmail('sebastian112403@gmail.com', 'FUCK');
