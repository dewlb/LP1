import express from 'express';
import connectMongo from '../utils/connect-mongo';

const router = express.Router(); 

// createTournament endpoint
router.post('/createTournament', async(req, res) => {

    // mongodb connection
    const {collection, client} = await connectMongo('tournaments');

    const {name, userID, size} = req.body;

    // tournament to be added to database
    const inputTournament = {
        name: name,
        owner: userID,
        max_size: size,
        current_size: 0,
        participants: []
    }

    try{
        const tournament = await collection.findOne({name: name});

        if(tournament){
            res.status(409).json({error: "Tournament with this name already exists"});
        }
        else{
            await collection.insertOne(inputTournament);
            res.status(200).json({message: "Tournament created succesfully", info: inputTournament});
        }
    }
    catch(error){
        console.message("Error creating tournament: ", error);
        res.status(401).json({error: "Unable to create tournament"});
    }
    finally{
        await client.close();
        console.log("MongoDB connection closed");
    }

});

export default router;
