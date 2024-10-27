import express from "express";
import axios from "axios";
import User from "../models/User";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
const router = express.Router();

env.config();
const mongoURI = "";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,       
    useUnifiedTopology: true,    
    useCreateIndex: true        
})
.then(() => {
    console.log('Successfully connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

const upsertUser = async (userData) => {
    try {
        // Check if user exists by Google ID or email
        let user = await User.findOne({ email: userData.email });

        if (user) {
            user.googleId = userData.id;  
            user.name = userData.name;
            await user.save();  
        } else {
            user = new User({
                googleId: userData.id,
                name: userData.name,
                email: userData.email
            });
            // Save new user to the database
            await user.save();  
        }

        return user;  // Return the user object
    } catch (error) {
        console.error('Error saving user to the database', error);
        throw error;
    }
};

const getToken = async (authCode) => {
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        code: authCode,
        client_id: process.env.GOOGlE_CLIENT_ID,
        client_secret: process.env.GOOGlE_CLIENT_SECRET,
        grant_type: 'authorization_code',
    });
    return tokenResponse.data.access_token;
};

const getUserInfo = async (accessToken) => {
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return userResponse.data;
};

router.post("OAuth", (req, res) => {
    const {authCode} = req.body;
    
    const accessToken = getToken(authCode);

    const userData = getUserInfo(accessToken);

    upsertUser(userData);
})

module.exports = router;