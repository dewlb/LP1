import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, sparse: true },   
    name: String,
    login: String,
    password: String,
    email: { type: String, unique: true },    
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
