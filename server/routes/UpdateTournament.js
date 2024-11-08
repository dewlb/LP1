import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
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

// updateTournament endpoint
router.post('/updateTournament', async(req, res) => {
    const {name, max_size, current_size, participants, tournamentID} = req.body;
    const inputTournament = {
        name: name,
        max_size: max_size,
        current_size: current_size,
        participants: participants,
        tournamentID: tournamentID
    }

    try{
        // create updatedTournament object with same values as inputTournament except tournamentID so object id is not changed
        const { tournamentID, ...updatedTournament } = inputTournament;

        await tournament_Collection.updateOne( {_id: ObjectId.createFromHexString(tournamentID)}, {$set: updatedTournament} );

        res.status(200).json({message: "Tournament updated succesfully"});
    }
    catch(error){
        console.log("Error updating tournament: ", error);
        res.status(401).json({message: "Error updating tournament"});
    }
    finally{
        await client.close();
        console.log("MongoDB connection closed");
    }
});

export default router;
