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

// deleteTournament endpoint
router.post('/deleteTournament', async(req, res) => {

    const {tournamentID} = req.body;
    console.log(tournamentID);
    //const id = tournamentID.tournamentID;   //extract the tournament ID field  (no longer needed)

    try{
        const tournament = await tournament_Collection.findOne({_id: ObjectId.createFromHexString(tournamentID)});

        if(tournament){
            await tournament_Collection.deleteOne(tournament);
            res.status(200).json({message: "Tournament succesfully deleted"});
        }
        else{
            res.status(409).json({message: "No such tournament found"});
        }
    }
    catch(error){
        console.log("Error deleting tournament: ", error);
        res.status(401).json({message: "Error deleting tournament"});
    }
    finally{
        await client.close();
        console.log("MongoDB connection closed");
    }
});

export default router;
