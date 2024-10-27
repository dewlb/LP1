import express from 'express';
import { MongoClient } from 'mongodb';
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import jwt from "jsonwebtoken";  
import dotenv from 'dotenv';
import bodyParser from "body-parser";
dotenv.config();

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize()); 

const url = process.env.MONGO_URI;
const client = new MongoClient(url);
client.connect();
const db = client.db("data"); 
const userCollection = db.collection("users"); 

const upsertUser = async (userData) => {
    try {
        const user = await userCollection.findOne({ email: userData.email });

        if (user) {
            await userCollection.updateOne(
                { email: userData.email },
                { $set: { googleId: userData.id, name: userData.name } }
            );
            return { ...user, googleId: userData.id, name: userData.name }; 
        } else {
            const newUser = {
                googleId: userData.id,
                name: userData.name,
                email: userData.email,
            };
            const result = await userCollection.insertOne(newUser);
            return { ...newUser, _id: result.insertedId }; 
        }
    } catch (error) {
        console.error('Error saving user to the database', error);
        throw error;
    }
};

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/api/success",
            userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
            scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, cb) => {
            console.log("Callback function reached");
            console.log("Access Token:", accessToken);
            console.log("Profile:", profile);
            try {
                const user = await upsertUser({
                    id: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                });
                console.log("user:", user);
                return cb(null, user);
            } catch (error) {
                return cb(error, null);
            }
        }
    )
);


router.get(
    "/success",
    passport.authenticate("google", { session: false, failureRedirect: "/" }),
    (req, res) => {
        const user = req.user;

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login Successful", token });  
    }
);

router.get(
    "/OAuth",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,   
    })
);

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;  
        next();
    });
};

export default router;
