import express from 'express';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

const router = express.Router();

// set up MongoDB connection
const url = process.env.MONGO_URI;
const db_name = process.env.DATABASE_NAME;
const collection_name = process.env.TOURNAMENT_COLLECTION;

const client = new MongoClient(url);
await client.connect();
const db = client.db(db_name);
const tournament_Collection = db.collection(collection_name);

// createTournament endpoint
router.post('/createTournament', async(req, res) => {
    const {name, userID} = req.body;
    const inputTournament = {
        name: name,
        owner: userID,
        participants: []
    }

    try{
        const tournament = await tournament_Collection.findOne({name: name});

        if(tournament){
            res.status(409).json({message: "Tournament with this name already exists"});
        }
        else{
            await tournament_Collection.insertOne(inputTournament);
            res.status(200).json({message: "Tournament created succesfully", info: inputTournament});
        }
    }
    catch(error){
        console.message("Error creating tournament: ", error);
        res.status(401).json({message: "Unable to create tournament"});
    }

});

export default router;
