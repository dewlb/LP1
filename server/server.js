import express from "express";
import sendVerificationEmail from "./emailService.js";
import OAuth from "./routes/OAuth.js";

const app = express();
const port = 3000;

app.use("/api", OAuth);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
