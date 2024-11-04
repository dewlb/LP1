import express from 'express';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

// set up MongoDB connection
const url = 'mongodb+srv://Team14:COP4331-Team14X@cluster0.pbs1o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url);
await client.connect();
const db = client.db('gameplan');
const userCollection = db.collection('users');

// login endpoint
router.post('/login', async(req, res) => {
    const {username, password} = req.body;

    try{
        const user = await userCollection.findOne({username, password});

        if(user){
            res.status(200).json({message: "Login successful", info: user});
        }
        else{
            res.status(401).json({message: "Invalid username or password"});
        }
    }catch(error){
        console.error("Error logging in:", error);
        res.status(500).json({message: "Internal server error"});
    }

});

export default router;
